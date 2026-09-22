// app/(tabs)/tentang.tsx
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "react-native";
import { typeScale, spacing } from "../../constants/styles";

export default function TabTentang() {
  return (
    <SafeAreaView style={{ padding: spacing.sedang }}>
      <View>
        <Text
          accessibilityLabel="Tentang Jelajah Aman"
          style={{
            fontSize: typeScale.judul,
            fontWeight: "bold",
            marginBottom: spacing.kecil,
          }}
        >
          Jelajah Aman
        </Text>

        <Text style={{ fontSize: typeScale.isi }}>Versi 1.0.0</Text>

        <Text
          style={{
            fontSize: typeScale.isi,
            marginTop: spacing.kecil,
          }}
        >
          Pembuat: Muhammad Humam Sukma
        </Text>
      </View>
    </SafeAreaView>
  );
}
