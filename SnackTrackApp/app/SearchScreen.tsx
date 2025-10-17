import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(
        `http://192.168.0.109:5282/api/vespa/search?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      console.log('Vespa Response:', data);

      // The array we want is inside root.children
      setResults(data.root?.children || []);
    } catch (error) {
      console.error(error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍫 SnackTrack</Text>

      <TextInput
        style={styles.input}
        placeholder="Search for a snack..."
        value={query}
        onChangeText={setQuery}
      />

      <Button title={loading ? 'Searching...' : 'Search'} onPress={handleSearch} />

      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}

      {results.length > 0 && (
        <FlatList
          style={{ marginTop: 20 }}
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.itemText}>{item.fields.product_name}</Text>
              <Text style={styles.itemText}>Aisle: {item.fields.aisle}</Text>
            </View>
          )}
        />
      )}

      {!loading && results.length === 0 && (
        <Text style={{ marginTop: 20, textAlign: 'center' }}>No snacks found.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 100, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderColor: '#ccc', borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 10 },
  card: { backgroundColor: '#f5f5f5', padding: 10, borderRadius: 8, marginBottom: 10 },
  itemText: { fontSize: 16 },
});
