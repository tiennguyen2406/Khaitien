import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Button, Platform, StyleSheet, TextInput, View } from 'react-native';
import { addTodo } from '../services/db'; // Import hàm add

export default function ModalScreen() {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    // (Câu 4) Validate title không rỗng
    if (title.trim().length === 0) {
      Alert.alert('Lỗi', 'Tiêu đề không được để trống.');
      return;
    }

    setIsLoading(true);
    try {
      await addTodo(title);
      // (Câu 4) Tự động refresh list (nhờ useFocusEffect ở index)
      router.back(); // Đóng modal
    } catch (error) {
      console.error('Lỗi khi thêm todo:', error);
      Alert.alert('Lỗi', 'Không thể lưu công việc.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nhập tiêu đề công việc..."
        value={title}
        onChangeText={setTitle}
        autoFocus={true} // Tự động mở bàn phím
      />
      
      <Button 
        title={isLoading ? 'Đang lưu...' : 'Lưu'} 
        onPress={handleSave} 
        disabled={isLoading}
      />
      
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});