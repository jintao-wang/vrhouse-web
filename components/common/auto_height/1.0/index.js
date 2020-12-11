import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ContainerSC = styled('div', ['width'])`
  width: ${(props) => props.width || '100%'};
`;

const BoxContainerSC = styled('div', ['autoHeight'])`
  width: 100%;
  padding-bottom: ${(props) => props.autoHeight || '100%'};
  height: 0;
  position: relative;
`;

const BoxContentSC = styled('div')`
  width: 100%;
  height: 100%;
  position: absolute;
`;

const AutoHeight = ({ children, width, autoHeight }) => (
  <ContainerSC width={width}>
    <BoxContainerSC autoHeight={autoHeight}>
      <BoxContentSC>
        {children}
      </BoxContentSC>
    </BoxContainerSC>
  </ContainerSC>
);

AutoHeight.propTypes = {
  children: PropTypes.node,
  width: PropTypes.string,
  autoHeight: PropTypes.string,
};

AutoHeight.defaultProps = {
  children: <div />,
  width: PropTypes.string,
  autoHeight: PropTypes.string,
};

export default AutoHeight;
