module.exports = {
  transformer: {
    assetPlugins: ["expo-asset/tools/hashAssetFiles"],
    minifierPath: 'metro-minify-terser',
    minifierConfig: {
        // https://www.npmjs.com/package/terser#mangle-options
        ecma: 8,
        keep_classnames: true,
        keep_fnames: true,
        module: true,
        mangle: {
          module: true,
          keep_classnames: true,
          keep_fnames: true,
      }
    }
  },
};
