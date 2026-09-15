// app/index.tsx

import { View } from "react-native";
import { useState, useEffect } from "react";

import WeatherCard from "../components/WeatherCard";
import SearchBox from "../components/SearchBox";
import RiwayatList from "../components/RiwayatList";
import IndikatorAQI from "../components/indikatorAQI";

export default function HalamanUtama() {
  const [kotaAktif, setKotaAktif] = useState("Pekalongan");
  const [riwayat, setRiwayat] = useState<string[]>(["Pekalongan"]);

  const laporanUdara = {
    kota: kotaAktif,
    indeksAQI: 42,
    tingkat: "BAIK" as const,
    diperbaruiPada: "15 September 2026",
  };

  useEffect(() => {
    console.log("Kota aktif berubah menjadi:", kotaAktif);
  }, [kotaAktif]);

  function handleCari(kota: string) {
    setKotaAktif(kota);

    if (!riwayat.includes(kota)) {
      setRiwayat([...riwayat, kota]);
    }
  }

  return (
    <View style={{ padding: 16, gap: 16 }}>
      <SearchBox onCari={handleCari} />

      <WeatherCard
        kota={kotaAktif}
        suhu={29}
        tingkatAQI="BAIK"
      />

      <IndikatorAQI laporan={laporanUdara} />

      <RiwayatList daftarKota={riwayat} />
    </View>
  );
}