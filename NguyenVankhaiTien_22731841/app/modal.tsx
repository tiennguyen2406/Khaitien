import React, { useEffect, useState } from 'react';
import { Alert, Button, Platform, StyleSheet, TextInput, View } from 'react-native';
// 1. Import useLocalSearchParams, router, và useNavigation
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
// 2. Import thêm updateTodoTitle
import { StatusBar } from 'expo-status-bar';
import { addTodo, updateTodoTitle } from '../services/db';

export default function ModalScreen() {
  // 3. Lấy params từ router (từ Câu 6)
  const params = useLocalSearchParams();
  const navigation = useNavigation();

  // Kiểm tra xem đây là modal Sửa hay Thêm
  const isEditMode = params.id;
  const todoId = isEditMode ? parseInt(params.id as string, 10) : null;

  // 4. Khởi tạo title từ params nếu là Sửa
  const [title, setTitle] = useState(isEditMode ? (params.title as string) : '');
  const [isLoading, setIsLoading] = useState(false);

  // (Câu 6) Đặt tiêu đề cho modal
  useEffect(() => {
    navigation.setOptions({
      title: isEditMode ? 'Sửa công việc' : 'Thêm công việc mới'
    });
  }, [navigation, isEditMode]);


  const handleSave = async () => {
    // (Câu 4) Validate title không rỗng
    if (title.trim().length === 0) {
      Alert.alert('Lỗi', 'Tiêu đề không được để trống.');
      return;
    }

    setIsLoading(true);
    try {
      if (isEditMode && todoId) {
        // (Câu 6) Logic Sửa
        await updateTodoTitle(todoId, title);
      } else {
        // (Câu 4) Logic Thêm
        await addTodo(title);
      }
      router.back(); // Đóng modal
    } catch (error) {
      console.error('Lỗi khi lưu todo:', error);
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
        autoFocus={true}
      />
      
      <Button 
        title={isLoading ? 'Đang lưu...' : 'Lưu'} 
        onPress={handleSave} 
        disabled={isLoading}
      />
      
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

// ... (styles giữ nguyên từ Câu 4)
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