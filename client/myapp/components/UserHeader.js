import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { UserContext } from '../contexts/UserContext';
import Avatar from '../components/ui/avatar'; // ודא שהנתיב נכון לפי מיקום הקובץ שלך

const UserHeader = () => {
  const { user, logout } = useContext(UserContext);
  const firstLetter = user?.name?.charAt(0).toUpperCase() || '?';

  return (
    <View style={styles.container}>
      <Avatar fallbackText={firstLetter} size={40} />
      <View style={styles.info}>
        <Text style={styles.name}>{user?.name || 'Guest'}</Text>
        <Text style={styles.email}>{user?.email || 'No email'}</Text>
      </View>
      <TouchableOpacity onPress={logout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#0a0a23',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  info: {
    marginLeft: 10,
    flex: 1,
  },
  name: {
    color: 'gold',
    fontWeight: 'bold',
    fontSize: 16,
  },
  email: {
    color: '#ccc',
    fontSize: 13,
  },
  logoutButton: {
    backgroundColor: 'gold',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
  },
  logoutText: {
    color: '#1a1a2e',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
