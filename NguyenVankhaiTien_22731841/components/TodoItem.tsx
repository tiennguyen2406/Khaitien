import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Đảm bảo path đúng đến utils/db
import { Todo } from '../utils/db';

// Định nghĩa props cần thiết cho component.
// Các hàm thao tác sẽ được truyền từ màn hình cha.
interface TodoItemProps {
    item: Todo;
    // Tạm thời để các hàm này không làm gì, sẽ triển khai ở Q5, Q6, Q7
    onToggleDone: (id: number, currentDone: 0 | 1) => void;
    onEdit: (todo: Todo) => void; 
    onDelete: (id: number) => void; 
}

const TodoItem: React.FC<TodoItemProps> = ({ item, onToggleDone, onEdit, onDelete }) => (
  <View style={styles.itemContainer}>
      <TouchableOpacity 
        style={styles.itemContent} 
        // onPress tạm thời không làm gì, sẽ dùng cho Toggle Done (Q5)
        onPress={() => {}} 
        // onLongPress tạm thời không làm gì, sẽ dùng cho Edit (Q6)
        onLongPress={() => {}}
      >
        <Text 
          style={[
            styles.title, 
            // Dùng style gạch ngang nếu done == 1
            item.done === 1 && styles.doneText 
          ]}
        >
          {item.done === 1 ? '✅ ' : '🔲 '}
          {item.title}
        </Text>
      </TouchableOpacity>
      {/* Nút Xóa (sẽ triển khai ở Q7) */}
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => {}}
      >
        <Text style={styles.deleteButtonText}>Xóa</Text>
      </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
  },
  itemContent: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 16,
    color: '#333',
  },
  doneText: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  deleteButton: {
    padding: 15,
    backgroundColor: '#ff3b30',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // Ẩn nút xóa tạm thời cho đến Q7
    width: 0, 
    overflow: 'hidden',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TodoItem;