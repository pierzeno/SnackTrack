import { PlannedRoute, RouteSegment, StoreGraph } from "../types/map";
import { aStarPath } from "./pathfinding";


/**
* Compute an item visit order using Nearest Neighbor + 2‑opt.
* Then stitch A* paths between waypoints (Entrance → items → Checkout).
*/
export function planRoute(
graph: StoreGraph,
waypoints: string[],
entranceNodeId: string,
checkoutNodeId: string
): PlannedRoute {
const order = nearestNeighbor(entranceNodeId, waypoints, graph) as string[];
const improved = twoOpt(order, graph);


const visit = [entranceNodeId, ...improved, checkoutNodeId];
const segments: RouteSegment[] = [];
let length = 0;
for (let i = 0; i < visit.length - 1; i++) {
const from = visit[i]; const to = visit[i + 1];
const pathNodeIds = aStarPath(graph, from, to);
segments.push({ from, to, pathNodeIds });
length += pathLength(graph, pathNodeIds);
}
return { orderedItemIds: improved, segments, length };
}


function nearestNeighbor(start: string, points: string[], graph: StoreGraph) {
const remaining = new Set(points);
const order: string[] = [];
let current = start;
while (remaining.size) {
let best: string | null = null; let bestD = Infinity;
for (const p of remaining) {
const d = nodeDist(graph, current, p);
if (d < bestD) { bestD = d; best = p; }
}
order.push(best!);
remaining.delete(best!);
current = best!;
}
return order;
}


function twoOpt(order: string[], graph: StoreGraph) {
let improved = true; const arr = order.slice();
while (improved) {
improved = false;
for (let i = 0; i < arr.length - 2; i++) {
for (let k = i + 1; k < arr.length - 1; k++) {
const delta = deltaTwoOpt(arr, i, k, graph);
if (delta < 0) {
reverseSegment(arr, i + 1, k);
improved = true;
}
}
}
}
return arr;
}


function deltaTwoOpt(order: string[], i: number, k: number, graph: StoreGraph) {
const a = order[i]; const b = order[i + 1];
const c = order[k]; const d = order[k + 1];
const oldLen = nodeDist(graph, a, b) + nodeDist(graph, c, d);
const newLen = nodeDist(graph, a, c) + nodeDist(graph, b, d);
return newLen - oldLen;
}


function reverseSegment(arr: string[], start: number, end: number) {
while (start < end) { const t = arr[start]; arr[start] = arr[end]; arr[end] = t; start++; end--; }
}


function nodeDist(graph: StoreGraph, a: string, b: string) {
const A = graph.nodes.find(n => n.id === a)!; const B = graph.nodes.find(n => n.id === b)!;
return Math.hypot(A.x - B.x, A.y - B.y);
}


function pathLength(graph: StoreGraph, ids: string[]) {
let s = 0;
for (let i = 0; i < ids.length - 1; i++) s += nodeDist(graph, ids[i], ids[i + 1]);
return s;
}