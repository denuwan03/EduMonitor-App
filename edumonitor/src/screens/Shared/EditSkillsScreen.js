import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import apiClient from '../../api/client';
import { AuthContext } from '../../context/AuthContext';

const EditSkillsScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Pre-fill with existing skills if available
    if (user?.skills) {
      setSkills(user.skills.join(", "));
    }
  }, [user]);

  const handleUpdate = async () => {
    const skillArray = skills.split(',').map(s => s.trim()).filter(Boolean);
    
    setLoading(true);
    try {
      await apiClient.put('/users/profile', { skills: skillArray });
      Alert.alert("Success", "Skills updated! You are now ready for Smart Task Assignment.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Could not update skills");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Update Your Skills</Text>
      <Text style={styles.subtitle}>List your technical skills separated by commas. Our AI uses this to match you with the best tasks.</Text>
      
      <TextInput
        style={styles.input}
        multiline
        placeholder="e.g. React Native, MongoDB, Python, Figma"
        value={skills}
        onChangeText={setSkills}
      />

      <TouchableOpacity style={styles.btn} onPress={handleUpdate} disabled={loading}>
        <Text style={styles.btnText}>{loading ? "Saving..." : "Update Profile"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2c3e50' },
  subtitle: { fontSize: 14, color: '#7f8c8d', marginVertical: 10, lineHeight: 20 },
  input: { borderWidth: 1, borderColor: '#dcdde1', borderRadius: 10, padding: 15, height: 120, textAlignVertical: 'top', fontSize: 16, marginTop: 10 },
  btn: { backgroundColor: '#3498db', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 25 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default EditSkillsScreen;