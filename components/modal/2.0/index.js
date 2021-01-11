import React, { useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import PropTypes from 'prop-types';
import Animation from '../../animation/1.0';
import GlobalClose from '../../global-close/1.0';

const fadeIn = keyframes`
  0% {
     opacity: 0;
     transform: scale(0);
  }
  100% {
     opacity: 1;
     transform: scale(1);
  }
`;

const fadeOut = keyframes`
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0);
  }
`;

const fadeCss = (aniTrigger) => {
  if (aniTrigger) return css` ${fadeIn} .4s forwards`;
  return css` ${fadeOut} .4s forwards`;
};

const ContainerSC = styled('div', ['aniTrigger'])`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  background-color: ${(props) => (props.aniTrigger ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0)')};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color .5s;
 
`;

const ContentSC = styled('div', ['aniTrigger', 'pos'])`
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
  border-radius: 2px;
  position: relative;
  animation: ${(props) => fadeCss(props.aniTrigger)};
  transform-origin:  ${(props) => props.pos.x}px ${(props) => props.pos.y}px;
  margin-top: -150px;
`;

const Modal = ({
  config, display, closeFunc, children,
}) => {
  const { sameOrigin } = config;
  const [pos, setPos] = useState({
    x: 0.001,
    y: 0.001,
  });
  const contentRef = useRef(null);

  const initialModal = () => {
    setPos({
      x: 0.001,
      y: 0.001,
    });
    contentRef.current = null;
  };

  const ModalRender = (trigger, callback) => (
    <ContainerSC aniTrigger={trigger}>
      <GlobalClose closeHandle={closeFunc}>
        <ContentSC
          onAnimationEnd={() => {
            callback();
            if (trigger || sameOrigin) return;
            initialModal();
          }}
          aniTrigger={trigger}
          pos={pos}
        >
          {children}
        </ContentSC>
      </GlobalClose>
    </ContainerSC>

  );

  return (
    <Animation content={ModalRender} visible={display} />
  );
};

Modal.propTypes = {
  config: PropTypes.shape({
    sameOrigin: PropTypes.bool,
  }),
  display: PropTypes.bool,
  closeFunc: PropTypes.func,
  children: PropTypes.node,
};

Modal.defaultProps = {
  config: {
    sameOrigin: true,
  },
  display: true,
  closeFunc: () => { console.log('global close'); },
  children: <div>modal content</div>,
};

export default Modal;
