/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useContext } from 'react';

import { Colors } from '@/constants/theme';
import { TemaContext } from '@/context/TemaContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme() {
  const konteks = useContext(TemaContext);
  const scheme = useColorScheme();

  // Di dalam TemaProvider, warna mengikuti pilihan pengguna.
  // Fallback ke tema sistem bila hook dipakai di luar provider.
  if (konteks) return konteks.warna;

  return Colors[scheme ?? 'light'];
}
