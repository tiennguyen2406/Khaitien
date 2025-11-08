import { initDB } from '@/services/db';
import { useEffect, useState } from 'react';

export const useDatabaseInit = () => {
  const [dbReady, setDbReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Gọi hàm khởi tạo bất đồng bộ
    initDB()
      .then(() => {
        setDbReady(true);
      })
      .catch((e) => {
        setError(e as Error);
        console.error('Database initialization failed:', e);
      });
  }, []);

  return { dbReady, error };
};