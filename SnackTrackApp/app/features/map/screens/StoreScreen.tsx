import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SearchBar } from "../components/SearchBar";
import { RecommendationsPanel } from "../components/RecommendationsPanel";
import { StoreMap } from "../components/StoreMap";
import { useStoreGraph } from "../hooks/useStoreGraph";
import { planRoute } from "../logic/tsp";


/**
* StoreScreen displays an indoor map, search bar, and recommendations.
* It plans the fastest path through searched items.
*/
export default function StoreScreen({ route }: any) {
const { storeId, storeName } = route.params;
const { graph, items, loading, error } = useStoreGraph(storeId);


const [query, setQuery] = useState("");
const filtered = useMemo(() => {
const q = query.trim().toLowerCase();
if (!q) return [];
return items.filter(i => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
}, [query, items]);


const planned = useMemo(() => {
if (!graph || filtered.length === 0) return null;
const entrance = graph.pois.find(p => p.key === "ENTRANCE")?.nodeId!;
const checkout = graph.pois.find(p => p.key === "CHECKOUT")?.nodeId!;
const waypoints = filtered.map(f => f.nodeId);
return planRoute(graph, waypoints, entrance, checkout);
}, [graph, filtered]);


if (loading) return <Text style={{ padding: 16 }}>Loading store map…</Text>;
if (error || !graph) return <Text style={{ padding: 16 }}>Error: {error ?? "missing graph"}</Text>;


return (
<View style={styles.container}>
<Text style={styles.header}>{storeName}</Text>
<SearchBar onChange={setQuery} />
<View style={styles.content}>
{/* Left/Half: Store map */}
<ScrollView horizontal contentContainerStyle={{ padding: 12 }}>
<StoreMap graph={graph} items={items} highlightedIds={filtered.map(f => f.id)} route={planned} />
</ScrollView>
{/* Right/Bottom: Recommendations */}
<View style={styles.side}>
<RecommendationsPanel itemsInCart={filtered.map(f => f.id)} />
{planned && (
<View style={styles.stats}>
<Text accessibilityLabel="Estimated distance">
Estimated distance: {Math.round(planned.length)} units
</Text>
</View>
)}
</View>
</View>
</View>
);
}


const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: "#fff" },
header: { fontSize: 20, fontWeight: "600", padding: 12 },
content: { flex: 1, flexDirection: "row" },
side: { width: 320, borderLeftWidth: 1, borderColor: "#e5e7eb", padding: 12 },
stats: { marginTop: 12 }
});