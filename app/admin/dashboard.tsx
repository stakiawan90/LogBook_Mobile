// app/admin/dashboard.tsx
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert } from 'react-native';
import { useState } from 'react';

type DashboardStats = {
  totalUsers: number;
  activeOrders: number;
  totalRevenue: number;
  pendingApprovals: number;
};

type ActivityItem = {
  id: string;
  title: string;
  time: string;
  status: 'pending' | 'completed' | 'cancelled';
};

export default function AdminDashboard() {
  const router = useRouter();
  
  const [stats] = useState<DashboardStats>({
    totalUsers: 1247,
    activeOrders: 43,
    totalRevenue: 28450,
    pendingApprovals: 12,
  });

  const [recentActivities] = useState<ActivityItem[]>([
    { id: '1', title: 'New user registration', time: '5 minutes ago', status: 'completed' },
    // { id: '2', title: 'Order #1234 placed', time: '1 hour ago', status: 'pending' },
    { id: '3', title: 'New user account created', time: '3 hours ago', status: 'completed' },
    { id: '3', title: 'Notification sent to users', time: '3 hours ago', status: 'completed' },
    { id: '5', title: 'Product review reported', time: '1 day ago', status: 'pending' },
  ]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'sure ka ganahan ka mo log out?',
      // 'Are you sure you want to logout?',
      [
        { text: 'di raba', style: 'cancel' },
        { text: 'oo gud', onPress: () => router.replace('/') }
      ]
    );
  };

  const StatCard = ({ title, value, color }: { title: string; value: number | string; color: string }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const ActivityItem = ({ item }: { item: ActivityItem }) => (
    <View style={styles.activityItem}>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityTime}>{item.time}</Text>
      </View>
      <View style={[styles.statusBadge, 
        item.status === 'completed' && styles.statusCompleted,
        item.status === 'pending' && styles.statusPending,
        item.status === 'cancelled' && styles.statusCancelled,
      ]}>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.adminName}>Admin User</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard title="Approved" value={stats.totalUsers} color="#4CAF50" />
          <StatCard title="Rejected" value={stats.activeOrders} color="#2196F3" />
          <StatCard title="Logbook Management" value={`$${stats.totalRevenue.toLocaleString()}`} color="#FF9800" />
          <StatCard title="Pending Approvals" value={stats.pendingApprovals} color="#F44336" />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Users', 'Navigate to users management')}>
              <Text style={styles.actionIcon}>👥</Text>
              <Text style={styles.actionText}>Manage Users</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Orders', 'Navigate to orders management')}>
              <Text style={styles.actionIcon}>📦</Text>
              <Text style={styles.actionText}>View Orders</Text>
            </TouchableOpacity> */}
            {/* <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Products', 'Navigate to products management')}>
              <Text style={styles.actionIcon}>🛍️</Text>
              <Text style={styles.actionText}>Manage Products</Text>
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Settings', 'Navigate to settings')}>
              <Text style={styles.actionIcon}>⚙️</Text>
              <Text style={styles.actionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent History</Text>
            <TouchableOpacity onPress={() => Alert.alert('View All', 'Show all activities')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activitiesList}>
            {recentActivities.map(activity => (
              <ActivityItem key={activity.id} item={activity} />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation (optional) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => Alert.alert('Dashboard', 'Already on dashboard')}>
          <Text style={[styles.navIcon, styles.navIconActive]}>📊</Text>
          <Text style={[styles.navText, styles.navTextActive]}>Dashboard</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.navItem} onPress={() => Alert.alert('Analytics', 'Navigate to analytics')}>
          <Text style={styles.navIcon}>📈</Text>
          <Text style={styles.navText}>Analytics</Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.navItem} onPress={() => Alert.alert('Profile', 'Navigate to profile')}>
          <Text style={styles.navIcon}>📝</Text>
          <Text style={styles.navText}>Register/Add User</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => Alert.alert('Profile', 'Navigate to profile')}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
  },
  adminName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#ff4444',
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    width: '48%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  viewAllText: {
    color: '#007AFF',
    fontSize: 14,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#fff',
    width: '48%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  actionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  activitiesList: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusCompleted: {
    backgroundColor: '#4CAF50',
  },
  statusPending: {
    backgroundColor: '#FF9800',
  },
  statusCancelled: {
    backgroundColor: '#F44336',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navIcon: {
    fontSize: 24,
    color: '#999',
  },
  navIconActive: {
    color: '#007AFF',
  },
  navText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  navTextActive: {
    color: '#007AFF',
  },
});