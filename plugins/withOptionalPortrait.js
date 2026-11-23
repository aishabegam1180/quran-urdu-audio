// The app is shown upright (portrait), but devices that only run sideways
// (some tablets, Chromebooks, XR headsets) should still be able to install it.
// Expo's "orientation": "portrait" makes Android list portrait as a required
// screen feature; this marks it optional so Google Play doesn't hide the app.
const { withAndroidManifest } = require('expo/config-plugins');

const FEATURES = ['android.hardware.screen.portrait', 'android.hardware.screen.landscape'];

module.exports = function withOptionalPortrait(config) {
  return withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults.manifest;
    const list = (manifest['uses-feature'] = manifest['uses-feature'] || []);
    for (const name of FEATURES) {
      let entry = list.find((f) => f.$ && f.$['android:name'] === name);
      if (!entry) {
        entry = { $: { 'android:name': name } };
        list.push(entry);
      }
      entry.$['android:required'] = 'false';
    }
    return cfg;
  });
};
