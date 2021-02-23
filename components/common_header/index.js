import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const CommonHeader = ({ title, config }) => (
  <Head>
    <meta name="viewport" content="width=device-width,user-scalable=no,minimum-scale=1,maximum-scale=1,viewport-fit=cover" />
    <title>{title}</title>
    <script src={config} />
    <link rel="shortcut icon" sizes="196x196" href={`${publicRuntimeConfig.ASSET_PREFIX}/static/logo%4032x32.png`} />
    <script src={`${publicRuntimeConfig.ASSET_PREFIX}/sdk/three%40120.min.js`} />
    <script src={`${publicRuntimeConfig.ASSET_PREFIX}/sdk/houseviewer%402020080701.min.js`} />
  </Head>
);

CommonHeader.propTypes = {
  title: PropTypes.string,
  config: PropTypes.string,
};

CommonHeader.defaultProps = {
  title: '装修节点解决方案',
  config: 'https://vrhouse-web.oss-cn-shanghai.aliyuncs.com/Solution/sdk/config.js',
};

export default CommonHeader;
