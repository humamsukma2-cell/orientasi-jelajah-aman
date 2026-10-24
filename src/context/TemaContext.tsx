// src/context/TemaContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Colors } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";

export type ModeTema = "terang" | "gelap" | "sistem";
export type SkemaWarna = "light" | "dark";
export type WarnaTema = (typeof Colors)["light"] | (typeof Colors)["dark"];

const KUNCI_MODE_TEMA = "@jelajah_aman:mode_tema";

interface NilaiTema {
  mode: ModeTema;
  setMode: (mode: ModeTema) => void;
  skema: SkemaWarna;
  warna: WarnaTema;
}

export const TemaContext = createContext<NilaiTema | null>(null);

export function TemaProvider({ children }: { children: ReactNode }) {
  const skemaSistem = useColorScheme();
  const [mode, setModeState] = useState<ModeTema>("sistem");

  // Muat preferensi tersimpan saat aplikasi dibuka.
  useEffect(() => {
    let masihAktif = true;
    AsyncStorage.getItem(KUNCI_MODE_TEMA)
      .then((nilai) => {
        if (!masihAktif) return;
        if (nilai === "terang" || nilai === "gelap" || nilai === "sistem") {
          setModeState(nilai);
        }
      })
      .catch(() => {});
    return () => {
      masihAktif = false;
    };
  }, []);

  function setMode(nilaiBaru: ModeTema) {
    setModeState(nilaiBaru);
    AsyncStorage.setItem(KUNCI_MODE_TEMA, nilaiBaru).catch(() => {});
  }

  const skema: SkemaWarna =
    mode === "sistem"
      ? skemaSistem === "dark"
        ? "dark"
        : "light"
      : mode === "gelap"
        ? "dark"
        : "light";

  const nilai = useMemo<NilaiTema>(
    () => ({ mode, setMode, skema, warna: Colors[skema] }),
    [mode, skema],
  );

  return <TemaContext.Provider value={nilai}>{children}</TemaContext.Provider>;
}

export function useTema(): NilaiTema {
  const konteks = useContext(TemaContext);
  if (!konteks) {
    throw new Error("useTema harus dipakai di dalam TemaProvider");
  }
  return konteks;
}
