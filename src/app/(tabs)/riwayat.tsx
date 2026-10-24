// src/app/(tabs)/riwayat.tsx

import { useState, useCallback } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ambilSemuaFavorit, hapusFavorit } from "../../services/favoritStorage";
import {
  ambilRiwayatPencarian,
  hapusRiwayatPencarian,
} from "../../services/riwayatPencarian";
import { KotaFavorit } from "../../../types/favorit";
import { KotaRiwayat } from "../../../types/riwayat";
import { useTheme } from "../../hooks/use-theme";

export default function TabRiwayat() {
  const warna = useTheme();
  const [daftarFavorit, setDaftarFavorit] = useState<KotaFavorit[]>([]);
  const [daftarRiwayat, setDaftarRiwayat] = useState<KotaRiwayat[]>([]);

  const muatData = useCallback(async () => {
    const [favorit, riwayat] = await Promise.all([
      ambilSemuaFavorit(),
      ambilRiwayatPencarian(),
    ]);
    setDaftarFavorit(favorit);
    setDaftarRiwayat(riwayat);
  }, []);

  useFocusEffect(
    useCallback(() => {
      muatData();
    }, [muatData]),
  );

  async function jalankanHapus(id: number) {
    try {
      await hapusFavorit(id);
      setDaftarFavorit((prev) => prev.filter((kota) => kota.id !== id));
    } catch {
      if (Platform.OS === "web") {
        window.alert("Kota favorit gagal dihapus.");
      } else {
        Alert.alert("Gagal", "Kota favorit gagal dihapus.");
      }
    }
  }

  function hapus(id: number, nama: string) {
    const pesan = `Yakin ingin menghapus ${nama} dari favorit?`;

    if (Platform.OS === "web") {
      // Alert.alert tidak berfungsi di react-native-web,
      // jadi pakai dialog konfirmasi bawaan browser.
      if (typeof window !== "undefined" && window.confirm(pesan)) {
        jalankanHapus(id);
      }
      return;
    }

    Alert.alert("Konfirmasi Hapus", pesan, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => jalankanHapus(id),
      },
    ]);
  }

  async function hapusItemRiwayat(dicariPada: number) {
    await hapusRiwayatPencarian(dicariPada);
    setDaftarRiwayat((prev) =>
      prev.filter((kota) => kota.dicariPada !== dicariPada),
    );
  }

  function bukaRiwayat(kota: KotaRiwayat) {
    // Buka Beranda dengan data kota; Beranda akan otomatis menampilkannya.
    router.push({
      pathname: "/",
      params: {
        id: String(kota.id),
        nama: kota.nama,
        lat: String(kota.latitude),
        lon: String(kota.longitude),
        nonce: String(Date.now()),
      },
    });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: warna.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: warna.text }}>
          Kota Favorit
        </Text>

        <Text style={{ color: warna.text }}>
          Tersimpan {daftarFavorit.length} kota
        </Text>

        {daftarFavorit.length === 0 && (
          <Text style={{ color: warna.textSecondary }}>
            Belum ada kota favorit
          </Text>
        )}

        {daftarFavorit.map((kota) => (
          <View
            key={kota.id}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ color: warna.text }}>{kota.nama}</Text>

            <Button
              title="Hapus"
              color={warna.danger}
              onPress={() => {
                hapus(kota.id, kota.nama);
              }}
            />
          </View>
        ))}

        <View
          style={{
            height: 1,
            backgroundColor: warna.border,
            marginVertical: 8,
          }}
        />

        <Text style={{ fontSize: 18, fontWeight: "bold", color: warna.text }}>
          Riwayat Pencarian Terakhir
        </Text>

        <Text style={{ color: warna.text }}>
          {daftarRiwayat.length} dari maksimal 10 pencarian terakhir
        </Text>

        {daftarRiwayat.length === 0 && (
          <Text style={{ color: warna.textSecondary }}>
            Belum ada riwayat pencarian
          </Text>
        )}

        {daftarRiwayat.map((kota) => (
          <View
            key={kota.dicariPada}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => bukaRiwayat(kota)}
              accessibilityLabel={`Buka kembali pencarian ${kota.nama}`}
              style={{ flex: 1 }}
            >
              <Text style={{ color: warna.text }}>{kota.nama}</Text>
              <Text style={{ fontSize: 11, color: warna.textSecondary }}>
                {new Date(kota.dicariPada).toLocaleString("id-ID")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => hapusItemRiwayat(kota.dicariPada)}
              accessibilityLabel={`Hapus riwayat ${kota.nama}`}
              style={{ paddingHorizontal: 12, paddingVertical: 4 }}
            >
              <Text style={{ color: warna.danger, fontSize: 16 }}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
