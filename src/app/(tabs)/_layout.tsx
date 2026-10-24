// app/(tabs)/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTheme } from "../../hooks/use-theme";

export default function TabLayout() {
  const warna = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: warna.background },
        headerTintColor: warna.text,
        headerTitleStyle: { color: warna.text },
        tabBarActiveTintColor: warna.text,
        tabBarInactiveTintColor: warna.textSecondary,
        tabBarStyle: {
          backgroundColor: warna.background,
          borderTopColor: warna.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Beranda",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color as string}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="riwayat"
        options={{
          title: "Favorit & Riwayat",
          tabBarLabel: "Favorit",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={size}
              color={color as string}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="pengaturan"
        options={{
          title: "Pengaturan",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={size}
              color={color as string}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tentang"
        options={{
          title: "Tentang",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "information-circle" : "information-circle-outline"}
              size={size}
              color={color as string}
            />
          ),
        }}
      />
    </Tabs>
  );
}
