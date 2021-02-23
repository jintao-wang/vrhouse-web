import React from 'react';
import getConfig from 'next/config';
import CommonHeader from '../../components/common_header';
import SafeArea from '../../components/common/safe_area';
import SalesOffice from '../../components/pages/sales_office';

const { publicRuntimeConfig } = getConfig();

const Home = () => (
  <>
    <CommonHeader
      title="欧美金融城EFC"
      config={`${publicRuntimeConfig.ASSET_PREFIX}/config.js`}
    />
    <SalesOffice />
    <SafeArea />
  </>
);

export default Home;
