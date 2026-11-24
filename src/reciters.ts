// Update C (draft, not used yet): verse-by-verse reciters from the Islamic Network CDN.
// Each ayah is its own file, which is what lets the reader highlight the ayah being recited.
// Credit: Islamic Network (https://islamic.network), audio at cdn.islamic.network.
import { globalAyah } from './quran';

export type Reciter = { id: string; name: string; style: string };

// Checked for all 6,236 ayahs before release (see the prep-update-c workflow).
export const RECITERS: Reciter[] = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy', style: 'Murattal' },
  { id: 'ar.abdurrahmaansudais', name: 'Abdur-Rahman As-Sudais', style: 'Murattal' },
  { id: 'ar.saoodshuraym', name: "Sa'ud Ash-Shuraym", style: 'Murattal' },
  { id: 'ar.mahermuaiqly', name: 'Maher Al-Muaiqly', style: 'Murattal' },
  { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary', style: 'Murattal' },
  { id: 'ar.minshawi', name: 'Mohamed Siddiq Al-Minshawi', style: 'Murattal' },
  { id: 'ar.abdulbasitmurattal', name: 'Abdul Basit Abdus Samad', style: 'Murattal' },
  { id: 'ar.shaatree', name: 'Abu Bakr Ash-Shaatree', style: 'Murattal' },
  { id: 'ar.ahmedajamy', name: 'Ahmed ibn Ali Al-Ajamy', style: 'Murattal' },
  { id: 'ar.hanirifai', name: 'Hani Ar-Rifai', style: 'Murattal' },
];

export const DEFAULT_RECITER = 'ar.alafasy';

export const reciterAyahUrl = (reciter: string, surah: number, ayah: number) =>
  `https://cdn.islamic.network/quran/audio/128/${reciter}/${globalAyah(surah, ayah)}.mp3`;

export const reciterName = (id: string) => RECITERS.find((r) => r.id === id)?.name ?? id;
