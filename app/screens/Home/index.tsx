import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { getAuth } from "firebase/auth"; // importe o getAuth
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllPosts, Post } from '../../service/postService'; // ajuste o caminho
import { getUserRole } from '../../service/userService'; // importe a função para obter o papel do usuário

const auth = getAuth(); // inicialize o auth

export default function HomeScreen({ role }: { role: string | null }) {
  
  const [userRole, setUserRole] = useState<string | null>(null); // estado para armazenar o papel do usuário
  const router = useRouter();
  const [postsData, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // ✅ estado para pull-to-refresh
  const navigation = useNavigation();

  const fetchUserRole = async () => {
    // Lógica para buscar o papel do usuário atual
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        console.warn("User not authenticated");
        return;
      }
      const userRole = await getUserRole(uid);
      setUserRole(userRole);
      console.log("User role fetched:", userRole);
    } catch (error) {
      console.error("Erro ao buscar o papel do usuário:", error);
    }
  }

  useEffect(() => {
    fetchUserRole();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const posts = await getAllPosts();
      const sortedPosts = posts.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setPosts(sortedPosts);
    } catch (error) {
      console.error("Erro ao carregar posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Função para refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  }, []);

  const renderItem = ({ item }: { item: Post }) => (
    <TouchableOpacity
      onPress={() =>
        (navigation as any).navigate('screens/post/[postId]', { postId: item.id })
      }
      style={styles.postContainer}
    >
      <View style={styles.postContainerRow}>
        <View style={styles.postTextContainer}>
          <Text style={styles.postTitle}>{item.title}</Text>
          <Text style={styles.postSubtitle}>{item.subtitle}</Text>
          <Text style={styles.postAuthor}>
            By {item.author || "Anonymous"} on {item.createdAt}
          </Text>
        </View>
        {item.postImage ? (
          <Image source={{ uri: item.postImage }} style={styles.postImageSide} />
        ) : null}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text style={styles.title}>Últimos Posts</Text>
      <FlatList
        data={postsData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
        numColumns={1}
        ListFooterComponent={loading ? <Text>Loading...</Text> : null}
        refreshing={refreshing}          // ✅ ativa indicador de refresh
        onRefresh={onRefresh}            // ✅ função chamada ao deslizar para cima
      />

      {/* Botão flutuante só para professor */}
      {userRole === "professor" && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('screens/post/newpost')}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  postAuthor: {
    fontSize: 12,
    color: '#999',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
  },
  postContainerRow: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  postImageSide: {
    width: 100,
    height: 100,
    marginRight: 16,
  },
  postTextContainer: {
    flex: 1,
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