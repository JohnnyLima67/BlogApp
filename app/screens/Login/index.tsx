
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";


export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigation = useNavigation();

    const handleInputChange = (field: string, value: string) => {
        if (field === "username") setUsername(value);
        else if (field === "password") setPassword(value);
    };

    const validateInputs = () => {
        if (!username.trim() || !password) {
            setError("Please enter both username and password.");
            return false;
        }
        setError(null);
        return true;
    };
    const handleLogin = () => {
        if (!validateInputs()) return;
        setLoading(true);
        setError(null);
        // Mock authentication call - replace with real API
        setTimeout(() => {
            setLoading(false);
            if (username === "admin" && password === "password") {
                navigation.navigate("screens/Home/index");
            } else {
                setError("Invalid username or password.");
            }
        }, 2000);
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={(text) => handleInputChange("username", text)}
                autoCapitalize="none"
            />
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={(text) => handleInputChange("password", text)}
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.showPasswordButton}>
                    <Text style={styles.showPasswordText}>
                        {showPassword ? "Hide" : "Show"}
                    </Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={[styles.button, loading || !username || !password ? styles.buttonDisabled : null]}
                onPress={handleLogin}
                disabled={loading || !username || !password}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Login</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = {
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        backgroundColor: "#fff",
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    showPasswordButton: {
        marginLeft: 10,
    },
    showPasswordText: {
        color: "#007BFF",
        fontWeight: "bold",
    },
    button: {
        backgroundColor: "#007BFF",
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: "center",
    },
    buttonDisabled: {
        backgroundColor: "#a0a0a0",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    error: {
        color: "red",
        marginBottom: 10,
        textAlign: "center",
    },
};