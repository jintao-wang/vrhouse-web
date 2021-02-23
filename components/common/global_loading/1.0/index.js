import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import getConfig from 'next/config';
import Transition from '../../transition/2.0';

const { publicRuntimeConfig } = getConfig();

const ContainerSC = styled('div', ['url', 'aniTrigger'])`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
  background: #2B2B2B url(${(props) => props.url}) no-repeat center / cover;
  opacity: ${(props) => (props.aniTrigger ? 1 : 0)};
  transition: opacity .5s;
  
   &:after {
    content: "";
    width:100%;
    height:100%;
    position: absolute;
    left:0;
    top:0;
    background: inherit;
    filter: blur(4px);
    z-index: 1;
  }
`;

const ContentSC = styled('div')`
  position: absolute;
  left:50%;
  top:50%;
  transform: translate(-50%,-50%);
  padding: 5px 20px;
  z-index:2;
  border-radius: 16px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const LogoCenterSC = styled('img')`
  width: 50px;
  height: 50px;
`;

const LoadPercentSC = styled('div')`
  margin-top: 10px;
  color: white;
  text-align: center;
  font-size: 13px;
`;

const GlobalLoading = ({ visible, url, loadPercent }) => (
  <Transition visible={visible}>
    <ContainerSC url={url}>
      <ContentSC>
        <LogoCenterSC
          src={`${publicRuntimeConfig.ASSET_PREFIX}/static/logo.gif`}
          alt=""
        />
        <LoadPercentSC>
          {`${loadPercent}%`}
        </LoadPercentSC>
      </ContentSC>
    </ContainerSC>
  </Transition>
);

GlobalLoading.propTypes = {
  visible: PropTypes.bool,
  url: PropTypes.string,
  loadPercent: PropTypes.number,
};

GlobalLoading.defaultProps = {
  visible: false,
  url: '',
  loadPercent: 0,
};

export default GlobalLoading;
