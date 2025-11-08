import {
  openDatabaseAsync,
  type SQLiteDatabase,
  type SQLiteRunResult
} from 'expo-sqlite';

// Mở kết nối đến database và lưu vào một Promise.
const dbPromise: Promise<SQLiteDatabase> = openDatabaseAsync('todos.db');

export interface Todo {
  id: number;
  title: string;
  done: 0 | 1; // 0 (chưa xong) hoặc 1 (đã xong)
  created_at: number; // Dấu thời gian Unix
}

/**
 * Thực thi các câu lệnh SQL INSERT, UPDATE, DELETE, hoặc CREATE.
 * Dùng db.runAsync()
 */
export const executeSql = async (sql: string, params: (string | number)[] = []): Promise<SQLiteRunResult> => {
  const db = await dbPromise;
  
  try {
    const result = await db.runAsync(sql, params);
    return result;
  } catch (error) {
    console.error(`SQL RUN Error [${sql}]:`, error);
    throw error;
  }
};

/**
 * Hàm lấy nhiều bản ghi (SELECT).
 * Dùng db.getAllAsync()
 */
export const executeGetAll = async <T = any>(sql: string, params: (string | number)[] = []): Promise<T[]> => {
    const db = await dbPromise;
    try {
        const result = await db.getAllAsync<T>(sql, params);
        return result;
    } catch (error) {
        console.error(`SQL GET Error [${sql}]:`, error);
        throw error;
    }
};


// --- LOGIC CÂU 3: GET TODOS (ĐÃ THÊM VÀO) ---

/**
 * Lấy tất cả các công việc từ bảng todos, sắp xếp theo thời gian tạo mới nhất.
 */
export const getTodos = async (): Promise<Todo[]> => {
  const todos = await executeGetAll<Todo>('SELECT * FROM todos ORDER BY created_at DESC');
  return todos;
};


// --- LOGIC CÂU 2: TẠO BẢNG & SEED ---

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER DEFAULT 0,
    created_at INTEGER
  );
`;

const SEED_SQL_1 = 'INSERT INTO todos (title, created_at) VALUES (?, ?)';
const SEED_SQL_2 = 'INSERT INTO todos (title, done, created_at) VALUES (?, 1, ?)';

export const initDatabase = async () => {
  const db = await dbPromise;
  try {
    // 1. Tạo bảng 
    await db.execAsync(CREATE_TABLE_SQL);
    console.log("Database initialized: Table 'todos' checked/created.");

    // 2. Kiểm tra và Seed 
    const countResult = await executeGetAll<{ count: number }>('SELECT COUNT(*) AS count FROM todos');
    const count = countResult[0].count; 

    if (count === 0) {
      console.log('Seeding initial data...');
      await executeSql(SEED_SQL_1, ['Lên kế hoạch dự án Todo App', Date.now() - 3600000]);
      await executeSql(SEED_SQL_2, ['Hoàn thành bài tập SQL', Date.now()]);
      console.log('Initial data seeded.');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};