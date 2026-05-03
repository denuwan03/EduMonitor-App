import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import apiClient from '../../api/client';

const RequestTopicScreen = ({ navigation }) => {
  const [form, setForm] = useState({ projectTitle: '', description: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.projectTitle || !form.description) {
      return Alert.alert("Error", "Please fill in all fields");
    }

    setLoading(true);
    try {
      await apiClient.post('/topics', form);
      Alert.alert("Success", "Topic request submitted for approval.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Failed", error.response?.data?.message || "Could not submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>New Project Topic</Text>
      
      <Text style={styles.label}>Proposed Title</Text>
      <TextInput 
        style={styles.input}
        placeholder="e.g. AI-based Student Monitoring"
        value={form.projectTitle}
        onChangeText={(text) => setForm({...form, projectTitle: text})}
      />

      <Text style={styles.label}>Brief Description</Text>
      <TextInput 
        style={[styles.input, styles.textArea]}
        multiline
        numberOfLines={5}
        placeholder="Describe your project goals..."
        value={form.description}
        onChangeText={(text) => setForm({...form, description: text})}
      />

      <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.btnText}>{loading ? "Submitting..." : "Submit Request"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#2c3e50' },
  label: { fontWeight: 'bold', marginBottom: 8, color: '#34495e' },
  input: { borderWidth: 1, borderColor: '#dcdde1', borderRadius: 8, padding: 12, marginBottom: 20 },
  textArea: { height: 120, textAlignVertical: 'top' },
  btn: { backgroundColor: '#3498db', padding: 16, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default RequestTopicScreen;