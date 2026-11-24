// Reciters. 'urdu' is the app's own audio: Al-Sudais & Al-Shuraim with the Urdu translation, in parts.
// The others are Arabic only, one file per ayah from the Islamic Network audio service
// (cdn.islamic.network), which is what lets the Quran text highlight the ayah being recited.
import { RECITERS as URDU_RECITERS } from './config';

export type Reciter = { id: string; name: string; short: string };

export const URDU = 'urdu';

// Names as listed by Islamic Network (api.alquran.cloud/v1/edition/format/audio), written in full.
export const ARABIC_RECITERS: Reciter[] = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy', short: 'Alafasy' },
  { id: 'ar.abdurrahmaansudais', name: 'Abdur-Rahman As-Sudais', short: 'As-Sudais' },
  { id: 'ar.saoodshuraym', name: "Sa'ud Ash-Shuraym", short: 'Ash-Shuraym' },
  { id: 'ar.mahermuaiqly', name: 'Maher Al-Muaiqly', short: 'Al-Muaiqly' },
  { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary', short: 'Al-Husary' },
  { id: 'ar.minshawi', name: 'Mohamed Siddiq Al-Minshawi', short: 'Al-Minshawi' },
  { id: 'ar.abdulbasitmurattal', name: 'Abdul Basit Abdus-Samad', short: 'Abdul Basit' },
  { id: 'ar.shaatree', name: 'Abu Bakr Ash-Shaatree', short: 'Ash-Shaatree' },
  { id: 'ar.ahmedajamy', name: 'Ahmed ibn Ali Al-Ajamy', short: 'Al-Ajamy' },
  { id: 'ar.hanirifai', name: 'Hani Ar-Rifai', short: 'Ar-Rifai' },
];

export const isArabic = (id: string) => id !== URDU && ARABIC_RECITERS.some((r) => r.id === id);

/** Name shown under the title, in the mini player and on the lock screen. */
export function reciterLabel(id: string) {
  if (!isArabic(id)) return `${URDU_RECITERS} · Urdu`;
  return `${ARABIC_RECITERS.find((r) => r.id === id)!.name} · Arabic`;
}
