// app/_layout.tsx (root layout)
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TemaProvider, useTema } from "../context/TemaContext";

export default function RootLayout() {
  return (
    <TemaProvider>
      <NavigasiUtama />
    </TemaProvider>
  );
}

function NavigasiUtama() {
  const { skema, warna } = useTema();

  return (
    <>
      <StatusBar style={skema === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: warna.background },
          headerTintColor: warna.text,
          headerTitleStyle: { color: warna.text },
          contentStyle: { backgroundColor: warna.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="detail/[kota]" options={{ title: "Detail Cuaca" }} />
        <Stack.Screen
          name="tambah-favorit"
          options={{ presentation: "modal", title: "Tambah Favorit" }}
        />
      </Stack>
    </>
  );
}
