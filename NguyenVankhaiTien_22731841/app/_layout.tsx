import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initDB } from '../services/db'; // Import hàm init

export default function RootLayout() {
  const [dbInitialized, setDbInitialized] = React.useState(false);

  useEffect(() => {
    // (Câu 2) Gọi initDB khi app khởi động
    initDB()
      .then(() => setDbInitialized(true))
      .catch((err) => console.error('Lỗi khởi tạo DB:', err));
  }, []);

  // Hiển thị loading cho đến khi DB sẵn sàng
  if (!dbInitialized) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaProvider>
      <Stack>
        {/* (Tabs) là màn hình chính (index) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* Modal để Thêm/Sửa (Câu 4, 6) */}
        {/* Tệp này (app/modal.tsx) chúng ta sẽ tạo sau */}
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </SafeAreaProvider>
  );
}