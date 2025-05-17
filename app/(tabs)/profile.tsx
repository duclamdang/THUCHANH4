import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { getAuth, onAuthStateChanged, signOut, updateProfile, User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import '../../config/firebase';

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [newDisplayName, setNewDisplayName] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser?.displayName) {
        setNewDisplayName(currentUser.displayName);
      }
      if (currentUser?.photoURL) {
        setProfileImage(currentUser.photoURL);
      }
    });

    return () => unsubscribe();
  }, []);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert('Lỗi', 'Cần cấp quyền truy cập camera và thư viện ảnh!');
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    if (!(await requestPermissions())) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    if (!(await requestPermissions())) return;

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log('Đã đăng xuất');
      router.replace('/(tabs)/home');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleUpdateName = async () => {
    if (user) {
      const auth = getAuth();
      try {
        await updateProfile(auth.currentUser!, {
          displayName: newDisplayName,
        });
        if (Platform.OS === 'web') {
             window.alert('Tên hiển thị đã được cập nhật thành công!');
        } else {
             Alert.alert('Thông báo', 'Tên hiển thị đã được cập nhật!');
        }
        setIsEditing(false);
      } catch (error) {
         if (Platform.OS === 'web') {
             window.alert('Không thể cập nhật tên hiển thị!');
        } else {
             Alert.alert('Lỗi', 'Không thể cập nhật tên hiển thị!');
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <ThemedView style={styles.card}>
        <ThemedText type="title" style={styles.title}>
          Hồ sơ người dùng
        </ThemedText>

        {user ? (
          <View style={styles.infoContainer}>
            {/* Profile Picture */}
            <View style={styles.avatarContainer}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <MaterialIcons name="person" size={50} color="#ccc" />
                </View>
              )}
              <View style={styles.avatarButtons}>
                <TouchableOpacity style={styles.avatarButton} onPress={pickImage}>
                  <MaterialIcons name="photo-library" size={20} color="#007bff" />
                  <Text style={styles.avatarButtonText}>Chọn ảnh</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.avatarButton} onPress={takePhoto}>
                  <MaterialIcons name="camera-alt" size={20} color="#007bff" />
                  <Text style={styles.avatarButtonText}>Chụp ảnh</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* User Information */}
            <Text style={styles.label}>
              📧 Email: <Text style={styles.value}>{user.email}</Text>
            </Text>
            <Text style={styles.label}>
              🆔 UID: <Text style={styles.value}>{user.uid}</Text>
            </Text>
            {user.displayName && (
              <View style={styles.nameContainer}>
                <Text style={styles.label}>👤 Tên hiển thị:</Text>
                {isEditing ? (
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      value={newDisplayName}
                      onChangeText={setNewDisplayName}
                      placeholder="Nhập tên mới"
                    />
                    <TouchableOpacity style={styles.saveIcon} onPress={handleUpdateName}>
                      <MaterialIcons name="save" size={24} color="#5bc0de" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.displayNameContainer}>
                    <Text style={styles.value}>{user.displayName}</Text>
                    <TouchableOpacity onPress={() => setIsEditing(true)}>
                      <MaterialIcons name="edit" size={24} color="#007bff" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.buttonText}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.infoContainer}>
            <Text style={styles.welcomeText}>Bạn chưa đăng nhập vào hệ thống.</Text>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.buttonText}>Đăng nhập ngay</Text>
            </TouchableOpacity>
          </View>
        )}
      </ThemedView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 16,
    alignSelf: 'center',
  },
  infoContainer: {
    width: '100%',
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#007bff',
  },
  avatarPlaceholder: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  avatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginHorizontal: 8,
  },
  avatarButtonText: {
    color: '#007bff',
    fontSize: 14,
    marginLeft: 4,
  },
  label: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    width: '100%',
  },
  value: {
    fontWeight: '600',
    color: '#007bff',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#007bff',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
  },
  logoutButton: {
    backgroundColor: '#d9534f',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    width: '70%',
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    marginRight: 10,
  },
  saveIcon: {
    padding: 10,
  },
  nameContainer: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  displayNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '60%',
  },
});