import React from 'react';
import CommonHeader from '../../../components/common_header';
import SafeArea from '../../../components/safe_area';
import SalesOffice from '../../../project_types/customers/wuhanMax';

const Home = () => (
  <>
    <CommonHeader
      title="MAX.科技园"
    >
      <script src="https://vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/customer/wuhanMax/config.js" />
      <script src="https://vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/sdk/2020-12-3/three%40120.min.js" />
      <script src="https://vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/sdk/2020-12-3/houseviewer%402020080701.min.js" />
    </CommonHeader>
    <SalesOffice />
    <SafeArea />
  </>
);

export default Home;
