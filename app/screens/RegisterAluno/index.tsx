import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../firebaseConfig"; // ajuste o caminho

export default function Register() {
  const navigation = useNavigation<any>();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validateEmail = (e: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

  const validateInputs = () => {
    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return false;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
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
      // ✅ Se já existe usuário logado e ele é professor, apenas cria novo user no Firestore
      if (auth.currentUser && auth.currentUser.displayName?.toLowerCase().includes("professor")) {
        const newUserId = `${Date.now()}`; // gera um ID temporário
        await setDoc(doc(db, "users", newUserId), {
          uid: newUserId,
          email,
          name: username,
          role: "aluno", // default aluno
          createdAt: new Date().toISOString(),
        });

        setSuccess("New student account created successfully!");
        setLoading(false);
        return;
      }

      // ✅ Caso contrário, cria e loga normalmente
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: username });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        name: username,
        role: "aluno",
        createdAt: new Date().toISOString(),
      });

      setSuccess("Registration successful!");
      setTimeout(() => {
        navigation.navigate("Feed"); // ajuste para sua rota principal
      }, 1000);
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email already registered.");
      } else {
        setError("Registration failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    loading || !username.trim() || !email.trim() || !password || !confirmPassword;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

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

      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Password"
          value={password}
          secureTextEntry={!showPassword}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.showPasswordButton}
        >
          <Text style={styles.showPasswordText}>
            {showPassword ? "Hide" : "Show"}
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        secureTextEntry={!showPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity
        style={[styles.button, isDisabled ? styles.buttonDisabled : null]}
        onPress={handleRegister}
        disabled={isDisabled}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>

      {/* ❌ Oculta o link "Already have an account" se professor estiver logado */}
      {!auth.currentUser?.displayName?.toLowerCase().includes("professor") && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.linkContainer}
        >
          <Text style={styles.linkText}>Already have an account? Log in</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { height: 50, borderColor: "#ccc", borderWidth: 1, borderRadius: 5, marginBottom: 15, paddingHorizontal: 10, backgroundColor: "#fff" },
  passwordContainer: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  showPasswordButton: { marginLeft: 10 },
  showPasswordText: { color: "#007BFF", fontWeight: "bold" },
  button: { backgroundColor: "#007BFF", paddingVertical: 15, borderRadius: 5, alignItems: "center" },
  buttonDisabled: { backgroundColor: "#a0a0a0" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  error: { color: "red", marginBottom: 10, textAlign: "center" },
  success: { color: "green", marginBottom: 10, textAlign: "center" },
  linkContainer: { marginTop: 15, alignItems: "center" },
  linkText: { color: "#007BFF" },
});