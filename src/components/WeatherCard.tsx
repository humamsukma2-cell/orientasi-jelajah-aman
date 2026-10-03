// src/components/WeatherCard.tsx

import { View, Text } from "react-native";
import { WeatherCardProps, TingkatAQI } from "../../types/cuaca";
import { typeScale, spacing } from "../constants/styles";

const warnaPerTingkat: Record<TingkatAQI, string> = {
  BAIK: "green",
  SEDANG: "goldenrod",
  TIDAK_SEHAT: "orange",
  BERBAHAYA: "crimson",
};

export default function WeatherCard({
  kota,
  suhu,
  tingkatAQI,
  indeksAQI,
  pm25,
  pm10,
}: WeatherCardProps & { pm25: number; pm10: number }) {
  const teksAQI =
    indeksAQI !== undefined
      ? `AQI: ${indeksAQI} (${tingkatAQI})`
      : `AQI: ${tingkatAQI}`;

  const labelAksesibilitas =
    indeksAQI !== undefined
      ? `Cuaca ${kota}, suhu ${suhu} derajat, indeks kualitas udara ${indeksAQI}, kategori ${tingkatAQI}`
      : `Cuaca ${kota}, suhu ${suhu} derajat, kualitas udara ${tingkatAQI}`;

  return (
    <View
      accessible
      accessibilityLabel={labelAksesibilitas}
      style={{
        padding: spacing.sedang,
        borderRadius: 8,
        backgroundColor: "#F4F7FA",
      }}
    >
      <Text style={{ fontWeight: "bold", fontSize: typeScale.judul }}>
        {kota}
      </Text>

      <Text style={{ fontSize: 32 }}>{suhu}°C</Text>

      <Text
        style={{ color: warnaPerTingkat[tingkatAQI], fontSize: typeScale.isi }}
      >
        {teksAQI}
      </Text>

      <Text style={{ fontSize: typeScale.keterangan ?? 12 }}>
        PM2.5: {pm25} • PM10: {pm10}
      </Text>
    </View>
  );
}
