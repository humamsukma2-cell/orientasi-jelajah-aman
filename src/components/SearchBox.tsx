// src/components/SearchBox.tsx
import { useState } from "react";
import { View, TextInput } from "react-native";
import { useTheme } from "../hooks/use-theme";

interface SearchBoxProps {
  onCari: (teks: string) => void;
  nilai?: string;
}

export default function SearchBox({ onCari, nilai }: SearchBoxProps) {
  const [teksLokal, setTeksLokal] = useState("");
  const warna = useTheme();
  // Jika `nilai` diberikan, komponen dikendalikan dari luar (misalnya saat
  // membuka kota dari riwayat pencarian). Jika tidak, tetap memakai state lokal.
  const teks = nilai ?? teksLokal;

  function handleChange(nilaiBaru: string) {
    setTeksLokal(nilaiBaru);
    onCari(nilaiBaru); // kirim setiap perubahan, debounce diatur di pemanggilnya
  }

  return (
    <View>
      <TextInput
        placeholder="Cari nama kota..."
        placeholderTextColor={warna.textSecondary}
        value={teks}
        onChangeText={handleChange}
        accessibilityLabel="Cari cuaca untuk kota yang dimasukkan"
        style={{
          borderWidth: 1,
          borderColor: warna.border,
          backgroundColor: warna.backgroundElement,
          color: warna.text,
          padding: 8,
          borderRadius: 8,
        }}
      />
    </View>
  );
}
