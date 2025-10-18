import { StoreGraph } from "../types/map";


/**
* A* pathfinding on a sparse graph.
* Nodes are connected via `neighbors`. Cost = Euclidean distance.
*/
export function aStarPath(graph: StoreGraph, startId: string, goalId: string): string[] {
const start = startId;
const goal = goalId;
const nodes = new Map(graph.nodes.map(n => [n.id, n]));


const h = (id: string) => {
const a = nodes.get(id)!; const b = nodes.get(goal)!;
const dx = a.x - b.x; const dy = a.y - b.y;
return Math.hypot(dx, dy);
};


const open = new Set<string>([start]);
const cameFrom = new Map<string, string | null>();
const gScore = new Map<string, number>();
const fScore = new Map<string, number>();
graph.nodes.forEach(n => { gScore.set(n.id, Infinity); fScore.set(n.id, Infinity); cameFrom.set(n.id, null); });
gScore.set(start, 0); fScore.set(start, h(start));


while (open.size) {
let current: string = start;
let best = Infinity;
for (const id of open) {
const f = fScore.get(id)!; if (f < best) { best = f; current = id; }
}
if (current === goal) return reconstruct(cameFrom, current);
open.delete(current);
const currNode = nodes.get(current)!;
for (const nb of currNode.neighbors) {
const nbn = nodes.get(nb)!;
const tentative = gScore.get(current)! + Math.hypot(currNode.x - nbn.x, currNode.y - nbn.y);
if (tentative < gScore.get(nb)!) {
cameFrom.set(nb, current);
gScore.set(nb, tentative);
fScore.set(nb, tentative + h(nb));
open.add(nb);
}
}
}
return [];
}


function reconstruct(cameFrom: Map<string, string | null>, current: string) {
const path: string[] = [current];
while (cameFrom.get(current)) {
current = cameFrom.get(current)!;
path.push(current);
}
return path.reverse();
}