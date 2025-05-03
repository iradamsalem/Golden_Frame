import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'gold',
    marginBottom: 40,
    textAlign: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  purposeText: {
    color: 'gold',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },
  errorContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#2b2b3c',
    borderRadius: 10,
    alignItems: 'center',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    textAlign: 'center',
  },
}); 