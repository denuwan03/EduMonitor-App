import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';

const ProfileScreen = () => {
  const { user, logout, refreshUser } = useContext(AuthContext);

  const isAdmin = user?.role === 'Admin' || user?.role === 'Supervisor';
  const themeColor = isAdmin ? '#e67e22' : '#3498db';

  useEffect(() => {
    refreshUser();
  }, []);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout }
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={120} color={themeColor} />
            <View style={[styles.roleBadge, { backgroundColor: themeColor }]}>
              <Text style={styles.roleText}>{user?.role?.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons name="id-card-outline" size={22} color="#7f8c8d" />
            <Text style={styles.infoLabel}>{isAdmin ? 'Staff ID:' : 'Student ID:'}</Text>
            <Text style={styles.infoValue}>{user?.userId || 'N/A'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="business-outline" size={22} color="#7f8c8d" />
            <Text style={styles.infoLabel}>Department:</Text>
            <Text style={styles.infoValue}>{user?.profile?.department || 'Computing'}</Text>
          </View>

          {/* Skills Section */}
          <View style={styles.skillSection}>
            <Text style={styles.skillTitle}>Skills & Expertise</Text>
            <View style={styles.skillBadgeContainer}>
              {user?.skills && user.skills.length > 0 ? (
                user.skills.map((skill, index) => (
                  <View key={index} style={[styles.skillBadge, { borderColor: themeColor }]}>
                    <Text style={[styles.skillText, { color: themeColor }]}>{skill}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noSkills}>No skills listed. Use Edit to add skills.</Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', marginVertical: 30 },
  avatarContainer: { alignItems: 'center', justifyContent: 'center' },
  roleBadge: { paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20, marginTop: -20, borderWidth: 2, borderColor: '#fff' },
  roleText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  userName: { fontSize: 26, fontWeight: 'bold', marginTop: 15, color: '#2c3e50' },
  userEmail: { fontSize: 15, color: '#7f8c8d', marginTop: 5 },
  infoSection: { marginTop: 10, backgroundColor: '#f8f9fa', borderRadius: 15, padding: 15 },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#edf2f7' },
  infoLabel: { flex: 1, marginLeft: 12, color: '#7f8c8d', fontSize: 15 },
  infoValue: { fontSize: 15, color: '#2c3e50', fontWeight: '600' },
  skillSection: { marginTop: 20 },
  skillTitle: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50', marginBottom: 10 },
  skillBadgeContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillBadge: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: '#fff' },
  skillText: { fontSize: 13, fontWeight: '600' },
  noSkills: { fontStyle: 'italic', color: '#94a3b8' },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#f1f1f1' },
  logoutBtn: { flexDirection: 'row', backgroundColor: '#e74c3c', padding: 16, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  logoutText: { color: '#fff', fontWeight: 'bold', marginLeft: 10, fontSize: 16 }
});

export default ProfileScreen;