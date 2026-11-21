# Quran Safar – Urdu Tarjuma

An Android app for listening to the Holy Quran — recitation by Shaykh Abdur Rahman Al-Sudais and Shaykh Saud Al-Shuraim, each ayah followed by the Urdu translation of Fateh Muhammad Jalandhari. Free, with no ads and no sign-up.

- Play / pause / stop, skip 10 s, previous / next surah
- Keeps playing with the screen locked; controls on the lock screen, Bluetooth and car audio
- Remembers where you stopped and continues from there when you open the app again (saved on each phone, so every user has their own place)
- Continues automatically to the next surah
- Download surahs (or all of them) to listen offline
- Search, browse by Juz, bookmarks with the exact time, notes, sleep timer, speed, repeat, dark mode
- Islamic (Umm al-Qura) date, Qibla compass, 55 duas from the Quran with Urdu translation, feedback by email

## Privacy
No personal data is collected. Read the full [privacy policy](PRIVACY.md).

## Credits
- Duas: Arabic text from the Tanzil Project (https://tanzil.net), used unchanged; Urdu translation by Fateh Muhammad Jalandhari and English translation by Saheeh International (both via Tanzil). The list of dua ayahs follows quranwbw.com/duas.
- Islamic date: Umm al-Qura calendar data from the hijri-converter project.

## Install on your phone
Open this link on your Android phone, download the APK and install it (allow "Install unknown apps" for your browser when asked):

https://github.com/aishabegam1180/quran-urdu-audio/releases/download/app/QuranUrduAudio.apk

## How it is built
- **Audio**: the **Import audio from Google Drive** workflow (Actions tab → Run workflow) copies the files from the shared Drive folder into the `audio` release and writes `manifest.json`. Re-run it if you add or change files in Drive. File names must start with the surah number, e.g. `001-Sura Al-Fatiha [Ayahs 1-7].mp3`.
- **App**: the **Build Android app** workflow builds the APK on every change and publishes it to the `app` release.
- Code: Expo / React Native (`App.tsx`, `src/library.ts`).
