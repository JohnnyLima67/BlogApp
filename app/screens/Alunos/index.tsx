import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from "../../firebaseConfig"; // ajuste o caminho

type Aluno = {
  uid: string;
  name: string;
  email: string;
};

// Página de Alunos
export default function AlunosScreen() {
  const router = useRouter(); 
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false); 
  const navigation = useNavigation();

  const fetchAlunos = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "users"), where("role", "==", "aluno"));
      const snapshot = await getDocs(q);
      const listaAlunos: Aluno[] = snapshot.docs.map(doc => ({
        uid: doc.id,
        name: doc.data().name,
        email: doc.data().email,
      }));
      setAlunos(listaAlunos);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlunos();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAlunos();
    setRefreshing(false);
  }, []);

  const renderAluno = ({ item }: { item: Aluno }) => (
    <View style={styles.alunoContainer}>
      <Text style={styles.alunoName}>{item.name}</Text>
      <Text style={styles.alunoEmail}>{item.email}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text style={styles.title}>Lista de Alunos</Text>
      <FlatList
        data={alunos}
        keyExtractor={(item) => item.uid}
        renderItem={renderAluno}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListFooterComponent={loading ? <Text>Loading...</Text> : null}
      />

      {/* Botão flutuante */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('RegisterAlunos')} // ajuste para sua rota de cadastro de aluno
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
  alunoContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  alunoName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  alunoEmail: {
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