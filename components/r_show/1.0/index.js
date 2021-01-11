import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ContainerSC = styled('div', ['visible'])`
   display: ${(props) => !props.visible && 'none'};
`;

const RShow = ({
  children,
  visible,
}) => (
  <ContainerSC visible={visible}>
    {children}
  </ContainerSC>
);

RShow.propTypes = {
  children: PropTypes.node.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default RShow;
