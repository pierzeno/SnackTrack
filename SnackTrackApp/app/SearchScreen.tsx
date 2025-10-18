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
  const [highlights, setHighlights] = useState<{ top: string; left: string }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  // 🗺️ Example aisle → map position
  const aislePositions: Record<string, { top: string; left: string }> = {
    'candy chocolate': { top: '10%', left: '80%' },
    'milk': { top: '70%', left: '20%' },
    'cookies cakes': { top: '40%', left: '50%' },
    'breakfast bakery': { top: '55%', left: '40%' },
    'ice cream ice': { top: '80%', left: '70%' },
    'refrigerated pudding desserts': { top: '65%', left: '25%' },
    'bakery desserts': { top: '45%', left: '45%' },
    'protein meal replacements': { top: '30%', left: '70%' },
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    // Clear previous results and highlights immediately
    setResults([]);
    setHighlights([]);
    setLoading(true);
  
    try {
      const response = await fetch(
        `http://10.10.30.134:5282/api/vespa/search?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      const items = data.root?.children || [];
  
      setResults(items);
  
      // 🔍 Find the first aisle from the search results
      const firstAisle = items.length > 0 
        ? items[0].fields.aisle?.toLowerCase().trim() 
        : null;
      
      // 🐛 Debug: Log what aisle we found
      console.log('First aisle:', firstAisle);
  
      // 🗺️ Determine which position to highlight (only one!)
      if (firstAisle && aislePositions[firstAisle as keyof typeof aislePositions]) {
        const position = aislePositions[firstAisle as keyof typeof aislePositions];
        console.log(`Highlighting position:`, position);
        setHighlights([position]);
      } else {
        console.log('No matching position found');
        setHighlights([]);
      }
  
    } catch (error) {
      console.error(error);
      setResults([]);
      setHighlights([]);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 SnackTrack Store Map</Text>

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
          source={require('../assets/images/storemap.png')}
          style={styles.mapImage}
          resizeMode="cover"
        >
          {highlights.map((pos, index) => (
            <TouchableOpacity
                key={index}
                style={[
                styles.redDot,
                { top: pos.top as any, left: pos.left as any }
                ]}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.7}
            />
            ))}

        </ImageBackground>
      </View>

      {/* 📋 Modal popup */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Items found:</Text>

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
    position: 'relative',
  },

  mapImage: {
    flex: 1,
  },

  redDot: {
    position: 'absolute',
    width: 30,
    height: 30,
    backgroundColor: 'red',
    borderRadius: 15,
    opacity: 0.85,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#ff0000',
    shadowOpacity: 0.8,
    shadowRadius: 8,
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
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  resultItem: { marginBottom: 10 },
  itemName: { fontSize: 16, fontWeight: '500' },
  itemAisle: { fontSize: 14, color: '#555' },
});