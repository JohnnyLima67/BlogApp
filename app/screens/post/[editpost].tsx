import * as ImagePicker from "expo-image-picker";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { auth, db, storage } from "../../firebaseConfig"; // ajuste o caminho

type Post = {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  createdAt: string;
  author: string;
  postImage?: string;
};

export default function EditPost({ route, navigation }: { route: any; navigation?: any }) {
  const { postId } = route.params; // ✅ pega do route.params
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [author, setAuthor] = useState("");

  // Carregar post existente
  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!postId) {
          Alert.alert("Erro", "ID do post não encontrado.");
          return;
        }
        const docRef = doc(db, "posts", String(postId));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const post = docSnap.data() as Post;
          setTitle(post.title);
          setSubtitle(post.subtitle || "");
          setContent(post.content);
          setAuthor(post.author);
          if (post.postImage) setImageUri(post.postImage);
        } else {
          Alert.alert("Error", "Post not found");
        }
      } catch (e) {
        console.error("Failed to load post", e);
      }
    };
    fetchPost();
  }, [postId]);

  const validate = () => {
    if (!title.trim()) {
      Alert.alert("Validation", "Title is required");
      return false;
    }
    if (!content.trim()) {
      Alert.alert("Validation", "Content is required");
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "You need to allow access to photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const savePost = async () => {
    if (!validate() || saving) return;

    setSaving(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "You must be logged in to edit a post.");
        setSaving(false);
        return;
      }

      let imageUrl = imageUri || "";

      // Se a imagem for nova (URI local), faz upload
      if (imageUri && !imageUri.startsWith("http")) {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const storageRef = ref(storage, `posts/${postId}-${Date.now()}.jpg`);
        await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(storageRef);
      }

      const docRef = doc(db, "posts", String(postId));
      await updateDoc(docRef, {
        title: title.trim(),
        subtitle: subtitle.trim(),
        content: content.trim(),
        author: user.displayName || user.email || "Anonymous",
        postImage: imageUrl,
      });

      Alert.alert("Success", "Post updated");
      if (navigation && navigation.goBack) navigation.goBack();
    } catch (e) {
      console.error("Failed to update post", e);
      Alert.alert("Error", "Could not update post");
    } finally {
      setSaving(false);
    }
  };

  const deletePost = async () => {
    try {
      const user = auth.currentUser;
      if (!user || (user.displayName !== author && user.email !== author)) {
        Alert.alert("Error", "You are not allowed to delete this post.");
        return;
      }

      const docRef = doc(db, "posts", String(postId));
      await deleteDoc(docRef);

      Alert.alert("Success", "Post deleted");
      if (navigation && navigation.goBack) navigation.goBack();
    } catch (e) {
      console.error("Failed to delete post", e);
      Alert.alert("Error", "Could not delete post");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Edit Post</Text>

        <Text style={styles.label}>Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Enter title"
          style={styles.input}
          returnKeyType="next"
        />

        <Text style={styles.label}>Subtitle (optional)</Text>
        <TextInput
          value={subtitle}
          onChangeText={setSubtitle}
          placeholder="Enter subtitle"
          style={styles.input}
          returnKeyType="next"
        />

        <Text style={styles.label}>Content</Text>
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="Write your post..."
          style={[styles.input, styles.contentInput]}
          multiline
          textAlignVertical="top"
        />
        <Text style={styles.counter}>{content.length} characters</Text>

        <Button title="Pick an image" onPress={pickImage} />
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={{ width: "100%", height: 200, marginTop: 12, borderRadius: 8 }}
          />
        )}

        <View style={styles.button}>
          <Button
            title={saving ? "Saving..." : "Update Post"}
            onPress={savePost}
            disabled={saving}
          />
        </View>

        {/* Botão de deletar só aparece se o usuário for o autor */}
        {auth.currentUser &&
          (auth.currentUser.displayName === author ||
            auth.currentUser.email === author) && (
            <View style={styles.button}>
              <Button
                title="Delete Post"
                color="red"
                onPress={() =>
                  Alert.alert("Confirm", "Are you sure you want to delete this post?", [
                    { text: "Cancel", style: "cancel" },
                    { text: "Delete", style: "destructive", onPress: deletePost },
                  ])
                }
              />
            </View>
          )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 12,
  },
  label: {
    marginTop: 12,
    marginBottom: 6,
    fontSize: 14,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  contentInput: {
    minHeight: 160,
    paddingTop: 12,
  },
  counter: {
    alignSelf: "flex-end",
    marginTop: 6,
    color: "#666",
    fontSize: 12,
  },
  button: {
    marginTop: 20,
  },
});
