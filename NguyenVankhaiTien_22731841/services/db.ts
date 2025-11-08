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