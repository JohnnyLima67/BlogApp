import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Post, posts } from '../../assets/data/post';

export default function HomeScreen() {
  const router = useRouter();
  const [postsData, setPosts] = useState<Post[]>(posts.slice(0, 1));
  const [loading, setLoading] = useState(false);

  const renderItem = ({ item }: { item: Post }) => (
    <TouchableOpacity onPress={() => router.push(`/post/${item.id}` as any)}>
      <View style={styles.postContainerRow}>
        <View style={styles.postTextContainer}>
          <Text style={styles.postTitle}>{item.title}</Text>
          <Text style={styles.postSubtitle}>{item.subtitle}</Text>
          <Text style={styles.postAuthor}>By {item.author} on {item.date}</Text>
        </View>
        {item.postImage ? (
          <Image source={{ uri: item.postImage }} style={styles.postImageSide} />
        ) : null}
      </View>
    </TouchableOpacity>
  );


  const loadMoreData = () => {
    if (loading) return;
    setLoading(true);
    const newData = posts.slice(postsData.length, postsData.length + 1);
    setTimeout(() => {
      setPosts([...postsData, ...newData]);
      setLoading(false);
    }, 1000);
  };

  return (
    <SafeAreaView  style={{ flex: 1 }}>
      <Text style={styles.title}>Últimos Posts</Text>
      <FlatList
        data={postsData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (renderItem({ item }))}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
        numColumns={1}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <Text>Loading...</Text> : null}
      />
    
      {/* Botão flutuante */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/new')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
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
  postImage: {
    width: '100%',
    height: 200,
    marginBottom: 8,
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
    bottom: 24,      // distância do fundo
    right: 24,       // distância da borda direita
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
    zIndex: 10,      // garante que fique acima dos outros elementos
  },
  fabText: {
    color: '#fff',
    fontSize: 32,
    lineHeight: 32,
    marginBottom: 2,
  },
});
