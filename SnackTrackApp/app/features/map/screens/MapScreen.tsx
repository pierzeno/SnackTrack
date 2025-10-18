import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { WorldMap } from "../components/WorldMap";
import { Shop } from "../types/map";


/**
* MapScreen hosts the world map and pushes StoreScreen on selection.
* Replace navigation with your app's stack/tab solution.
*/
export default function MapScreen({ navigation }: any) {
function handleSelect(shop: Shop) {
navigation.push("StoreScreen", { storeId: shop.id, storeName: shop.name });
}
return (
<View style={styles.container}>
<Text style={styles.header}>Find a store</Text>
<View style={{ flex: 1 }}>
<WorldMap onSelect={handleSelect} />
</View>
</View>
);
}


const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: "#fff" },
header: { fontSize: 20, fontWeight: "600", padding: 12 }
});