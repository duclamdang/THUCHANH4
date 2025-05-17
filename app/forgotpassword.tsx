import { Stack, useRouter } from 'expo-router';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { Formik } from 'formik';
import React from 'react';
import { Alert, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Yup from 'yup';

const emailSchema = Yup.object().shape({
  email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập địa chỉ email'),
});

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const handleReset = async (values: { email: string }) => {
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, values.email);
      if (Platform.OS === 'web') {
        window.alert('Email đặt lại mật khẩu đã được gửi thành công');
      } else {
        Alert.alert('Thành công', 'Email đặt lại mật khẩu đã được gửi.');
      }
      router.push('/login');
    } catch (error: any) {
      let message = 'Đã xảy ra lỗi. Vui lòng thử lại.';

      switch (error.code) {
        case 'auth/invalid-email':
          message = 'Địa chỉ email không hợp lệ. Vui lòng kiểm tra lại.';
          break;
        case 'auth/user-not-found':
          message = 'Không tìm thấy tài khoản với email này. Bạn có muốn đăng ký tài khoản mới không?';
          break;
        case 'auth/network-request-failed':
          message = 'Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng.';
          break;
        case 'auth/internal-error':
          message = 'Lỗi hệ thống nội bộ. Vui lòng thử lại sau.';
          break;
        default:
          message = `Mã lỗi: ${error.code} - ${error.message}`;
      }

      if (Platform.OS === 'web') {
        window.alert(message);
      } else {
        Alert.alert('Lỗi', message);
      }
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'QUÊN MẬT KHẨU' }} />
      <View style={styles.container}>
        <Image source={require('../assets/images/5fd034f83aed7-removebg-preview.png')} style={styles.logo} />
        <Text style={styles.title}>Quên mật khẩu</Text>

        <Formik
          initialValues={{ email: '' }}
          validationSchema={emailSchema}
          onSubmit={handleReset}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Nhập email"
                  style={styles.input}
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  keyboardType="email-address"
                />
              </View>
              {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => handleSubmit()}
              >
                <Text style={styles.resetButtonText}>Gửi email khôi phục</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>

        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.link}>Quay lại đăng nhập</Text>
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
  form: {
    width: '100%',
    marginBottom: 16,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 16,
    resizeMode: 'contain',
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
  resetButton: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
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
