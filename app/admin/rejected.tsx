import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView as RNSSafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/context/ThemeContext';
import { getAdminLogsByStatus } from '@/Api/logbook';

export default function Rejected() {
  const [search, setSearch] = useState("");
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { effectiveScheme } = useAppTheme();
  const isDarkTheme = effectiveScheme === "dark";

  const containerBg = isDarkTheme ? "#020617" : "#f1f5f9";
  const cardBg = isDarkTheme ? "#111827" : "#fff";
  const textColor = isDarkTheme ? "#e5e7eb" : "#374151";
  const titleColor = isDarkTheme ? "#f8fafc" : "#dc2626";
  const borderColor = isDarkTheme ? "#334155" : "#e5e7eb";
  const placeholderColor = isDarkTheme ? "#94a3b8" : "#94a3b8";

  useEffect(() => {
    async function loadRejectedLogs() {
      setLoading(true);
      try {
        const fetchedLogs = await getAdminLogsByStatus("rejected");
        setLogs(fetchedLogs);
      } catch (error: any) {
        Alert.alert("Unable to load rejected logs", error?.message || "Please check your connection.");
      } finally {
        setLoading(false);
      }
    }

    loadRejectedLogs();
  }, []);

  // 🔍 FILTER
  const filteredLogs = logs.filter((item) =>
    (item.user?.name ?? item.name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <RNSSafeAreaView style={[styles.container, { backgroundColor: containerBg }]}> 
      <Text style={[styles.title, { color: titleColor }]}>Rejected Logbook</Text>

      {/* 🔍 SEARCH BAR */}
      <TextInput
        style={[styles.search, { backgroundColor: cardBg, borderColor, color: textColor }]}
        placeholder="Search name..."
        placeholderTextColor={placeholderColor}
        value={search}
        onChangeText={setSearch}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#dc2626" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredLogs.map((item) => (
            <View key={item.id} style={[styles.card, { backgroundColor: cardBg, borderColor }]}> 
              {/* NAME */}
              <Text style={[styles.name, { color: titleColor }]}>{item.user?.name ?? item.name ?? "Unknown"}</Text>

              {/* DETAILS */}
              <Text style={[styles.text, { color: textColor }]}>📍 {item.address}</Text>
              <Text style={[styles.text, { color: textColor }]}>📞 {item.contact_number ?? item.contact ?? "-"}</Text>
              <Text style={[styles.text, { color: textColor }]}>📋 {item.activity}</Text>

              {/* TIME */}
              <View style={styles.row}>
                <Text style={styles.time}>Time In: {item.time_in}</Text>
              </View>

              {/* STATUS */}
              <View style={styles.statusBox}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </RNSSafeAreaView>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    padding: 15,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#dc2626",
  },

  search: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    elevation: 3,
  },

  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#111827",
  },

  text: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 3,
  },

  row: {
    marginTop: 10,
  },

  time: {
    fontSize: 12,
    color: "#555",
  },

  statusBox: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "#dc2626",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});