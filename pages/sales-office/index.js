import React from 'react';
import CommonHeader from '../../components/common_header';
import SafeArea from '../../components/common/safe_area';
import SalesOffice from '../../components/pages/sales_office';

const Home = () => (
  <>
    <CommonHeader
      title="欧美金融城EFC"
      config="https://vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/customer/EFC/config.js"
    />
    <SalesOffice />
    <SafeArea />
  </>
);

export default Home;
