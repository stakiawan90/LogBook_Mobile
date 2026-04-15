import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
} from "react-native";

export default function Approved() {
  const [search, setSearch] = useState("");

  // SAMPLE DATA (replace with API later)
  const approvedLogs = [
    {
      id: 1,
      name: "Juan Dela Cruz",
      address: "Cebu City",
      contact: "09123456789",
      activity: "Dock Inspection",
      time_in: "08:30 AM",
      status: "Approved",
    },
    {
      id: 2,
      name: "Maria Santos",
      address: "Iloilo",
      contact: "09987654321",
      activity: "Cargo Checking",
      time_in: "09:15 AM",
      status: "Approved",
    },
  ];

  // 🔍 SEARCH FILTER
  const filteredLogs = approvedLogs.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Approved Logbook</Text>

      {/* 🔍 SEARCH BAR */}
      <TextInput
        style={styles.search}
        placeholder="Search name..."
        value={search}
        onChangeText={setSearch}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredLogs.map((item) => (
          <View key={item.id} style={styles.card}>
            {/* NAME */}
            <Text style={styles.name}>{item.name}</Text>

            {/* DETAILS */}
            <Text style={styles.text}>📍 {item.address}</Text>
            <Text style={styles.text}>📞 {item.contact}</Text>
            <Text style={styles.text}>📋 {item.activity}</Text>

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
    </SafeAreaView>
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
    color: "#1e3a8a",
  },

  search: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e5e7eb",
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
    backgroundColor: "#16a34a",
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