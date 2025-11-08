import { Ionicons } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router'; // 1. Thêm Link
import React from 'react';
import { Pressable } from 'react-native'; // 2. Thêm Pressable

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Todo Notes',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="home" color={color} />,
          
          // 3. (Câu 4) Thêm nút "+" vào đây
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <Ionicons
                    name="add-circle"
                    size={30}
                    color="#007BFF" // Màu xanh
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),

        }}
      />
    </Tabs>
  );
}