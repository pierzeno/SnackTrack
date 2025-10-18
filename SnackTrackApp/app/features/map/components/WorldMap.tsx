import React, { memo } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useShopData } from "../hooks/useShopData";
import { Shop } from "../types/map";


/**
* WorldMap renders store locations. Tap a marker to navigate to StoreScreen.
*/
export const WorldMap = memo(function WorldMap({ onSelect }: { onSelect: (shop: Shop) => void }) {
const { shops, loading } = useShopData();


if (loading) return <ActivityIndicator style={{ marginTop: 32 }} />;


const initial = shops[0] ?? { latitude: 59.91, longitude: 10.75 };


return (
<View style={styles.container}>
<MapView
style={StyleSheet.absoluteFill}
provider={PROVIDER_GOOGLE}
initialRegion={{
latitude: initial.latitude,
longitude: initial.longitude,
latitudeDelta: 10,
longitudeDelta: 10,
}}
>
{shops.map((s) => (
<Marker
key={s.id}
coordinate={{ latitude: s.latitude, longitude: s.longitude }}
title={s.name}
description={`${s.city}, ${s.country}`}
onPress={() => onSelect(s)}
/>
))}
</MapView>
</View>
);
});


const styles = StyleSheet.create({ container: { flex: 1 } });