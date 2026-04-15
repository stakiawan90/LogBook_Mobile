import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";

export default function Rejected() {
  // SAMPLE DATA (replace with API later)
  const logs = [
    {
      id: 1,
      name: "Pedro Santos",
      address: "Cebu City",
      contact: "09112223344",
      activity: "Security Check",
      time_in: "07:45 AM",
      status: "Rejected",
    },
    {
      id: 2,
      name: "Lisa Gomez",
      address: "Ormoc",
      contact: "09998887766",
      activity: "Cargo Verification",
      time_in: "10:20 AM",
      status: "Rejected",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Rejected Logbook</Text>

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

              <Text style={[styles.cell, styles.rejected]}>
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
    color: "#dc2626",
  },

  headerRow: {
    flexDirection: "row",
    backgroundColor: "#ef4444",
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

  rejected: {
    color: "#dc2626",
    fontWeight: "bold",
  },
});