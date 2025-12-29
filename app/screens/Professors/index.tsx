import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from "../../firebaseConfig"; // ajuste o caminho

type Professor = {
  uid: string;
  name: string;
  email: string;
};

// Página de Professores
export default function ProfessoresScreen() {
  const router = useRouter(); 
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false); 
  const navigation = useNavigation();

  const fetchProfessors = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "users"), where("role", "==", "professor"));
      const snapshot = await getDocs(q);
      const profs: Professor[] = snapshot.docs.map(doc => ({
        uid: doc.id,
        name: doc.data().name,
        email: doc.data().email,
      }));
      setProfessors(profs);
    } catch (error) {
      console.error("Erro ao carregar professores:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessors();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProfessors();
    setRefreshing(false);
  }, []);

  const renderProfessor = ({ item }: { item: Professor }) => (
    <View style={styles.professorContainer}>
      <Text style={styles.professorName}>{item.name}</Text>
      <Text style={styles.professorEmail}>{item.email}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text style={styles.title}>Lista de Professores</Text>
      <FlatList
        data={professors}
        keyExtractor={(item) => item.uid}
        renderItem={renderProfessor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListFooterComponent={loading ? <Text>Loading...</Text> : null}
      />

      {/* Botão flutuante */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('RegisterProfessor')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
  },
  professorContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  professorName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  professorEmail: {
    fontSize: 14,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  fabText: {
    color: '#fff',
    fontSize: 32,
    lineHeight: 32,
    marginBottom: 2,
  },
});