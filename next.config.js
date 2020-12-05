const isProd = process.env.NODE_ENV === 'production';
const withImages = require('next-images');

module.exports = withImages({
  basePath: isProd ? '/next-solution/customer/EFC' : '',
  assetPrefix: isProd ? 'https://webresource.123kanfang.com/next-solution/customer/EFC' : '',
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
  // async exportPathMap(
  //   // eslint-disable-next-line no-unused-vars
  //   defaultPathMap,
  //   {
  //     // eslint-disable-next-line no-unused-vars
  //     dev, dir, outDir, distDir, buildId,
  //   },
  // ) {
  //   return {
  //     // '/decoration-node': { page: '/decoration-node' },
  //     // '/sales-office': { page: '/sales-office' },
  //     '/': { page: '/sales-office' },
  //   };
  // },
});
