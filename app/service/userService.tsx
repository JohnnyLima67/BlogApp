import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../firebaseConfig"; // ✅ importar db

// Interface para usuários
export interface User {
  id: string;
  name: string;
  email: string;
  role: "aluno" | "professor" | "admin";
  createdAt: string;
}

// Coleção de usuários
const usersCollection = collection(db, "users");

// Criar usuário (ex: usado por admin para adicionar manualmente)
export const createUser = async (user: Partial<User>) => {
  try {
    const docRef = await addDoc(usersCollection, {
      name: user.name,
      email: user.email,
      role: user.role || "aluno", // default aluno
      createdAt: new Date().toISOString(),
    });

    await updateDoc(docRef, { id: docRef.id });
    console.log("User created with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding user: ", e);
    throw e;
  }
};

// Buscar usuário por ID
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as User;
    } else {
      console.log("No such user!");
      return null;
    }
  } catch (e) {
    console.error("Error getting user: ", e);
    throw e;
  }
};

// Atualizar usuário
export const updateUser = async (userId: string, updatedData: Partial<User>) => {
  try {
    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, { ...updatedData });
    console.log("User updated with ID: ", userId);
  } catch (e) {
    console.error("Error updating user: ", e);
    throw e;
  }
};

// Deletar usuário
export const deleteUser = async (userId: string) => {
  try {
    const docRef = doc(db, "users", userId);
    await deleteDoc(docRef);
    console.log("User deleted with ID: ", userId);
  } catch (e) {
    console.error("Error deleting user: ", e);
    throw e;
  }
};

// Buscar todos os usuários
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const querySnapshot = await getDocs(usersCollection);
    return querySnapshot.docs.map((doc) => doc.data() as User);
  } catch (e) {
    console.error("Error getting users: ", e);
    throw e;
  }
};

// ✅ Buscar usuários por role
export const getUsersByRole = async (role: "aluno" | "professor" | "admin"): Promise<User[]> => {
  try {
    const q = query(usersCollection, where("role", "==", role));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as User[];
  } catch (e) {
    console.error("Error getting users by role: ", e);
    throw e;
  }
};

export const getUserRole = async (userId: string): Promise<string | null> => {
  try {
    const user = await getUserById(userId);
    return user ? user.role : null;
  } catch (e) {
    console.error("Error getting user role: ", e);
    throw e;
  }
};