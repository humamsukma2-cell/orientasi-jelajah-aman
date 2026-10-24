// src/app/detail/[kota].tsx
import { View, Button } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import WeatherCard from "../../components/WeatherCard";
import { useTheme } from "../../hooks/use-theme";
export default function HalamanDetail() {
  const { kota } = useLocalSearchParams<{ kota: string }>();
  const warna = useTheme();
  return (
    <View style={{ padding: 16, gap: 16, backgroundColor: warna.background }}>
      <WeatherCard
        kota={kota}
        suhu={29}
        tingkatAQI="BAIK"
        pm25={12}
        pm10={20}
      />
      <Button
        title="Tambahkan ke Favorit"
        color={warna.primary}
        onPress={() => router.push("/tambah-favorit")}
      />
    </View>
  );
}
