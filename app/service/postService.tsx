import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebaseConfig"; // ✅ importar storage

export interface Post {
  id: string;
  author: string;
  title: string;
  subtitle?: string;
  content: string;
  createdAt: string;
  postImage?: string;
}

const postsCollection = collection(db, "posts");

export const createPost = async (post: Partial<Post>, imageFile?: Blob) => {
  try {
    let imageUrl = "";

    // Se houver imagem, faz upload para o Storage
    if (imageFile) {
      const storageRef = ref(storage, `posts/${Date.now()}.jpg`);
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }

    const docRef = await addDoc(postsCollection, {
      author: post.author,
      title: post.title,
      subtitle: post.subtitle || "",
      content: post.content,
      postImage: imageUrl || post.postImage || "",
    });

    await updateDoc(docRef, { id: docRef.id, createdAt: new Date().toISOString() });
    console.log("Post created with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

export const getPostById = async (postId: string): Promise<Post | null> => {
  try {
    const docRef = doc(db, "posts", postId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Post;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (e) {
    console.error("Error getting document: ", e);
    throw e;
  }
};

export const updatePost = async (postId: string, updatedData: Partial<Post>, imageFile?: Blob) => {
  try {
    const docRef = doc(db, "posts", postId);

    let imageUrl = updatedData.postImage || "";

    if (imageFile) {
      const storageRef = ref(storage, `posts/${postId}-${Date.now()}.jpg`);
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }

    await updateDoc(docRef, { ...updatedData, postImage: imageUrl });
    console.log("Post updated with ID: ", postId);
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
};

export const deletePost = async (postId: string) => {
  try {
    const docRef = doc(db, "posts", postId);
    await deleteDoc(docRef);
    console.log("Post deleted with ID: ", postId);
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
};

export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const querySnapshot = await getDocs(postsCollection);
    return querySnapshot.docs.map((doc) => doc.data() as Post);
  } catch (e) {
    console.error("Error getting documents: ", e);
    throw e;
  }
};