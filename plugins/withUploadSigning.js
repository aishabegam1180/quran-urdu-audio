// Signs release builds with the Play upload key when its details are in the
// environment (UPLOAD_STORE_FILE etc., set only by the GitHub build for the AAB).
// Without them, builds stay signed exactly as before, so the APK link keeps
// updating existing installs.
const { withAppBuildGradle } = require('expo/config-plugins');

const UPLOAD_CONFIG = `    signingConfigs {
        upload {
            if (System.getenv('UPLOAD_STORE_FILE')) {
                storeFile file(System.getenv('UPLOAD_STORE_FILE'))
                storePassword System.getenv('UPLOAD_STORE_PASSWORD')
                keyAlias System.getenv('UPLOAD_KEY_ALIAS')
                keyPassword System.getenv('UPLOAD_KEY_PASSWORD')
            }
        }
`;

module.exports = function withUploadSigning(config) {
  return withAppBuildGradle(config, (cfg) => {
    let g = cfg.modResults.contents;
    if (g.includes("System.getenv('UPLOAD_STORE_FILE')")) return cfg;
    const a = g.replace(/ {4}signingConfigs \{\n/, UPLOAD_CONFIG);
    const b = a.replace(
      /(release \{[\s\S]*?)signingConfig signingConfigs\.debug/,
      "$1signingConfig System.getenv('UPLOAD_STORE_FILE') ? signingConfigs.upload : signingConfigs.debug",
    );
    if (a === g || b === a) throw new Error('withUploadSigning: build.gradle layout not recognised');
    cfg.modResults.contents = b;
    return cfg;
  });
};
