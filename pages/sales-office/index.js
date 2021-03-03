import React from 'react';
import getConfig from 'next/config';
import CommonHeader from '../../components/common_header';
import SafeArea from '../../components/common/safe_area';
import SalesOffice from '../../components/pages/sales_office';
import { PageInfo } from '../../solution_config/sales_office/data';

const { publicRuntimeConfig } = getConfig();

const Home = () => (
  <>
    <CommonHeader
      title={PageInfo.title}
      config={`${publicRuntimeConfig.ASSET_PREFIX}/config.js`}
    />
    <SalesOffice />
    <SafeArea />
  </>
);

export default Home;
