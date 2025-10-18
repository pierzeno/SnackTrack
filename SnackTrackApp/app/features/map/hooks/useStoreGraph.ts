import { useEffect, useMemo, useState } from "react";
import { StoreGraph, StoreItem } from "../types/map";


/**
* Loads store graph (layout) and item catalog for a given store id.
* In production, swap demo imports for real endpoints:
* /api/stores/:id/graph and /api/stores/:id/items
*/
export function useStoreGraph(storeId: string) {
const [graph, setGraph] = useState<StoreGraph | null>(null);
const [items, setItems] = useState<StoreItem[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);


useEffect(() => {
let active = true;
async function load() {
setLoading(true);
try {
const g = await import("../data/store_graph_demo.json");
const it = await import("../data/items_demo.json");
if (!active) return;
setGraph(g.default as StoreGraph);
setItems(it.default as StoreItem[]);
} catch (e: any) {
setError(e?.message ?? "Failed to load store graph");
} finally {
setLoading(false);
}
}
load();
return () => {
active = false;
};
}, [storeId]);


const nodeById = useMemo(() => {
const map = new Map<string, { x: number; y: number; neighbors: string[] }>();
graph?.nodes.forEach(n => map.set(n.id, n));
return map;
}, [graph]);


return { graph, items, nodeById, loading, error };
}