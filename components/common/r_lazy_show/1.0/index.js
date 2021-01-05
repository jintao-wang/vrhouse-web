import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ContainerSC = styled('div', ['visible'])`
   display: ${(props) => !props.visible && 'none'};
`;

const RLazyShow = ({
  children,
  visible,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    window.addEventListener('load', () => {
      setTimeout(() => {
        setIsLoaded(true);
      });
    }, false);
  }, []);

  return (
    <ContainerSC visible={visible}>
      {isLoaded && children}
    </ContainerSC>
  );
};

RLazyShow.propTypes = {
  children: PropTypes.node.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default RLazyShow;
