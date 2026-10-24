// src/app/tambah-favorit.tsx
import { View, Text, Button } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { tambahFavorit } from "../services/favoritStorage";
import { useTheme } from "../hooks/use-theme";

export default function ModalTambahFavorit() {
  const { id, nama, lat, lon } = useLocalSearchParams<{
    id: string;
    nama: string;
    lat: string;
    lon: string;
  }>();
  const warna = useTheme();

  async function simpan() {
    await tambahFavorit({
      id: Number(id),
      nama,
      latitude: Number(lat),
      longitude: Number(lon),
    });
    router.back();
  }

  return (
    <View
      style={{
        padding: 16,
        gap: 16,
        backgroundColor: warna.background,
        flex: 1,
      }}
    >
      <Text style={{ color: warna.text }}>
        Tambahkan {nama} ke daftar favorit?
      </Text>
      <Button title="Simpan" color={warna.primary} onPress={simpan} />
    </View>
  );
}
