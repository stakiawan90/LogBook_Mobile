import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Index() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberPassword, setRememberPassword] = useState(false);

  const router = useRouter();

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Email and Password Required!");
      return;
    }

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!gmailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid Gmail address (@gmail.com)");
      return;
    }

    Alert.alert(
      "Success",
      rememberPassword
        ? "Login successful! (Remembered)"
        : "Login successful!"
    );

    router.push("/admin/dashboard");
  };

  // UPDATED FORGOT PIN
  const handleForgotPassword = () => {
    Alert.alert(
      "Access Denied",
      "Only the admin is allowed to change or recover the password."
    );
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.card}>
              {/* Icon */}
              <View style={styles.iconBox}>
                <Ionicons name="shield-checkmark" size={32} color="#60a5fa" />
              </View>

              {/* Title */}
              <Text style={styles.title}>LogBook</Text>
             

              {/* Email */}
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#60a5fa" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="example@gmail.com"
                  placeholderTextColor="#9ca3af"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Password */}
              <View style={styles.passwordHeader}>
                <Text style={styles.label}>PASSWORD</Text>

                <TouchableOpacity onPress={handleForgotPassword}>
                  <Text style={styles.forgot}>FORGOT PIN?</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="key-outline" size={20} color="#60a5fa" />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#9ca3af"
                  style={styles.input}
                />

                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#60a5fa"
                  />
                </TouchableOpacity>
              </View>

              {/* Remember Password */}
              <View style={styles.rememberRow}>
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    rememberPassword && styles.checkboxActive,
                  ]}
                  onPress={() => setRememberPassword(!rememberPassword)}
                >
                  {rememberPassword && (
                    <Ionicons name="checkmark" size={12} color="#fff" />
                  )}
                </TouchableOpacity>

                <Text style={styles.rememberText}>Remember Password</Text>
              </View>

              {/* Login Button */}
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Ionicons name="log-in-outline" size={20} color="#fff" />
                <Text style={styles.buttonText}>SIGN IN</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a", // Solid dark blue background
  },
  safeArea: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  keyboardView: {
    flex: 1,
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 30,
    padding: 28,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 15,
    borderWidth: 1,
    borderColor: "#334155",
  },
  iconBox: {
    alignSelf: "center",
    backgroundColor: "#0f172a",
    padding: 18,
    borderRadius: 25,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#3b82f6",
    shadowColor: "#3b82f6",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 34,
    color: "#fff",
    textAlign: "center",
    fontWeight: "800",
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 30,
    letterSpacing: 0.5,
  },
  label: {
    color: "#60a5fa",
    fontSize: 11,
    marginBottom: 8,
    marginTop: 15,
    fontWeight: "700",
    letterSpacing: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderRadius: 14,
    paddingHorizontal: 15,
    height: 52,
    gap: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
  },
  passwordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  forgot: {
    color: "#60a5fa",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginTop: 15,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#64748b",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  checkboxActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  rememberText: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "500",
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3b82f6",
    padding: 16,
    borderRadius: 14,
    marginTop: 30,
    gap: 10,
    shadowColor: "#3b82f6",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 1,
  },
});