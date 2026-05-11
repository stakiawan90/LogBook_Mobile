// app/staff/dashboard.tsx
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from "react-native";
import { useState } from "react";

type DashboardStats = {
  totalUsers: number;
  activeOrders: number;
  done: number;
  pendingApprovals: number;
};

type ActivityType = {
  id: string;
  title: string;
  time: string;
  status: "pending" | "completed" | "cancelled";
};

export default function StaffDashboard() {
  const router = useRouter();

  const [stats] = useState<DashboardStats>({
    totalUsers: 117,
    activeOrders: 43,
    done: 280,
    pendingApprovals: 28,
  });

  const [recentActivities] = useState<ActivityType[]>([
    {
      id: "1",
      title: "New request received",
      time: "5 minutes ago",
      status: "completed",
    },
    {
      id: "2",
      title: "Staff account updated",
      time: "3 hours ago",
      status: "completed",
    },
    {
      id: "3",
      title: "Notification sent",
      time: "3 hours ago",
      status: "completed",
    },
    {
      id: "4",
      title: "Pending approval",
      time: "1 day ago",
      status: "pending",
    },
  ]);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => router.replace("/"),
      },
    ]);
  };

  const StatCard = ({
    title,
    value,
    color,
    onPress,
  }: {
    title: string;
    value: number | string;
    color: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.statCard, { borderLeftColor: color }]}
    >
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </TouchableOpacity>
  );

  const ActivityCard = ({ item }: { item: ActivityType }) => (
    <View style={styles.activityItem}>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityTime}>{item.time}</Text>
      </View>

      <View
        style={[
          styles.statusBadge,
          item.status === "completed" && styles.statusCompleted,
          item.status === "pending" && styles.statusPending,
          item.status === "cancelled" && styles.statusCancelled,
        ]}
      >
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.staffName}>Staff User</Text>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          <StatCard
            title="Approved"
            value={stats.totalUsers}
            color="#4CAF50"
            onPress={() => router.push("/staff/approved")}
          />

          <StatCard
            title="Done"
            value={stats.done}
            color="#2196F3"
            onPress={() => router.push("/staff/done")}
          />

          <StatCard
            title="Pending"
            value={stats.pendingApprovals}
            color="#FF9800"
            onPress={() => router.push("/staff/pending")}
          />

          <StatCard
            title="Rejected"
            value={stats.totalUsers}
            color="#F44336"
            onPress={() => router.push("/staff/rejected")}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                Alert.alert("Requests", "Manage Requests")
              }
            >
              <Text style={styles.actionIcon}>📋</Text>
              <Text style={styles.actionText}>
                Manage Requests
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => Alert.alert("Settings")}
            >
              <Text style={styles.actionIcon}>⚙️</Text>
              <Text style={styles.actionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Recent History
          </Text>

          <View style={styles.activitiesList}>
            {recentActivities.map((item) => (
              <ActivityCard key={item.id} item={item} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  header: {
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  welcomeText: { fontSize: 14, color: "#666" },
  staffName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },

  logoutButton: {
    backgroundColor: "#ff4444",
    padding: 8,
    borderRadius: 8,
  },

  logoutText: { color: "#fff" },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
  },

  statCard: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
  },

  statValue: { fontSize: 24, fontWeight: "bold" },
  statTitle: { color: "#666" },

  section: { padding: 20 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },

  actionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
s
  actionButton: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },

  actionIcon: { fontSize: 28 },
  actionText: { marginTop: 5 },

  activitiesList: {
    backgroundColor: "#fff",
    borderRadius: 10,
  },

  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  activityContent: { flex: 1 },

  activityTitle: { fontSize: 14 },
  activityTime: {
    fontSize: 12,
    color: "#999",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusCompleted: {
    backgroundColor: "#4CAF50",
  },
  statusPending: {
    backgroundColor: "#FF9800",
  },
  statusCancelled: {
    backgroundColor: "#F44336",
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
  },
});