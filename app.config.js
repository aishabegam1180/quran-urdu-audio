// Adds the Android version code (raised automatically by every GitHub build,
// which Google Play needs) on top of app.json.
module.exports = ({ config }) => ({
  ...config,
  android: { ...config.android, versionCode: Number(process.env.VERSION_CODE) || 1 },
});
