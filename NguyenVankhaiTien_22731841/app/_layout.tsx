import { Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useDatabaseInit } from '../hooks/useDatabaseInit';

export default function RootLayout() {
  const { dbReady, error } = useDatabaseInit();

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Lỗi khởi tạo DB: {error.message}</Text>
        <Text style={styles.errorText}>Vui lòng kiểm tra console log.</Text>
      </View>
    );
  }

  if (!dbReady) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007aff" />
        <Text style={styles.loadingText}>Đang tải ứng dụng và kết nối DB...</Text>
      </View>
    );
  }
  
  // Khi DB đã sẵn sàng, hiển thị Stack Navigator
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* Modal sẽ được tạo ở Q4 */}
      <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#333'
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        marginHorizontal: 20
    }
});