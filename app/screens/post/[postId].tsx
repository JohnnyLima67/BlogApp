import { useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from "../../firebaseConfig"; // ✅ importar auth

type Post = {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  createdAt: string;
  author: string;
  postImage?: string;
};

export default function PostDetailScreen({ route }: { route: any }) {
  const { postId } = route.params;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, "posts", postId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost(docSnap.data() as Post);
        } else {
          setPost(null);
        }
      } catch (error) {
        console.error("Erro ao carregar post:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Post não encontrado</Text>
      </View>
    );
  }

  const currentUser = auth.currentUser;
  const isAuthor =
    currentUser &&
    (currentUser.displayName === post.author || currentUser.email === post.author);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {post.postImage && (
          <Image source={{ uri: post.postImage }} style={styles.image} />
        )}
        <Text style={styles.title}>{post.title}</Text>
        {post.subtitle ? <Text style={styles.subtitle}>{post.subtitle}</Text> : null}
        <Text style={styles.author}>
          Por {post.author || "Anonymous"} em {new Date(post.createdAt).toLocaleDateString()}
        </Text>
        <Text style={styles.content}>{post.content}</Text>
      </ScrollView>

      {/* Botão flutuante só aparece se o usuário for o autor */}
      {isAuthor && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("screens/post/[editpost]", { postId })}
        >
          <Text style={styles.fabText}>Editar Post</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  author: {
    fontSize: 12,
    color: '#999',
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  fabText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});