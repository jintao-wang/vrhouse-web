import React from 'react';
import styled from 'styled-components';

const ContainerSC = styled('div')`
  position: absolute;
  bottom: 0;
  padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
  padding-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
`;

const SafeArea = () => (
  <ContainerSC />
);

export default SafeArea;
