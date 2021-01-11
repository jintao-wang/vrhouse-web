import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import TMapReact from "../../../TMap/1.0";

const ContainerSC = styled('div')`
   padding: 0 15px;
   box-sizing: border-box;
   user-select:none;
   overflow: auto;
   width: 100%;
   height: 100%;
   display: flex;
   flex-direction: column;
`;

const TitleSC = styled('div')`
  width: 100%;
  padding: 10px 0;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255,255,255,1);
  border-bottom: 1px solid rgba(255,255,255,0.3);
  text-align: center;
`;

const MapContainerSC = styled('div')`
  width: 100%;
  flex: 1;
  padding: 5px 0;
  box-sizing: border-box;
  max-height: calc(100% - 42px);
  position: relative;
`;

const BigSC = styled('div')`
  position: absolute;
  width: 30px;
  height: 30px;
  background: rgba(0,0,0,0.5);
  top: 11px;
  right: 6px;
  z-index: 10000;
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  
  img {
    width: 22px;
  }
`

const MapInfo = ({
  title,
  addressPoint
}) => {
  useEffect(() => {}, []);
  return (
    <ContainerSC>
      {
        title && <TitleSC>{title}</TitleSC>
      }
      <MapContainerSC>
        <BigSC>
          {/* eslint-disable-next-line jsx-a11y/alt-text,global-require */}
          <img src={require('../../static/img/bigger.svg')} />
        </BigSC>
        <TMapReact
          showClose={false}
          showControl={false}
          addressPoint={addressPoint}
        />
      </MapContainerSC>
    </ContainerSC>
  );
};

export default MapInfo;
