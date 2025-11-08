import * as SQLite from 'expo-sqlite';

// (Câu 1) Cấu trúc DB
export interface Todo {
  id: number;
  title: string;
  done: number; // 0 = false, 1 = true
  created_at: number; // Unix timestamp
}

// (Câu 1) Mở kết nối
const db = SQLite.openDatabaseSync('todos.db');

// (Câu 2) Hàm khởi tạo bảng và seed
export const initDB = async () => {
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      done INTEGER DEFAULT 0,
      created_at INTEGER
    );`
  );

  // (Câu 2 - Tùy chọn seed)
  const firstRow = await db.getFirstAsync('SELECT * FROM todos');
  if (firstRow === null) {
    await db.runAsync(
      'INSERT INTO todos (title, done, created_at) VALUES (?, ?, ?)',
      'Việc mẫu 1', 0, Date.now()
    );
    await db.runAsync(
      'INSERT INTO todos (title, done, created_at) VALUES (?, ?, ?)',
      'Việc mẫu 2 (đã xong)', 1, Date.now() - 10000
    );
  }
};

export const getTodos = async () => {
  const allRows: Todo[] = await db.getAllAsync<Todo>(
    `SELECT * FROM todos ORDER BY created_at DESC;`
  );
  return allRows;
};
export const addTodo = async (title: string) => {
  // Validate title không rỗng (bắt buộc)
  if (title.trim().length === 0) {
    throw new Error('Tiêu đề không được để trống');
  }
  
  const now = Date.now();
  const result = await db.runAsync(
    `INSERT INTO todos (title, done, created_at) VALUES (?, 0, ?);`,
    [title.trim(), now]
  );
  return result;
};
export const toggleTodoDone = async (id: number, currentDoneState: number) => {
  const newState = currentDoneState === 0 ? 1 : 0; // Đảo ngược trạng thái
  const result = await db.runAsync(
    `UPDATE todos SET done = ? WHERE id = ?;`,
    [newState, id]
  );
  return result;
};