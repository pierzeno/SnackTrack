import React, { useMemo, useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import debounce from "lodash.debounce";


/**
* SearchBar with debounced callback to filter items.
*/
export function SearchBar({ onChange }: { onChange: (q: string) => void }) {
const [text, setText] = useState("");
const deb = useMemo(() => debounce(onChange, 250), [onChange]);
return (
<View style={styles.wrap}>
<TextInput
accessibilityLabel="Search items"
placeholder="Search items or paste your shopping list"
value={text}
onChangeText={(t) => { setText(t); deb(t); }}
style={styles.input}
/>
</View>
);
}


const styles = StyleSheet.create({
wrap: { padding: 12, backgroundColor: "#fff" },
input: { backgroundColor: "#f3f4f6", borderRadius: 12, padding: 12 }
});