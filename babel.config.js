module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // 👇 Reanimated doit être le DERNIER plugin
      'react-native-reanimated/plugin',
    ],
  };
};
