import React, { useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import PropTypes from 'prop-types';
import Animation from '../../animation/2.0';

const fadeIn = keyframes`
  0% {
     transform: translateY(0);
  }
  100% {
     transform: translateY(50px);
  }
`;

const fadeOut = keyframes`
  0% {
    transform: translateY(50px);
  }
  100% {
    transform: translateY(0);
  }
`;

const fadeCss = (aniTrigger) => {
  if (aniTrigger) return css` ${fadeIn} .4s forwards`;
  return css` ${fadeOut} .4s forwards`;
};

const ContainerSC = styled('div', ['aniTrigger'])`
  width: 180px;
  height: 36px;
  left: 0;
  right: 0;
  background: white;
  border-radius: 18px;
  top: -36px;
  animation: ${(props) => fadeCss(props.aniTrigger)};
  position: fixed;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000001;
  
`;

const Message = ({
  visible,
  message,
}) => {
  useEffect(() => {}, []);
  return (
    <Animation visible={visible}>
      <ContainerSC>
        {message}
      </ContainerSC>
    </Animation>
  );
};

Message.propTypes = {
  visible: PropTypes.bool,
  message: PropTypes.string,
};

Message.defaultProps = {
  visible: false,
  message: '已复制该房源链接！',
};

export default Message;
