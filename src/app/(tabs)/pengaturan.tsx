// src/app/(tabs)/pengaturan.tsx
import { useState } from "react";
import { Text, Button, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { hapusSemuaCache } from "../../services/cacheRepository";
import { konfirmasi } from "../../utils/konfirmasi";
import { useTema, type ModeTema } from "../../context/TemaContext";
import { useTheme } from "../../hooks/use-theme";

const PILIHAN_MODE: {
  nilai: ModeTema;
  label: string;
  keterangan: string;
}[] = [
  {
    nilai: "terang",
    label: "Terang",
    keterangan: "Selalu memakai tampilan terang",
  },
  {
    nilai: "gelap",
    label: "Gelap",
    keterangan: "Selalu memakai tampilan gelap",
  },
  {
    nilai: "sistem",
    label: "Ikuti Sistem",
    keterangan: "Mengikuti pengaturan tema perangkat",
  },
];

export default function TabPengaturan() {
  const [pesan, setPesan] = useState<string | null>(null);
  const { mode, setMode } = useTema();
  const warna = useTheme();

  async function hapusDataTersimpan() {
    const setuju = await konfirmasi(
      "Konfirmasi Hapus",
      "Yakin ingin menghapus semua data cuaca tersimpan dari perangkat?",
    );
    if (!setuju) return;
    await hapusSemuaCache();
    setPesan("Data cuaca tersimpan sudah dihapus.");
  }

  return (
    <SafeAreaView
      style={{ flex: 1, padding: 16, gap: 12, backgroundColor: warna.background }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold", color: warna.text }}>
        Jelajah Aman
      </Text>
      <Text style={{ color: warna.textSecondary }}>Versi 1.0.0</Text>

      <View style={{ gap: 8, marginTop: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: "600", color: warna.text }}>
          Mode Tampilan
        </Text>

        {PILIHAN_MODE.map((pilihan) => {
          const dipilih = mode === pilihan.nilai;
          return (
            <TouchableOpacity
              key={pilihan.nilai}
              onPress={() => setMode(pilihan.nilai)}
              accessibilityRole="radio"
              accessibilityState={{ selected: dipilih }}
              accessibilityLabel={`Mode ${pilihan.label}`}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                padding: 12,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: dipilih ? warna.primary : warna.border,
                backgroundColor: dipilih
                  ? warna.backgroundSelected
                  : warna.backgroundElement,
              }}
            >
              <Ionicons
                name={dipilih ? "checkmark-circle" : "ellipse-outline"}
                size={22}
                color={dipilih ? warna.primary : warna.textSecondary}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "600", color: warna.text }}>
                  {pilihan.label}
                </Text>
                <Text style={{ fontSize: 12, color: warna.textSecondary }}>
                  {pilihan.keterangan}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ marginTop: 16 }}>
        <Button
          title="Hapus Data Cuaca Tersimpan"
          onPress={hapusDataTersimpan}
        />
      </View>
      {pesan && (
        <Text accessibilityLabel={pesan} style={{ color: warna.text }}>
          {pesan}
        </Text>
      )}
    </SafeAreaView>
  );
}
