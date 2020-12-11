import React from 'react';
import styled from 'styled-components';
import AutoHeight from '../../../components/common/auto_height/1.0';
import CommonHeader from "../../../components/common_header";

const ContainerSC = styled('div')`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: orange;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContentSC = styled('div')`
  width: 100%;
  height: 100%;
  background: #666666;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Home = () => (
  <>
    <CommonHeader
      title="虚拟售楼处"
      config="https://vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/customer/EFC/config.js"
    >
      <script src="https://vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/sdk/2020-12-3/three%40120.min.js" />
      <script src="https://vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/sdk/2020-12-3/houseviewer%402020080701.min.js" />
    </CommonHeader>
    <ContainerSC>
      <AutoHeight width="40%" autoHeight="20%">
        <ContentSC>wangjintao</ContentSC>
      </AutoHeight>
    </ContainerSC>
  </>
);

export default Home;
