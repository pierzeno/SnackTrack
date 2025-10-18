import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [highlightVisible, setHighlightVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(
        `http://10.10.30.134:5282/api/vespa/search?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      const items = data.root?.children || [];

      setResults(items);
      if (items.length > 0) {
        // show highlight when we get results
        setHighlightVisible(true);
      } else {
        setHighlightVisible(false);
      }
    } catch (error) {
      console.error(error);
      setResults([]);
      setHighlightVisible(false);
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

      {/* 🗺️ Store 3D map */}
      <View style={styles.mapWrapper}>
        <ImageBackground
          source={require('../assets/images/storemap.png')} // 👈 your 3D store image
          style={styles.mapImage}
          resizeMode="cover"
        >
          {highlightVisible && (
            <TouchableOpacity
              style={styles.redDot}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.7}
            />
          )}
        </ImageBackground>
      </View>

      {/* 📋 Modal popup with search results */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>🛒 Items found</Text>

            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.resultItem}>
                  <Text style={styles.itemName}>{item.fields.product_name}</Text>
                  <Text style={styles.itemAisle}>Aisle: {item.fields.aisle}</Text>
                </View>
              )}
            />

            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 80, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderColor: '#ccc', borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 10 },

  mapWrapper: {
    marginTop: 20,
    width: '100%',
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ccc',
  },

  mapImage: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end', // top-right corner
    padding: 20,
  },

  redDot: {
    width: 30,
    height: 30,
    backgroundColor: 'red',
    borderRadius: 15,
    opacity: 0.8,
    shadowColor: '#ff0000',
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 10,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    maxHeight: '60%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  resultItem: { marginBottom: 10 },
  itemName: { fontSize: 16, fontWeight: '500' },
  itemAisle: { fontSize: 14, color: '#555' },
});
