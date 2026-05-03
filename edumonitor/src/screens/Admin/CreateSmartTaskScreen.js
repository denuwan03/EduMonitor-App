import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../api/client';

const CreateSmartTaskScreen = ({ route, navigation }) => {
  // Get params passed from Admin Dashboard
  const { projectId, projectTitle } = route.params || {};

  const [form, setForm] = useState({
    projectId: projectId || '', // Auto-fill if coming from dashboard
    title: '',
    description: '',
    requiredSkills: '', 
    deadline: '',
    priority: 'Medium'
  });

  const handleCreate = async () => {
    if (!form.title || !form.projectId || !form.requiredSkills) {
      Alert.alert("Missing Info", "Please fill in the title, skills, and ensure a project is selected.");
      return;
    }

    try {
      const payload = {
        ...form,
        // Convert comma string to array for your MERN backend
        requiredSkills: form.requiredSkills.split(',').map(s => s.trim()).filter(Boolean)
      };

      await apiClient.post('/tasks', payload);
      Alert.alert(
        "Smart Assignment Complete", 
        "Task created! Our AI has assigned it to the most qualified student based on skills and workload."
      );
      navigation.goBack();
    } catch (err) {
      console.error(err.response?.data);
      Alert.alert("Error", "Could not create task. Please check your connection.");
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Project Context Header */}
        <View style={styles.headerInfo}>
          <Ionicons name="folder-open" size={20} color="#e67e22" />
          <Text style={styles.headerText}>
            Project: <Text style={{ fontWeight: 'bold' }}>{projectTitle || "General Assignment"}</Text>
          </Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Task Title</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g. Design Database Schema"
            value={form.title} 
            onChangeText={t => setForm({...form, title: t})} 
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Task Description</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            placeholder="Explain the requirements..."
            multiline
            numberOfLines={4}
            value={form.description} 
            onChangeText={t => setForm({...form, description: t})} 
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Required Skills (Comma separated)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="React, MongoDB, UI Design"
            value={form.requiredSkills} 
            onChangeText={t => setForm({...form, requiredSkills: t})} 
          />
          <Text style={styles.helperText}>AI uses these to find the best student.</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Deadline (YYYY-MM-DD)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="2026-12-31"
            value={form.deadline} 
            onChangeText={t => setForm({...form, deadline: t})} 
          />
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleCreate}>
          <Ionicons name="flash" size={18} color="#fff" style={{ marginRight: 10 }} />
          <Text style={styles.submitText}>Run Smart Assignment</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  headerInfo: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 20,
    elevation: 2 
  },
  headerText: { marginLeft: 10, fontSize: 16, color: '#34495e' },
  formGroup: { marginBottom: 20 },
  label: { fontWeight: 'bold', color: '#2c3e50', marginBottom: 8 },
  input: { 
    backgroundColor: '#fff', 
    borderWidth: 1, 
    borderColor: '#dcdde1', 
    padding: 12, 
    borderRadius: 8,
    fontSize: 16 
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  helperText: { fontSize: 11, color: '#7f8c8d', marginTop: 4 },
  submitBtn: { 
    backgroundColor: '#e67e22', 
    padding: 18, 
    borderRadius: 12, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: 10,
    elevation: 3
  },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelBtn: { marginTop: 15, alignItems: 'center' },
  cancelText: { color: '#7f8c8d', fontSize: 14 }
});

export default CreateSmartTaskScreen;