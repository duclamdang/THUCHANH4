import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'LỖI' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">Có lỗi xảy ra trong quá trình thực hiện!</ThemedText>
        <Link href="/(tabs)/home" style={styles.link}>
          <ThemedText type="link">Quay về trang chủ!</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
