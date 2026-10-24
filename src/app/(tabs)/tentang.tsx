// app/(tabs)/tentang.tsx
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "react-native";
import { typeScale, spacing } from "../../constants/styles";
import { useTheme } from "../../hooks/use-theme";

export default function TabTentang() {
  const warna = useTheme();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: spacing.sedang,
        backgroundColor: warna.background,
      }}
    >
      <View>
        <Text
          accessibilityLabel="Tentang Jelajah Aman"
          style={{
            fontSize: typeScale.judul,
            fontWeight: "bold",
            marginBottom: spacing.kecil,
            color: warna.text,
          }}
        >
          Jelajah Aman
        </Text>

        <Text style={{ fontSize: typeScale.isi, color: warna.text }}>
          Versi 1.0.0
        </Text>

        <Text
          style={{
            fontSize: typeScale.isi,
            marginTop: spacing.kecil,
            color: warna.text,
          }}
        >
          Pembuat: Muhammad Humam Sukma
        </Text>

        <Text
          style={{
            fontSize: typeScale.isi,
            marginTop: spacing.kecil,
            color: warna.textSecondary,
          }}
        >
          Aplikasi cuaca offline-first dengan indikator kualitas udara.
        </Text>
      </View>
    </SafeAreaView>
  );
}
