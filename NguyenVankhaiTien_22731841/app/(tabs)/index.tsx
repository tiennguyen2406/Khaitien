import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getTodos, Todo } from '../../services/db'; // Import từ CSDL

export default function HomeScreen() {
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
    // Bọc item trong Pressable và gọi hàm handleToggleTodo
    <Pressable onPress={() => handleToggleTodo(item)}>
      <View style={styles.itemContainer}>
        <Text
          style={[
            styles.itemTitle,
            // (Câu 5) UI gạch ngang nếu done = 1
            item.done === 1 && styles.itemDone,
          ]}
        >
          {item.title}
        </Text>
      </View>
    </Pressable>
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
  itemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemDone: {
    textDecorationLine: 'line-through', // Gạch ngang
    color: '#aaa',
  },
});