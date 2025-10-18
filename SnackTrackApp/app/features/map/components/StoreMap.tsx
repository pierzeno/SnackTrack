import React, { useMemo } from "react";
import { View, Image, StyleSheet } from "react-native";
import Svg, { Circle, Line, Polyline } from "react-native-svg";
import { PlannedRoute, StoreGraph, StoreItem } from "../types/map";


/**
* StoreMap paints an indoor overlay with item pins and the planned route.
* Provide a background image (floor plan) sized to graph.canvas when available.
*/
export function StoreMap({
graph,
items,
highlightedIds,
route
}: {
graph: StoreGraph;
items: StoreItem[];
highlightedIds: string[];
route: PlannedRoute | null;
}) {
const width = graph.canvas?.width ?? 1200;
const height = graph.canvas?.height ?? 800;


const itemNodes = useMemo(() => {
const set = new Set(highlightedIds);
return items.filter(i => set.has(i.id));
}, [items, highlightedIds]);


const nodeById = useMemo(() => {
const m = new Map(graph.nodes.map(n => [n.id, n]));
return (id: string) => m.get(id)!;
}, [graph]);


return (
<View style={styles.wrap}>
{/* Optional background image to match the SVG coordinate system */}
{/* <Image source={require("../../../../assets/images/store_floor_demo.png")} style={{ position: "absolute", width, height }} /> */}
<Svg width={width} height={height}>
{/* Draw route segments */}
{route?.segments.map((seg, idx) => (
<Polyline
key={idx}
points={seg.pathNodeIds.map(id => `${nodeById(id).x},${nodeById(id).y}`).join(" ")}
strokeWidth={6}
strokeLinejoin="round"
strokeLinecap="round"
fill="none"
/>
))}
{/* Draw arrow heads (simple) */}
{route?.segments.flatMap((seg, idx) => {
const ids = seg.pathNodeIds;
if (ids.length < 2) return null;
const a = nodeById(ids[ids.length - 2]);
const b = nodeById(ids[ids.length - 1]);
const dx = b.x - a.x; const dy = b.y - a.y; const len = Math.hypot(dx, dy) || 1;
const ux = dx / len; const uy = dy / len; // unit
const tipX = b.x; const tipY = b.y;
const leftX = tipX - ux * 16 + -uy * 8; const leftY = tipY - uy * 16 + ux * 8;
const rightX = tipX - ux * 16 + uy * 8; const rightY = tipY - uy * 16 + -ux * 8;
return (
<>
<Line key={`L${idx}`} x1={tipX} y1={tipY} x2={leftX} y2={leftY} strokeWidth={4} />
<Line key={`R${idx}`} x1={tipX} y1={tipY} x2={rightX} y2={rightY} strokeWidth={4} />
</>
);
})}
{/* Draw item pins */}
{itemNodes.map(it => {
const n = graph.nodes.find(n => n.id === it.nodeId)!;
return <Circle key={it.id} cx={n.x} cy={n.y} r={10} />;
})}
</Svg>
</View>
);
}


const styles = StyleSheet.create({ wrap: { alignItems: "center", justifyContent: "center" } });