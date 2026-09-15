// components/IndikatorAQI.tsx

import { View, Text } from "react-native";
import { LaporanUdara } from "../../types/cuaca";

interface IndikatorAQIProps {
  laporan: LaporanUdara;
}

export default function IndikatorAQI({
  laporan,
}: IndikatorAQIProps) {
  let warnaAQI = "orange";

  if (laporan.tingkat === "BAIK") {
    warnaAQI = "green";
  } else if (laporan.tingkat === "SEDANG") {
    warnaAQI = "orange";
  } else if (laporan.tingkat === "TIDAK_SEHAT") {
    warnaAQI = "red";
  } else if (laporan.tingkat === "BERBAHAYA") {
    warnaAQI = "purple";
  }

  return (
    <View
      style={{
        padding: 16,
        borderRadius: 8,
        backgroundColor: "#F4F7FA",
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 18,
        }}
      >
        {laporan.kota}
      </Text>

      <Text style={{ fontSize: 24 }}>
        AQI: {laporan.indeksAQI}
      </Text>

      <Text style={{ color: warnaAQI }}>
        Tingkat: {laporan.tingkat}
      </Text>

      {laporan.diperbaruiPada && (
        <Text style={{ fontSize: 12 }}>
          Diperbarui: {laporan.diperbaruiPada}
        </Text>
      )}
    </View>
  );
}