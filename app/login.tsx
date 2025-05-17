import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { Alert, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Yup from 'yup';


const loginSchema = Yup.object().shape({
  email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập địa chỉ email'),
  password: Yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Vui lòng nhập mật khẩu'),
});

export default function LoginScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, values.email, values.password);
      router.replace('/(tabs)/home');
    } catch (error: any) {
      let message = 'Đã xảy ra lỗi. Vui lòng thử lại.';

      switch (error.code) {
        case 'auth/invalid-email':
          message = 'Địa chỉ email không hợp lệ. Vui lòng kiểm tra lại.';
          break;
        case 'auth/user-not-found':
          message = 'Không tìm thấy tài khoản với email này. Bạn có muốn đăng ký tài khoản mới không?';
          break;
        case 'auth/wrong-password':
          message = 'Mật khẩu không đúng. Vui lòng thử lại hoặc chọn "Quên mật khẩu".';
          break;
        case 'auth/too-many-requests':
          message = 'Bạn đã nhập sai quá nhiều lần. Vui lòng thử lại sau hoặc đặt lại mật khẩu.';
          break;
        case 'auth/invalid-credential':
          message = 'Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại thông tin đăng nhập.';
          break;
        case 'auth/network-request-failed':
          message = 'Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng.';
          break;
        case 'auth/internal-error':
          message = 'Lỗi nội bộ từ hệ thống. Vui lòng thử lại sau.';
          break;
        case 'auth/missing-password':
          message = 'Bạn chưa nhập mật khẩu. Vui lòng điền đầy đủ thông tin.';
          break;
        default:
          message = `Mã lỗi: ${error.code} - ${error.message}`;
      }

      if (Platform.OS === 'web') {
        window.alert(`${message}`);
      } else {
        Alert.alert(message);
      }
    }
  };


  return (
    <>
    <Stack.Screen options={{ title: 'ĐĂNG NHẬP' }} />
    <View style={styles.container}>
      <Image source={require('../assets/images/5fd034f83aed7-removebg-preview.png')} style={styles.logo} />
      <Text style={styles.welcomeText}>Đăng nhập</Text>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={loginSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Nhập địa chỉ email"
                style={styles.input}
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                keyboardType="email-address"
              />
            </View>
            {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Nhập mật khẩu"
                style={styles.input}
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color="#007bff"
                />
              </TouchableOpacity>
            </View>
            {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => handleSubmit()}
            >
              <Text style={styles.loginButtonText}>Đăng nhập</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/forgotpassword')}>
              <Text style={styles.link}>Quên mật khẩu?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text style={styles.link}>Bạn chưa có tài khoản? Đăng kí ngay!</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  welcomeText: {
    fontSize: 22,
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  form: {
    width: '100%',
    marginBottom: 16,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#007bff',
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  eyeButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  loginButton: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#007bff',
    textAlign: 'center',
    marginTop: 12,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
  },
});