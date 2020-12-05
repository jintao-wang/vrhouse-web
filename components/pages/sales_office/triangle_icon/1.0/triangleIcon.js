import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { ColorTheme } from '../../../../../styles/sales-office-icon/common';
import RowScroll from '../../../../common/rowScroll/2.0';

const ContainerSC = styled('div', ['visible', 'left'])`
  height: 18px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: -18px;
  left: ${(props) => props.left}px;
`;

const TriangleSC = styled('div')`
  width: 0;
  height: 0;
  border-width: 18px 8px;
  border-style: solid;
  border-color: transparent;
  border-top-color: rgba(0,0,0,.75);
  
`;

const TriangleIcon = ({ left }) => (
  <ContainerSC left={left - 8}>
    <TriangleSC />
  </ContainerSC>
);

TriangleIcon.propTypes = {
  left: PropTypes.number,
};

TriangleIcon.defaultProps = {
  left: {},
};

export default TriangleIcon;
