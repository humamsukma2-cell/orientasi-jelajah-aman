// src/services/riwayatPencarian.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KotaRiwayat } from "../../types/riwayat";

const KUNCI_PENYIMPANAN = "@jelajah_aman:riwayat_pencarian";
export const MAKS_RIWAYAT_PENCARIAN = 10;

// Identitas unik: kota dari pencarian memakai id, sedangkan "Lokasi Saat Ini"
// (id -1) memakai koordinat agar tidak saling menimpa.
function kunciKota(kota: {
  id: number;
  latitude: number;
  longitude: number;
}): string {
  if (kota.id >= 0) return "id:" + kota.id;
  return (
    "koord:" + kota.latitude.toFixed(2) + "," + kota.longitude.toFixed(2)
  );
}

export async function ambilRiwayatPencarian(): Promise<KotaRiwayat[]> {
  try {
    const json = await AsyncStorage.getItem(KUNCI_PENYIMPANAN);
    if (!json) return [];
    const data = JSON.parse(json);
    if (!Array.isArray(data)) return [];
    return data.slice(0, MAKS_RIWAYAT_PENCARIAN);
  } catch {
    return [];
  }
}

export async function simpanRiwayatPencarian(
  kota: Omit<KotaRiwayat, "dicariPada">,
): Promise<void> {
  const daftar = await ambilRiwayatPencarian();
  const kunciBaru = kunciKota(kota);
  const tanpaDuplikat = daftar.filter((k) => kunciKota(k) !== kunciBaru);
  const entriBaru: KotaRiwayat = { ...kota, dicariPada: Date.now() };
  const daftarBaru = [entriBaru, ...tanpaDuplikat].slice(
    0,
    MAKS_RIWAYAT_PENCARIAN,
  );
  await AsyncStorage.setItem(KUNCI_PENYIMPANAN, JSON.stringify(daftarBaru));
}

export async function hapusRiwayatPencarian(dicariPada: number): Promise<void> {
  const daftar = await ambilRiwayatPencarian();
  const daftarBaru = daftar.filter((k) => k.dicariPada !== dicariPada);
  await AsyncStorage.setItem(KUNCI_PENYIMPANAN, JSON.stringify(daftarBaru));
}

export async function hapusSemuaRiwayatPencarian(): Promise<void> {
  await AsyncStorage.removeItem(KUNCI_PENYIMPANAN);
}
