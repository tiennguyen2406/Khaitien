import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { deleteTodo, getTodos, Todo, toggleTodoDone } from '../../services/db'; // Import từ CSDL
// 1. Import thêm Alert và Ionicons
// 2. Import thêm Ionicons
// 3. Import hàm deleteTodo
// 2. Import hàm toggleTodoDone

export default function HomeScreen() {
  const handleEditPress = (item: Todo) => {
    // Mở modal và truyền 'id' và 'title' cũ
    router.push({
      pathname: '/modal',
      params: { id: item.id, title: item.title }
    });
  };
  const handleDelete = (id: number) => {
    // (Câu 7) Hiển thị Alert xác nhận 
    Alert.alert(
      'Xác nhận Xóa',
      'Bạn có chắc muốn xóa công việc này không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTodo(id);
              loadTodos(); // Tải lại danh sách
            } catch (error) {
              console.error('Lỗi khi xóa todo:', error);
            }
          },
        },
      ]
    );
  };

  // 4. (Câu 6) Cập nhật hàm renderItem
  
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // (Câu 3) Dùng hook để lấy dữ liệu từ SQLite
  const loadTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedTodos = await getTodos();
      setTodos(fetchedTodos);
    } catch (error) {
      console.error('Lỗi khi tải todos:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Tải lại danh sách mỗi khi focus vào màn hình này
  useFocusEffect(
    useCallback(() => {
      loadTodos();
    }, [loadTodos])
  );

  const handleToggleTodo = async (item: Todo) => {
    try {
      await toggleTodoDone(item.id, item.done);
      // (Câu 5) Tải lại danh sách ngay lập tức
      loadTodos();
    } catch (error) {
      console.error('Lỗi khi toggle todo:', error);
    }
  };

  // 4. (Câu 5) Cập nhật hàm renderItem
  const renderItem = ({ item }: { item: Todo }) => (
    // Chúng ta không dùng onLongPress cho item nữa, mà dùng cho nút Sửa
    <View style={styles.itemContainer}>
      {/* Phần nội dung (cho Câu 5) */}
      <Pressable style={styles.itemContent} onPress={() => handleToggleTodo(item)}>
        <Text
          style={[
            styles.itemTitle,
            item.done === 1 && styles.itemDone,
          ]}
        >
          {item.title}
        </Text>
      </Pressable>

      {/* Phần nút (Câu 6 và 7) */}
      <View style={styles.itemButtons}>
        {/* Nút Sửa (Câu 6) */}
        <Pressable style={styles.iconButton} onPress={() => handleEditPress(item)}>
          <Ionicons name="pencil" size={20} color="#007BFF" />
        </Pressable>
        {/* Nút Xóa (Câu 7) */}
        <Pressable style={styles.iconButton} onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash" size={20} color="#DC3545" />
        </Pressable>
      </View>
    </View>
  );
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.containerCenter}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }
  

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* (Câu 3) Hiển thị danh sách */}
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        // (Câu 3) Empty state
        ListEmptyComponent={
          <Text style={styles.emptyText}>Chưa có việc nào</Text>
        }
      />
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  containerCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
  // (Câu 7) Sửa lại itemContainer
  itemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row', // Hiển thị các phần tử trên một hàng
    justifyContent: 'space-between', // Đẩy nội dung và nút ra 2 bên
    alignItems: 'center',
  },
  itemContent: {
    flex: 1, // Cho phép nội dung co giãn
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemDone: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  // (Câu 7) Style cho các nút
  itemButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 15, // Khoảng cách giữa các nút
    padding: 5,
  },
});