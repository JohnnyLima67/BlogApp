import * as ImagePicker from "expo-image-picker";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
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

export default function CreatePost({ navigation }: { navigation?: any }) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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
        Alert.alert("Error", "You must be logged in to create a post.");
        setSaving(false);
        return;
      }

      let imageUrl = "";
      if (imageUri) {
        // Faz upload da imagem para o Firebase Storage
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const storageRef = ref(storage, `posts/${Date.now()}.jpg`);
        await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(storageRef);
      }

      const postsCollection = collection(db, "posts");

      // Cria o documento
      const docRef = await addDoc(postsCollection, {
        title: title.trim(),
        subtitle: subtitle.trim(),
        content: content.trim(),
        author: user.displayName || user.email || "Anonymous",
        createdAt: new Date().toISOString(),
        postImage: imageUrl,
      });

      // Atualiza com o ID gerado
      await updateDoc(docRef, { id: docRef.id });

      Alert.alert("Success", "Post saved");
      if (navigation && navigation.goBack) navigation.goBack();

      // Limpa os campos
      setTitle("");
      setSubtitle("");
      setContent("");
      setImageUri(null);
    } catch (e) {
      console.error("Failed to save post", e);
      Alert.alert("Error", "Could not save post");
    } finally {
      setSaving(false);
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
        <Text style={styles.heading}>New Post</Text>

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
            title={saving ? "Saving..." : "Save Post"}
            onPress={savePost}
            disabled={saving}
          />
        </View>
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
