import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  // Your active ngrok URL from the Forwarding line in your terminal
  baseURL: 'https://operative-iodine-childless.ngrok-free.dev/api', 
  headers: {
    // This header is required so ngrok sends JSON instead of a warning page
    'ngrok-skip-browser-warning': 'true',
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const authData = await AsyncStorage.getItem('authData');
    if (authData) {
      const { token } = JSON.parse(authData);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;