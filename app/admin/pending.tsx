import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";

export default function Pending() {
  // SAMPLE DATA (replace with API later)
  const logs = [
    {
      id: 1,
      name: "Juan Dela Cruz",
      address: "Cebu City",
      contact: "09123456789",
      activity: "Dock Inspection",
      time_in: "08:30 AM",
      status: "Pending",
    },
    {
      id: 2,
      name: "Ana Reyes",
      address: "Leyte",
      contact: "09987654321",
      activity: "Cargo Checking",
      time_in: "09:45 AM",
      status: "Pending",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Pending Logbook</Text>

      <ScrollView horizontal>
        <View>
          {/* TABLE HEADER */}
          <View style={styles.headerRow}>
            <Text style={styles.headerCell}>Name</Text>
            <Text style={styles.headerCell}>Address</Text>
            <Text style={styles.headerCell}>Contact</Text>
            <Text style={styles.headerCell}>Activity</Text>
            <Text style={styles.headerCell}>Time In</Text>
            <Text style={styles.headerCell}>Status</Text>
          </View>

          {/* TABLE ROWS */}
          {logs.map((item) => (
            <View key={item.id} style={styles.row}>
              <Text style={styles.cell}>{item.name}</Text>
              <Text style={styles.cell}>{item.address}</Text>
              <Text style={styles.cell}>{item.contact}</Text>
              <Text style={styles.cell}>{item.activity}</Text>
              <Text style={styles.cell}>{item.time_in}</Text>

              <Text style={[styles.cell, styles.pending]}>
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
    color: "#d97706",
  },

  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f59e0b",
    paddingVertical: 10,
    borderRadius: 6,
  },

  headerCell: {
    width: 130,
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
    width: 130,
    textAlign: "center",
    fontSize: 12,
    color: "#111827",
  },

  pending: {
    color: "#f59e0b",
    fontWeight: "bold",
  },
});