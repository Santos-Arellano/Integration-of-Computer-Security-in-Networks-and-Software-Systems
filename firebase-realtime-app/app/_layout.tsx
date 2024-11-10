import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="input" // Asegúrate de que este nombre coincida con el archivo input.tsx
        options={{
          title: 'Ingresar Datos',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'add-circle' : 'add-circle-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="view" // Asegúrate de que este nombre coincida con el archivo view.tsx
        options={{
          title: 'Ver Datos',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'eye' : 'eye-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}