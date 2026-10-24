// src/constants/weatherCodes.ts
const kamusKodeCuaca: Record<number, string> = {
  0: "Cerah",
  1: "Cerah Berawan",
  2: "Berawan Sebagian",
  3: "Mendung",
  45: "Berkabut",
  48: "Kabut Beku",
  51: "Gerimis Ringan",
  53: "Gerimis Sedang",
  55: "Gerimis Lebat",
  61: "Hujan Ringan",
  63: "Hujan Sedang",
  65: "Hujan Lebat",
  71: "Salju Ringan",
  80: "Hujan Lokal Ringan",
  81: "Hujan Lokal Sedang",
  82: "Hujan Lokal Lebat",
  95: "Badai Petir",
};
export function labelKodeCuaca(kode: number): string {
  return kamusKodeCuaca[kode] ?? "Tidak diketahui";
}

// Nama ikon Ionicons untuk setiap kode cuaca WMO.
export type NamaIkonCuaca =
  | "sunny"
  | "partly-sunny"
  | "cloudy"
  | "cloud-outline"
  | "water"
  | "rainy"
  | "snow"
  | "thunderstorm";

export function ikonKodeCuaca(kode: number): NamaIkonCuaca {
  if (kode === 0) return "sunny";
  if (kode === 1 || kode === 2) return "partly-sunny";
  if (kode === 3) return "cloudy";
  if (kode === 45 || kode === 48) return "cloud-outline";
  if (kode === 51 || kode === 53 || kode === 55) return "water";
  if (
    kode === 61 ||
    kode === 63 ||
    kode === 65 ||
    kode === 80 ||
    kode === 81 ||
    kode === 82
  ) {
    return "rainy";
  }
  if (kode === 71) return "snow";
  if (kode === 95) return "thunderstorm";
  return "cloud-outline";
}
