import React from 'react';
import CommonHeader from '../../../components/common_header';
import SafeArea from '../../../components/safe_area';
import Factory from '../../../solutions/factory';

const Home = () => (
  <>
    <CommonHeader
      title="芝华仕全球工厂"
    >
      <script src="https://vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/customer/EFC/config.js" />
      <script src="https://vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/sdk/2020-12-3/three%40120.min.js" />
      <script src="https://vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/sdk/2020-12-3/houseviewer%402020080701.min.js" />
    </CommonHeader>
    <Factory />
    <SafeArea />
  </>
);

export default Home;
