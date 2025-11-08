import { Stack, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Đảm bảo path đúng đến utils/db
import TodoItem from '../../components/TodoItem';
import { getTodos, Todo } from '../../utils/db';

export default function TodoListScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hàm tải dữ liệu từ DB
  const loadTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTodos();
      setTodos(data);
    } catch (e) {
      console.error('Failed to load todos:', e);
      setError('Không thể tải danh sách công việc.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Sử dụng useFocusEffect để tải dữ liệu mỗi khi màn hình được focus
  // (ví dụ: khi quay lại từ màn hình modal thêm/sửa)
  useFocusEffect(
    useCallback(() => {
        loadTodos();
        return () => {};
    }, [loadTodos])
  );
  
  // Hiển thị Loading/Error state
  if (loading && todos.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007aff" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Lỗi: {error}</Text>
      </View>
    );
  }

  // Empty state: hiển thị khi không có công việc nào
  if (todos.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Chưa có việc nào 🎉</Text>
        <Text>Nhấn '+' để thêm công việc mới!</Text>
      </View>
    );
  }

  return (
    <View style={styles.fullContainer}>
      {/* Cấu hình Header */}
      <Stack.Screen
        options={{
            headerTitle: "Todo Notes",
            // Nút "+" sẽ được thêm ở Q4
            headerRight: () => (
                <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            ),
        }}
      />
      
      {/* Danh sách Công việc */}
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
            <TodoItem 
                item={item} 
                onToggleDone={() => {}} 
                onEdit={() => {}} 
                onDelete={() => {}} 
            />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    fullContainer: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    centerContainer: {
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
    emptyText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    errorText: {
      color: 'red',
      fontSize: 16,
    },
    addButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    addButtonText: {
        color: '#007aff',
        fontSize: 24,
        fontWeight: 'bold',
    },
});