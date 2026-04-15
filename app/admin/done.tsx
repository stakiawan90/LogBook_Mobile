import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";

export default function Done() {
  // SAMPLE DATA (replace later with API)
  const logs = [
    {
      id: 1,
      name: "Juan Dela Cruz",
      address: "Cebu City",
      contact: "09123456789",
      activity: "Dock Inspection",
      time_in: "08:30 AM",
      time_out: "05:00 PM", // ✅ added
      status: "Approved",
    },
    {
      id: 2,
      name: "Maria Santos",
      address: "Bohol",
      contact: "09987654321",
      activity: "Cargo Monitoring",
      time_in: "09:15 AM",
      time_out: "06:10 PM", // ✅ added
      status: "Approved",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Done Logbook</Text>

      <ScrollView horizontal>
        <View>
          {/* TABLE HEADER */}
          <View style={styles.headerRow}>
            <Text style={styles.headerCell}>Name</Text>
            <Text style={styles.headerCell}>Address</Text>
            <Text style={styles.headerCell}>Contact</Text>
            <Text style={styles.headerCell}>Activity</Text>
            <Text style={styles.headerCell}>Time In</Text>
            <Text style={styles.headerCell}>Time Out</Text> {/* ✅ NEW */}
            <Text style={styles.headerCell}>Status</Text>
          </View>

          {/* TABLE BODY */}
          {logs.map((item) => (
            <View key={item.id} style={styles.row}>
              <Text style={styles.cell}>{item.name}</Text>
              <Text style={styles.cell}>{item.address}</Text>
              <Text style={styles.cell}>{item.contact}</Text>
              <Text style={styles.cell}>{item.activity}</Text>
              <Text style={styles.cell}>{item.time_in}</Text>

              {/* ✅ TIME OUT */}
              <Text style={styles.cell}>
                {item.time_out || "-"}
              </Text>

              <Text style={[styles.cell, styles.approved]}>
                {item.status}
              </Text>
            </View>
          ))}
        </View>
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

  headerRow: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    borderRadius: 6,
  },

  headerCell: {
    width: 140, // ✅ slightly wider
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 12,
  },

  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },

  cell: {
    width: 140, // ✅ match header
    textAlign: "center",
    fontSize: 12,
    color: "#111827",
  },

  approved: {
    color: "#16a34a",
    fontWeight: "bold",
  },
});