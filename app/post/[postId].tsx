import { useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { posts } from '../../assets/data/post';

export default function PostDetailScreen() {
  const { postId } = useLocalSearchParams();
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Post não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {post.postImage && (
        <Image source={{ uri: post.postImage }} style={styles.image} />
      )}
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.subtitle}>{post.subtitle}</Text>
      <Text style={styles.author}>Por {post.author} em {post.date}</Text>
      <Text style={styles.content}>{post.content}</Text>
    </ScrollView>
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
});