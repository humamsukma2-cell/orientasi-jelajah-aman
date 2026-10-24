// src/app/(tabs)/index.tsx
import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Button,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import SearchBox from "../../components/SearchBox";
import WeatherCard from "../../components/WeatherCard";
import AtribusiCuaca from "../../components/AtribusiCuaca";
import StatusData from "../../components/StatusData";
import { useDebounce } from "../../hooks/use-debounce";
import { useTheme } from "../../hooks/use-theme";
import { cariKota } from "../../services/geocodingService";
import {
  ambilCuacaOfflineFirst,
  BATAS_CACHE_MS,
} from "../../services/cuacaRepository";
import {
  bersihkanCacheLama,
  daftarKotaTersimpan,
  hapusCache,
} from "../../services/cacheRepository";
import { simpanRiwayatPencarian } from "../../services/riwayatPencarian";
import { konfirmasi } from "../../utils/konfirmasi";
import {
  mintaIzinLokasi,
  ambilKoordinatSaatIni,
} from "../../services/locationService";
import { konversiTingkatAQI } from "../../services/weatherAdapter";
import { labelKodeCuaca, ikonKodeCuaca } from "../../constants/weatherCodes";
import { HasilGeocoding } from "../../../types/geocoding";
import {
  HasilCuacaOffline,
  RingkasanKotaTersimpan,
} from "../../../types/cache";

function formatTanggalPrakiraan(iso: string): string {
  try {
    const tanggal = new Date(iso + "T00:00:00");
    if (Number.isNaN(tanggal.getTime())) return iso;
    return tanggal.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  } catch {
    return iso;
  }
}

export default function HalamanUtama() {
  const warna = useTheme();
  const [teksCari, setTeksCari] = useState("");
  const [hasilPencarian, setHasilPencarian] = useState<HasilGeocoding[]>([]);
  const [kotaTerpilih, setKotaTerpilih] = useState<HasilGeocoding | null>(null);
  const [hasil, setHasil] = useState<HasilCuacaOffline | null>(null);
  const [kotaTersimpan, setKotaTersimpan] = useState<RingkasanKotaTersimpan[]>(
    [],
  );
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [pesanError, setPesanError] = useState<string | null>(null);
  const [pesanLokasi, setPesanLokasi] = useState<string | null>(null);
  const [pesanCache, setPesanCache] = useState<string | null>(null);
  const teksTertunda = useDebounce(teksCari, 500);
  const requestIdRef = useRef(0); // pencegah race condition
  const params = useLocalSearchParams<{
    id?: string;
    nama?: string;
    lat?: string;
    lon?: string;
    nonce?: string;
  }>();
  const nonceTerakhirRef = useRef<string | null>(null);
  async function muatKotaTersimpan() {
    setKotaTersimpan(await daftarKotaTersimpan());
  }

  async function hapusKotaTersimpan(kunci: string, nama: string) {
    const setuju = await konfirmasi(
      "Konfirmasi Hapus Cache",
      `Yakin ingin menghapus cache cuaca ${nama} dari perangkat?`,
    );
    if (!setuju) return;

    try {
      await hapusCache(kunci);
      setPesanCache(`Cache cuaca ${nama} sudah dihapus.`);
      await muatKotaTersimpan();
    } catch {
      setPesanCache("Cache cuaca gagal dihapus. Silakan coba lagi.");
    }
  }
  // Saat aplikasi dibuka: buang cache > 7 hari, lalu tampilkan daftar tersimpan
  useEffect(() => {
    bersihkanCacheLama(BATAS_CACHE_MS)
      .then(muatKotaTersimpan)
      .catch(() => {});
  }, []);
  useEffect(() => {
    if (teksTertunda.trim().length === 0) {
      setHasilPencarian([]);
      return;
    }
    cariKota(teksTertunda)
      .then(setHasilPencarian)
      .catch(() => setHasilPencarian([]));
  }, [teksTertunda]);
  // Membuka kota yang diklik dari tab Riwayat lewat parameter navigasi.
  useEffect(() => {
    if (!params.nama || !params.lat || !params.lon) return;
    if (params.nonce && nonceTerakhirRef.current === params.nonce) return;
    nonceTerakhirRef.current = params.nonce ?? String(Date.now());
    const kota = {
      id: Number(params.id ?? -1),
      name: String(params.nama),
      latitude: Number(params.lat),
      longitude: Number(params.lon),
      country: "",
    };
    setTeksCari(kota.name);
    pilihKota(kota);
    // pilihKota sengaja tidak dimasukkan agar tidak memicu ulang setiap render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.nonce]);

  async function pilihKota(kota: HasilGeocoding, paksaPerbarui = false) {
    setKotaTerpilih(kota);
    const idSaatIni = ++requestIdRef.current;
    setSedangMemuat(true);
    setPesanError(null);
    try {
      const data = await ambilCuacaOfflineFirst(
        {
          id: kota.id,
          nama: kota.name,
          latitude: kota.latitude,
          longitude: kota.longitude,
        },
        { paksaPerbarui },
      );
      if (idSaatIni !== requestIdRef.current) return; // hasil basi, abaikan
      setHasil(data);
      // Catat kota yang berhasil dibuka ke riwayat pencarian (maks 10).
      simpanRiwayatPencarian({
        id: kota.id,
        nama: kota.name,
        latitude: kota.latitude,
        longitude: kota.longitude,
      }).catch(() => {});
      muatKotaTersimpan();
    } catch (err) {
      if (idSaatIni !== requestIdRef.current) return;
      setHasil(null);
      setPesanError(
        "Belum ada data tersimpan dan tidak ada koneksi internet. Sambungkan internet lalu coba lagi.",
      );
    } finally {
      if (idSaatIni === requestIdRef.current) setSedangMemuat(false);
    }
  }
  async function gunakanLokasiSaatIni() {
    const status = await mintaIzinLokasi();
    if (status === "denied") {
      setPesanLokasi(
        "Izin lokasi ditolak. Silakan cari kota secara manual di atas.",
      );
      return;
    }
    if (status === "unavailable") {
      setPesanLokasi(
        "Layanan lokasi tidak aktif di perangkat ini. Silakan cari kota secara manual.",
      );
      return;
    }
    setPesanLokasi(null);
    const koordinat = await ambilKoordinatSaatIni();
    pilihKota({
      id: -1,
      name: "Lokasi Saat Ini",
      latitude: koordinat.latitude,
      longitude: koordinat.longitude,
      country: "",
    });
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: warna.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <SearchBox onCari={setTeksCari} nilai={teksCari} />
        <Button
          title="Gunakan Lokasi Saat Ini"
          color={warna.primary}
          onPress={gunakanLokasiSaatIni}
        />
        {pesanLokasi && (
          <Text style={{ color: warna.text }} accessibilityLabel={pesanLokasi}>
            {pesanLokasi}
          </Text>
        )}
        {hasilPencarian.map((kota) => (
          <TouchableOpacity key={kota.id} onPress={() => pilihKota(kota)}>
            <Text style={{ color: warna.text }}>{kota.name}</Text>
          </TouchableOpacity>
        ))}
        {kotaTersimpan.length > 0 && (
          <View style={{ gap: 6 }}>
            <Text style={{ fontWeight: "bold", color: warna.text }}>
              Tersimpan di perangkat (bisa dibuka offline)
            </Text>
            {kotaTersimpan.map((k) => (
              <View
                key={k.kunci}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() =>
                    pilihKota({
                      id: k.id,
                      name: k.nama,
                      latitude: k.latitude,
                      longitude: k.longitude,
                      country: "",
                    })
                  }
                >
                  <Text style={{ color: warna.text }}>{k.nama}</Text>
                </TouchableOpacity>
                <Button
                  title="Hapus"
                  color={warna.danger}
                  onPress={() => hapusKotaTersimpan(k.kunci, k.nama)}
                />
              </View>
            ))}
            {pesanCache && (
              <Text
                accessibilityLabel={pesanCache}
                style={{ color: warna.textSecondary }}
              >
                {pesanCache}
              </Text>
            )}
          </View>
        )}
        {sedangMemuat && <ActivityIndicator color={warna.primary} />}
        {pesanError && (
          <View>
            <Text style={{ color: warna.text }} accessibilityLabel={pesanError}>
              {pesanError}
            </Text>
            <Button
              title="Coba Lagi"
              color={warna.primary}
              onPress={() => kotaTerpilih && pilihKota(kotaTerpilih, true)}
            />
          </View>
        )}
        {hasil && kotaTerpilih && !sedangMemuat && (
          <>
            <StatusData
              sumber={hasil.sumber}
              disimpanPada={hasil.disimpanPada}
            />

            <WeatherCard
              kota={kotaTerpilih.name}
              suhu={hasil.cuaca.saatIni.suhu}
              tingkatAQI={konversiTingkatAQI(hasil.kualitasUdara.indeksAQI)}
              indeksAQI={hasil.kualitasUdara.indeksAQI}
              pm25={hasil.kualitasUdara.pm25}
              pm10={hasil.kualitasUdara.pm10}
            />
            <Text style={{ fontSize: 12, color: warna.textSecondary }}>
              Kondisi: {labelKodeCuaca(hasil.cuaca.saatIni.kodeCuaca)}{" "}
              {"\u2022"} Angin {hasil.cuaca.saatIni.kecepatanAngin} km/j
            </Text>
            <View style={{ gap: 8 }}>
              <Text style={{ fontWeight: "bold", color: warna.text }}>
                Prakiraan 7 Hari
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                {hasil.cuaca.harian.tanggal.slice(0, 7).map((tanggal, indeks) => {
                  const kode = hasil.cuaca.harian.kodeCuaca[indeks] ?? 0;
                  const maks = hasil.cuaca.harian.suhuMaksimal[indeks];
                  const min = hasil.cuaca.harian.suhuMinimal[indeks];
                  return (
                    <View
                      key={tanggal}
                      accessible
                      accessibilityLabel={`Prakiraan ${formatTanggalPrakiraan(tanggal)}: ${labelKodeCuaca(kode)}`}
                      style={{
                        width: 104,
                        padding: 10,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: warna.border,
                        backgroundColor: warna.card,
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <Text
                        style={{ fontSize: 12, color: warna.textSecondary }}
                      >
                        {indeks === 0
                          ? "Hari ini"
                          : formatTanggalPrakiraan(tanggal)}
                      </Text>
                      <Ionicons
                        name={ikonKodeCuaca(kode)}
                        size={26}
                        color={warna.primary}
                      />
                      <Text
                        numberOfLines={1}
                        style={{ fontSize: 11, color: warna.textSecondary }}
                      >
                        {labelKodeCuaca(kode)}
                      </Text>
                      <Text style={{ fontSize: 13, color: warna.text }}>
                        {typeof maks === "number" ? Math.round(maks) : "-"}° /{" "}
                        {typeof min === "number" ? Math.round(min) : "-"}°
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
            <Button
              title="Perbarui Sekarang"
              color={warna.primary}
              onPress={() => pilihKota(kotaTerpilih, true)}
            />
            <Button
              title="Tambahkan ke Favorit"
              color={warna.primary}
              onPress={() =>
                router.push({
                  pathname: "/tambah-favorit",

                  params: {
                    id: String(kotaTerpilih.id),
                    nama: kotaTerpilih.name,
                    lat: String(kotaTerpilih.latitude),
                    lon: String(kotaTerpilih.longitude),
                  },
                })
              }
            />
          </>
        )}
        <AtribusiCuaca />
      </ScrollView>
    </SafeAreaView>
  );
}
