import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Index() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        {/* Icon */}
        <View style={styles.iconBox}>
          <Ionicons name="shield-checkmark" size={28} color="#60a5fa" />
        </View>

        {/* Title */}
        <Text style={styles.title}>LogBook</Text>
    

        {/* Email */}
        <Text style={styles.label}>EMAIL ADDRESS</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={18} color="#60a5fa" />
          <TextInput
            placeholder="example@email.com"
            placeholderTextColor="#9ca3af"
            style={styles.input}
          />
        </View>

        {/* Password */}
        <View style={styles.passwordHeader}>
          <Text style={styles.label}>PASSWORD</Text>
          <Text style={styles.forgot}>FORGOT PIN?</Text>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="key-outline" size={18} color="#60a5fa" />
          <TextInput
            secureTextEntry={!showPassword}
            placeholder="••••••••"
            placeholderTextColor="#9ca3af"
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={18}
              color="#60a5fa"
            />
          </TouchableOpacity>
        </View>

        {/* Remember */}
        <View style={styles.rememberRow}>
          <View style={styles.checkbox} />
          <Text style={styles.rememberText}>
            Remember this terminal session
          </Text>
        </View>

        {/* Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/admin/dashboard")}
        >
          <Ionicons name="log-in-outline" size={18} color="#fff" />
          <Text style={styles.buttonText}>SIGN IN</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* BLUE THEME COLORS */
const BLUE = "#2563eb";
const DARK = "#0a0f1a";
const CARD = "#111827";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    justifyContent: "center",
    padding: 20,
  },

  card: {
    backgroundColor: CARD,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },

  iconBox: {
    alignSelf: "center",
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 13,
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 20,
  },

  label: {
    color: BLUE,
    fontSize: 12,
    marginBottom: 6,
    marginTop: 10,
    fontWeight: "600",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0a0f1a",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 45,
    gap: 10,
    borderWidth: 1,
    borderColor: "#1e3a8a",
  },

  input: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
  },

  passwordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  forgot: {
    color: "#60a5fa",
    fontSize: 12,
  },

  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    gap: 10,
  },

  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 4,
  },

  rememberText: {
    color: "#94a3b8",
    fontSize: 13,
  },

  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BLUE,
    padding: 14,
    borderRadius: 14,
    marginTop: 20,
    gap: 8,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});