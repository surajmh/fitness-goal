const {
  withAppBuildGradle,
  withEntitlementsPlist,
  withInfoPlist,
} = require('@expo/config-plugins');

const HEALTH_USAGE =
  'Fitness Goal reads activity and wellness data you choose to share so your progress stays up to date.';

module.exports = function withHealthSync(config) {
  config = withInfoPlist(config, (result) => {
    result.modResults.NSHealthShareUsageDescription = HEALTH_USAGE;
    return result;
  });
  config = withEntitlementsPlist(config, (result) => {
    result.modResults['com.apple.developer.healthkit'] = true;
    return result;
  });
  return withAppBuildGradle(config, (result) => {
    result.modResults.contents = result.modResults.contents.replace(
      /minSdkVersion\s+(?:rootProject\.ext\.minSdkVersion|\d+)/,
      'minSdkVersion 26',
    );
    return result;
  });
};
