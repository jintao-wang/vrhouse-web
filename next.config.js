const withImages = require('next-images');

module.exports = withImages({
  basePath: process.env.BASE_PATH,
  assetPrefix: process.env.ASSET_PREFIX,
  publicRuntimeConfig: {
    ASSET_PREFIX: process.env.ASSET_PREFIX,
  },
  dynamicAssetPrefix: true,
  inlineImageLimit: 16384,
  webpack(config, options) {
    if (!options.isServer) {
      // eslint-disable-next-line no-param-reassign
      config.node = {
        fs: 'empty',
      };
    }
    return config;
  },
  trailingSlash: true,
  async exportPathMap(
    // eslint-disable-next-line no-unused-vars
    defaultPathMap,
    {
      // eslint-disable-next-line no-unused-vars
      dev, dir, outDir, distDir, buildId,
    },
  ) {
    return {
      '/': { page: '/sales-office' },
    };
  },
});
