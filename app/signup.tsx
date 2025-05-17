import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { Alert, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Yup from 'yup';

const SignupSchema = Yup.object().shape({
  email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập địa chỉ email'),
  password: Yup.string().min(6, 'Tối thiểu 6 ký tự').required('Vui lòng nhập mật khẩu'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Mật khẩu xác nhận không khớp')
    .required('Vui lòng nhập mật khẩu xác nhận'),
});

export default function SignupScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async (values: { email: string; password: string }) => {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);

      const user = userCredential.user;
      const displayName = values.email.split('@')[0];

      await updateProfile(user, {
        displayName,
      });

      if (Platform.OS === 'web') {
        window.alert('Tài khoản đã được tạo thành công!');
      } else {
        Alert.alert('Thành công', 'Tài khoản đã được tạo!');
      }

      router.replace('/login');
    } catch (error: any) {
      let message = 'Đã xảy ra lỗi. Vui lòng thử lại.';
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'Email này đã được sử dụng. Vui lòng dùng email khác hoặc đăng nhập.';
          break;
        case 'auth/invalid-email':
          message = 'Địa chỉ email không hợp lệ. Vui lòng kiểm tra lại.';
          break;
        case 'auth/weak-password':
          message = 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn (ít nhất 6 ký tự).';
          break;
        case 'auth/operation-not-allowed':
          message = 'Tính năng đăng ký bằng email hiện đang bị vô hiệu hóa. Vui lòng thử lại sau.';
          break;
        case 'auth/network-request-failed':
          message = 'Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng.';
          break;
        case 'auth/internal-error':
          message = 'Lỗi hệ thống nội bộ. Vui lòng thử lại sau.';
          break;
        default:
          message = `Mã lỗi: ${error.code} - ${error.message}`;
          break;
      }

      if (Platform.OS === 'web') {
        window.alert(message);
      } else {
        Alert.alert('Lỗi đăng ký', message);
      }
    }
  };




  return (
    <>
    <Stack.Screen options={{ title: 'ĐĂNG KÍ' }} />
    <View style={styles.container}>
      <Image source={require('../assets/images/5fd034f83aed7-removebg-preview.png')} style={styles.logo} />
      <Text style={styles.title}>Đăng kí</Text>

      <Formik
        initialValues={{ email: '', password: '', confirmPassword: '' }}
        validationSchema={SignupSchema}
        onSubmit={handleSignup}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Email"
                style={styles.input}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                keyboardType="email-address"
              />
            </View>
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Mật khẩu"
                style={styles.input}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
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
            {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Xác nhận mật khẩu"
                style={styles.input}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                value={values.confirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color="#007bff"
                />
              </TouchableOpacity>
            </View>
            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={styles.error}>{errors.confirmPassword}</Text>
            )}

            <TouchableOpacity
              style={styles.signupButton}
              onPress={() => handleSubmit()}
            >
              <Text style={styles.signupButtonText}>Đăng ký</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.link}>Đã có tài khoản? Đăng nhập</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 16,
    resizeMode: 'contain',
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
  signupButton: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
  },
  link: {
    color: '#007bff',
    textAlign: 'center',
    marginTop: 12,
    fontSize: 16,
  },
});