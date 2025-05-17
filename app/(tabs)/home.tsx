import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import '../../config/firebase';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <View style={styles.container}>
      <ThemedView style={styles.headerCard}>
        <ThemedText type="title" style={styles.title}>
          Thực hành Lab 4
        </ThemedText>

        <ThemedText style={styles.subtitle}>
          FirebaseAuth App – React Native Firebase
        </ThemedText>

        <ThemedText style={styles.author}>
          Người thực hiện: Đặng Đức Lâm
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.headerCard}>
        {user ? (
          <View style={styles.loginInfo}>
            <Text style={styles.welcomeText}>
              👋 Chào mừng bạn {user.displayName} đã đăng nhập vào hệ thống!
            </Text>
          </View>
        ) : (
          <View style={styles.loginPrompt}>
            <Text style={styles.welcomeText}>
              👋 Chào mừng bạn! Bạn chưa đăng nhập.
            </Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>Đăng nhập ngay</Text>
            </TouchableOpacity>
          </View>
        )}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  loginInfo: {
  alignItems: 'center',
  width: '100%',
  },
  avatarContainer: {
    marginTop: 12,
    borderRadius: 100,
    overflow: 'hidden',
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: '#007bff',
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  headerCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.12)',
      },
    }),
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#888',
  },
  loginPrompt: {
    alignItems: 'center',
    width: '100%',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#007bff',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});