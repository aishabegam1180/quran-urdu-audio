# Quran Safar – Urdu Tarjuma

An Android app for listening to the Holy Quran (Arabic recitation by Mishary Alafasy, each ayah followed by its Urdu meaning) while travelling.

- Play / pause / stop, skip 10 s, previous / next surah
- Keeps playing with the screen locked; controls on the lock screen, Bluetooth and car audio
- Remembers where you stopped and continues from there when you open the app again (saved on each phone, so every user has their own place)
- Continues automatically to the next surah
- Download surahs (or all of them) to listen offline

## Install on your phone
Open this link on your Android phone, download the APK and install it (allow "Install unknown apps" for your browser when asked):

https://github.com/aishabegam1180/quran-urdu-audio/releases/download/app/QuranUrduAudio.apk

## How it is built
- **Audio**: the **Import audio from Google Drive** workflow (Actions tab → Run workflow) copies the files from the shared Drive folder into the `audio` release and writes `manifest.json`. Re-run it if you add or change files in Drive. File names must start with the surah number, e.g. `001-Sura Al-Fatiha [Ayahs 1-7].mp3`.
- **App**: the **Build Android app** workflow builds the APK on every change and publishes it to the `app` release.
- Code: Expo / React Native (`App.tsx`, `src/library.ts`).
