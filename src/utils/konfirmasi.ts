// src/utils/konfirmasi.ts
import { Alert, Platform } from "react-native";

/**
 * Menampilkan dialog konfirmasi yang berfungsi di mobile maupun web.
 * Di web, Alert.alert dari React Native Web tidak melakukan apa pun,
 * sehingga dipakai window.confirm milik browser.
 */
export function konfirmasi(judul: string, pesan: string): Promise<boolean> {
  if (Platform.OS === "web") {
    const setuju =
      typeof window !== "undefined" ? window.confirm(pesan) : false;
    return Promise.resolve(setuju);
  }

  return new Promise((resolve) => {
    let sudahDijawab = false;
    const jawab = (nilai: boolean) => {
      if (sudahDijawab) return;
      sudahDijawab = true;
      resolve(nilai);
    };

    Alert.alert(
      judul,
      pesan,
      [
        { text: "Batal", style: "cancel", onPress: () => jawab(false) },
        { text: "Hapus", style: "destructive", onPress: () => jawab(true) },
      ],
      { cancelable: true, onDismiss: () => jawab(false) },
    );
  });
}
