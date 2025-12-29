import { useNavigation } from "@react-navigation/native";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../firebaseConfig"; // ajuste o caminho

export default function RegisterProfessor() {
  const navigation = useNavigation<any>();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validateEmail = (e: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

  const validateInputs = () => {
    if (!username.trim() || !email.trim()) {
      setError("Please fill in all fields.");
      return false;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Busca usuário existente pelo email
      const q = query(collection(db, "users"), where("email", "==", email));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError("No user found with this email.");
        setLoading(false);
        return;
      }

      // Atualiza o primeiro usuário encontrado
      const userDoc = snapshot.docs[0];
      const userRef = doc(db, "users", userDoc.id);

      await updateDoc(userRef, {
        name: username,
        role: "professor",
      });

      console.log("User updated to professor:", userDoc.id);

      setSuccess("User role updated to professor! Redirecting...");
      setTimeout(() => {
        navigation.navigate("Feed"); // ajuste para sua rota principal
      }, 1000);
    } catch (err: any) {
      console.error("Error updating user:", err);
      setError("Failed to update user. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || !username.trim() || !email.trim();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grant Professor Role</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>{success}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        autoCapitalize="none"
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
      />

      <TouchableOpacity
        style={[styles.button, isDisabled ? styles.buttonDisabled : null]}
        onPress={handleRegister}
        disabled={isDisabled}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Grant Role</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.linkContainer}
      >
        <Text style={styles.linkText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { height: 50, borderColor: "#ccc", borderWidth: 1, borderRadius: 5, marginBottom: 15, paddingHorizontal: 10, backgroundColor: "#fff" },
  button: { backgroundColor: "#007BFF", paddingVertical: 15, borderRadius: 5, alignItems: "center" },
  buttonDisabled: { backgroundColor: "#a0a0a0" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  error: { color: "red", marginBottom: 10, textAlign: "center" },
  success: { color: "green", marginBottom: 10, textAlign: "center" },
  linkContainer: { marginTop: 15, alignItems: "center" },
  linkText: { color: "#007BFF" },
});