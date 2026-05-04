import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  RefreshControl 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../api/client';

const AnnouncementsScreen = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnnouncements = useCallback(async () => {
    try {
      const response = await apiClient.get('/announcements');
      setAnnouncements(response.data);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  useEffect(() => { 
    fetchAnnouncements(); 
  }, [fetchAnnouncements]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="megaphone" size={24} color="#e67e22" />
        <View style={styles.headerText}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.author}>By {item.author?.name || 'System Admin'}</Text>
        </View>
      </View>
      <Text style={styles.content}>{item.content}</Text>
      <Text style={styles.date}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#e67e22" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={announcements}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listPadding}
        // FIXED: Using RefreshControl directly on FlatList
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={['#e67e22']}
            tintColor="#e67e22"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.empty}>No announcements yet.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listPadding: { padding: 15, paddingBottom: 30 },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 15, 
    padding: 15, 
    marginBottom: 15, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  headerText: { marginLeft: 12 },
  title: { fontSize: 17, fontWeight: 'bold', color: '#2c3e50' },
  author: { fontSize: 12, color: '#7f8c8d' },
  content: { fontSize: 14, color: '#34495e', lineHeight: 20 },
  date: { fontSize: 10, color: '#bdc3c7', marginTop: 10, textAlign: 'right' },
  emptyContainer: { marginTop: 100, alignItems: 'center' },
  empty: { color: '#95a5a6', fontSize: 16 }
});

export default AnnouncementsScreen;