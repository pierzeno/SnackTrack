import React from "react";
import { View, Text, StyleSheet } from "react-native";


/**
* Shows context‑aware product suggestions.
* Replace mock content with actual recommendation logic.
*/
export function RecommendationsPanel({ itemsInCart }: { itemsInCart: string[] }) {
return (
<View style={styles.card}>
<Text style={styles.title}>Recommendations</Text>
<Text>People often add: Salsa with Chips, Bananas with Milk…</Text>
</View>
);
}


const styles = StyleSheet.create({
card: { backgroundColor: "#fff", padding: 12, borderTopWidth: 1, borderColor: "#e5e7eb" },
title: { fontWeight: "600", marginBottom: 8 }
});