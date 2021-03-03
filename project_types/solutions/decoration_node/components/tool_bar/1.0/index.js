import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { getUrlParameter } from '../../../../../../util/common';
import { BackgroundTheme } from '../../../../../styles/decoration_node/common';
import GlobalClose from '../../../../../../components/global-close/2.0';

const ContainerSC = styled('div', ['styleSC', 'positionSC'])`
  display: flex;
  height: auto;
  flex-direction: column;
  align-items: center;
  background: ${BackgroundTheme};
  padding: 8px 10px;
  border-radius: 6px;
  ${(props) => props.positionSC};
`;

const ToolItemSC = styled('div', ['styleSC', 'visible'])`
  width: 20px;
  height: ${(props) => (props.visible ? '20px' : 0)};
  opacity: ${(props) => (props.visible ? 1 : 0)};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: ${(props) => (props.visible ? '8px 0' : '0')};
  color: white;
  transition: height .4s;
  
  
  img {
    width: 20px;
  }
`;

const ShortSC = styled('div', ['styleSC', 'isShort'])`
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: ${(props) => (props.isShort ? '2px' : '8px')};
  margin-bottom: 2px;
  color: white;
  transform: ${(props) => (props.isShort ? 'rotate(180deg)' : 'rotate(0)')};
  transition: transform .5s;
 
  img {
    width: 20px;
  }
`;

const ToolBar = ({
  styleSC,
  positionSC,
  onShort,
  onUnShort,
  activePackageId,
}) => {
  const [tourActive, setTourActive] = useState(false);
  const [musicActive, setMusicActive] = useState(false);
  const [rulerActive, setRulerActive] = useState(false);
  const [likeActive, setLikeActive] = useState(false);
  // const [playMusic, pauseMusic] = usePlayMusic('https://vrhouse-web.oss-cn-shanghai.aliyuncs.com/media/salesOffice.mp3');
  const [isShort, setIsShort] = useState(false);
  const [isMessage, setIsMessage] = useState(false);

  const handleTour = (val) => {
    setTourActive(val);
    if (val) {
      // eslint-disable-next-line no-undef
      HouseViewer.BaseAPI.startAutoPlay();
    } else {
      // eslint-disable-next-line no-undef
      HouseViewer.BaseAPI.stopAutoPlay();
    }
  };

  const handleRuler = (val) => {
    setRulerActive(val);
    if (val) {
      // eslint-disable-next-line no-undef
      HouseViewer.BaseAPI.toggleRuler(true);
    } else {
      // eslint-disable-next-line no-undef
      HouseViewer.BaseAPI.toggleRuler(false);
    }
  };

  const handleShort = (val) => {
    setIsShort(val);
    if (val) {
      onShort();
    } else {
      onUnShort();
    }
  };

  const hareMethod = () => {
    const aux = document.createElement('input');
    const host = window.location.href.split('?')[0];
    const domain = getUrlParameter('domain');
    const url = `${host}?hid=${activePackageId}&domain=${domain}`;
    aux.setAttribute('value', url);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand('copy');
    document.body.removeChild(aux);
    console.log('已复制该房源');
    setTimeout(() => {
      console.log('取消提示');
    }, 1000);
  };

  const style = {
    top: '50px',
    ...styleSC,
  };

  return (
    <GlobalClose
      onClose={() => handleShort(true)}
      openListener={!isShort}
      stopPropagation={false}
    >
      <ContainerSC styleSC={style} positionSC={positionSC}>
        <ToolItemSC visible onClick={() => handleTour(!tourActive)}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img
            src={
              tourActive
                // eslint-disable-next-line global-require
                ? require('../../../../../../next_static/decoration_node/img/icon/pause.svg')
                // eslint-disable-next-line global-require
                : require('../../../../../../next_static/decoration_node/img/icon/play.svg')
            }
            style={{ transform: tourActive && 'scale(1.5)' }}
          />
        </ToolItemSC>
        <ToolItemSC visible={!isShort} onClick={() => handlePlayMusic(!musicActive)}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img
            src={
              musicActive
                // eslint-disable-next-line global-require
                ? require('../../../../../../next_static/decoration_node/img/icon/music_active.svg')
                // eslint-disable-next-line global-require
                : require('../../../../../../next_static/decoration_node/img/icon/music_default.svg')
            }
          />
        </ToolItemSC>
        <ToolItemSC visible={!isShort} onClick={() => handleRuler(!rulerActive)}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img
            src={
              rulerActive
                // eslint-disable-next-line global-require
                ? require('../../../../../../next_static/decoration_node/img/icon/ruler_active.svg')
                // eslint-disable-next-line global-require
                : require('../../../../../../next_static/decoration_node/img/icon/ruler_default.svg')
            }
          />
        </ToolItemSC>
        {/* <ToolItemSC visible onClick={() => handleLike(!likeActive)}> */}
        {/*  /!* eslint-disable-next-line jsx-a11y/alt-text *!/ */}
        {/*  <img */}
        {/*    src={ */}
        {/*      likeActive */}
        {/*        // eslint-disable-next-line global-require */}
        {/*        ? require('../../../../../next_static/decoration_node/img/icon/like_active.svg') */}
        {/*        // eslint-disable-next-line global-require */}
        {/*        : require('../../../../../next_static/decoration_node/img/icon/like.svg') */}
        {/*    } */}
        {/*  /> */}
        {/* </ToolItemSC> */}
        <ToolItemSC visible onClick={hareMethod}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img
            src={require('../../../../../../next_static/decoration_node/img/icon/share.svg')}
          />
        </ToolItemSC>
        <ShortSC onClick={() => handleShort(!isShort)} isShort={isShort}>
          {/* eslint-disable-next-line global-require,jsx-a11y/alt-text */}
          <img src={require('../../../../../../next_static/decoration_node/img/icon/short.svg')} />
        </ShortSC>
      </ContainerSC>
    </GlobalClose>
  );
};

ToolBar.propTypes = {
  styleSC: PropTypes.shape({}),
  positionSC: PropTypes.shape({}),
  onShort: PropTypes.func,
  onUnShort: PropTypes.func,
  activePackageId: PropTypes.string.isRequired,
};

ToolBar.defaultProps = {
  styleSC: {},
  positionSC: {
    position: 'absolute',
    right: '12px',
    top: '162px',
  },
  onShort: () => { console.log('This is onShort callback'); },
  onUnShort: () => { console.log('This is onUnShort callback'); },
};

export default ToolBar;
