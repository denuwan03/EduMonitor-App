import React, { useState, useCallback, useContext } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const RefreshWrapper = ({ children, onRefreshCustom }) => {
  const [refreshing, setRefreshing] = useState(false);
  const { refreshUser } = useContext(AuthContext);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // 1. Always refresh global user data (skills, role, etc.)
      await refreshUser();
      
      // 2. If the specific screen has extra data to fetch (like tasks), run it too
      if (onRefreshCustom) {
        await onRefreshCustom();
      }
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshUser, onRefreshCustom]);

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh} 
          colors={['#3498db', '#e67e22']} // Rotates colors during spin
        />
      }
    >
      {children}
    </ScrollView>
  );
};

export default RefreshWrapper;