import React, { useEffect, useState, useContext, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TextInput, 
  ActivityIndicator, 
  TouchableOpacity, 
  RefreshControl,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../api/client';
import { AuthContext } from '../../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

const UserListScreen = ({ navigation }) => {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      const endpoint = currentUser.role === 'Admin' ? '/users' : '/users/students';
      const response = await apiClient.get(endpoint);
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Fetch Users Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [currentUser.role])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUsers();
  }, [currentUser.role]);

  const handleDelete = (id, name) => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete ${name}? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              await apiClient.delete(`/users/${id}`);
              Alert.alert("Success", "User deleted successfully");
              fetchUsers(); // Refresh list after delete
            } catch (err) {
              Alert.alert("Error", err.response?.data?.message || "Delete failed");
            }
          } 
        }
      ]
    );
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userHeader}>
        <Ionicons 
          name={item.role === 'Student' ? "school" : "briefcase"} 
          size={40} 
          color={item.role === 'Student' ? "#3498db" : "#e67e22"} 
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
          <View style={styles.roleContainer}>
            <Text style={[styles.roleText, { color: item.role === 'Student' ? "#3498db" : "#e67e22" }]}>
              {item.role}
            </Text>
            {item.status === 'Inactive' && <Text style={styles.inactiveTag}>Inactive</Text>}
          </View>
        </View>

        {/* Action Buttons for Admins */}
        {currentUser.role === 'Admin' && (
          <View style={styles.actionColumn}>
            <TouchableOpacity 
              style={styles.actionBtn} 
              onPress={() => navigation.navigate('RegisterUser', { editUser: item })}
            >
              <Ionicons name="create-outline" size={20} color="#3498db" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionBtn} 
              onPress={() => handleDelete(item._id, item.name)}
            >
              <Ionicons name="trash-outline" size={20} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  // ... (keep handleSearch and return JSX similar to your original, adding the FAB)
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#95a5a6" />
        <TextInput 
          placeholder="Search users..." 
          style={styles.searchInput}
          value={search}
          onChangeText={(text) => {
            setSearch(text);
            const filtered = users.filter(u => u.name.toLowerCase().includes(text.toLowerCase()));
            setFilteredUsers(filtered);
          }}
        />
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item._id}
        renderItem={renderUserItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

      {currentUser.role === 'Admin' && (
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('RegisterUser')}>
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6' },
  listContent: { padding: 15 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 10, margin: 15, borderRadius: 10, elevation: 2 },
  searchInput: { flex: 1, marginLeft: 10 },
  userCard: { backgroundColor: '#fff', padding: 15, borderRadius: 15, marginBottom: 12, elevation: 2 },
  userHeader: { flexDirection: 'row', alignItems: 'center' },
  userInfo: { flex: 1, marginLeft: 12 },
  userName: { fontSize: 17, fontWeight: 'bold', color: '#2c3e50' },
  userEmail: { fontSize: 12, color: '#7f8c8d' },
  roleContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  roleText: { fontSize: 12, fontWeight: 'bold' },
  inactiveTag: { fontSize: 10, backgroundColor: '#ffebee', color: '#c62828', marginLeft: 8, paddingHorizontal: 4 },
  actionColumn: { justifyContent: 'space-around', height: 60, marginLeft: 10 },
  actionBtn: { padding: 5 },
  fab: { position: 'absolute', bottom: 30, right: 20, backgroundColor: '#e67e22', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 }
});

export default UserListScreen;