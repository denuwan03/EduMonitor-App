import React, { useState, useContext } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  KeyboardAvoidingView, Platform, ActivityIndicator 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👈 NEW
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login(form);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>EduMonitor</Text>
        <Text style={styles.subtitle}>Student Monitoring System</Text>

        <TextInput 
          style={styles.input}
          placeholder="Email Address"
          value={form.email}
          onChangeText={(text) => setForm({...form, email: text})}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {/* 👇 Password with eye icon */}
        <View style={styles.passwordContainer}>
          <TextInput 
            style={styles.passwordInput}
            placeholder="Password"
            value={form.password}
            onChangeText={(text) => setForm({...form, password: text})}
            secureTextEntry={!showPassword}
          />

          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon 
              name={showPassword ? "eye-off" : "eye"} 
              size={22} 
              color="#64748b" 
            />
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity 
          style={[styles.button, loading && { opacity: 0.7 }]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Accounts are created by Admin. Contact your supervisor if you cannot log in.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4c669f', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#fff', padding: 25, borderRadius: 20, elevation: 5 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1e293b', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 20 },

  input: { 
    borderWidth: 1, 
    borderColor: '#e2e8f0', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 15, 
    fontSize: 16 
  },

  // 👇 NEW styles
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16
  },

  button: { backgroundColor: '#7c3aed', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  errorText: { color: '#e11d48', fontSize: 14, marginBottom: 10, textAlign: 'center' },
  footerText: { marginTop: 20, fontSize: 12, color: '#94a3b8', textAlign: 'center', lineHeight: 18 }
});

export default LoginScreen;