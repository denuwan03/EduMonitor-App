import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import apiClient from '../../api/client';

const CreateAnnouncement = ({ navigation }) => {
  const [form, setForm] = useState({ title: '', message: '' }); // Changed 'content' to 'message'
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.message.trim()) {
      return Alert.alert("Error", "Please fill in all fields.");
    }

    setLoading(true);
    try {
      // The payload keys must match your Backend Model exactly
      const payload = {
        title: form.title.trim(),
        message: form.message.trim(), // Sending 'message' instead of 'content'
      };

      // console.log("Sending payload to backend:", payload);

      const response = await apiClient.post('/announcements', payload);

      if (response.status === 201 || response.status === 200) {
        Alert.alert("Success", "Announcement posted!");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Post Error:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "Failed to post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Headline</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Announcement Title"
        value={form.title}
        onChangeText={t => setForm({...form, title: t})}
      />

      <Text style={styles.label}>Message Details</Text>
      <TextInput 
        style={[styles.input, styles.textArea]} 
        multiline 
        placeholder="Type your message here..."
        value={form.message} // Linked to form.message
        onChangeText={t => setForm({...form, message: t})}
      />

      <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Broadcast Announcement</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#34495e', marginBottom: 5 },
  input: { borderBottomWidth: 1, borderColor: '#dcdde1', paddingVertical: 10, fontSize: 16, marginBottom: 20 },
  textArea: { height: 120, textAlignVertical: 'top' },
  btn: { backgroundColor: '#e67e22', padding: 16, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default CreateAnnouncement;