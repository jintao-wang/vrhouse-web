import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import IcoMoon from 'react-icomoon';
import usePlayMusic from '../../../../../../hooks/usePlayMusic';
import { BackgroundTheme, ColorTheme } from '../../../config';
import GlobalClose from '../../../../../../components/global-close/2.0';
import Message from '../../../../../../components/message/1.0';

const iconSet = require('../../../styles/icon/selection.json');

const ContainerSC = styled('div', ['styleSC', 'positionSC'])`
  display: flex;
  height: auto;
  flex-direction: column;
  align-items: center;
  background: ${BackgroundTheme()};
  padding: 8px 10px;
  border-radius: 6px;
  ${(props) => props.positionSC};
`;

const ToolItemSC = styled('div', ['styleSC', 'visible', 'active'])`
  width: 20px;
  height: ${(props) => (props.visible ? '20px' : 0)};
  opacity: ${(props) => (props.visible ? 1 : 0)};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: ${(props) => (props.visible ? '8px 0' : '0')};
  color: ${(props) => (props.active ? ColorTheme() : 'white')};
  transition: height .4s;
  font-size: 20px;
`;

const ShareSC = styled(ToolItemSC)`
  font-size: 20px;
`;

const PlaySC = styled(ToolItemSC)`
  font-size: 22px;
`;

const VrTour = styled(ToolItemSC)`
   @media(min-width: 1026px) {
      display: none;
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
  font-size: 20px;
`;

const ToolBar = ({
  styleSC,
  positionSC,
  onVrOpen,
  onShort,
  onUnShort,
  houseInfo,
  activePackage,
}) => {
  const [tourActive, setTourActive] = useState(false);
  const [rulerActive, setRulerActive] = useState(false);
  const [isShort, setIsShort] = useState(false);
  const [isMessage, setIsMessage] = useState(false);
  const [tourShow, setTourShow] = useState(false);

  const [musicState, onPlayMusic, onPauseMusic] = usePlayMusic({
    initialState: false,
    // eslint-disable-next-line react/prop-types
    musicSource: activePackage.voice,
    isAutoPlay: true,
  });

  useEffect(() => {
    // eslint-disable-next-line no-undef
    HouseViewer.BaseAPI.onAutoWalkStatusChanged((val) => {
      setTourActive(val);
    });
  }, []);

  useEffect(() => () => {
    handlePlayMusic(false);
  }, []);

  useEffect(() => {
    if (window.appConfig.isOutScene) {
      setTourShow(false);
    } else {
      setTourShow(true);
    }
  }, [activePackage]);

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

  const handlePlayMusic = (val) => {
    if (val) {
      onPlayMusic();
    } else {
      onPauseMusic();
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

  const handleVr = () => {
    onVrOpen();
  };

  const handleShort = (val) => {
    setIsShort(val);
    if (val) {
      onShort();
    } else {
      onUnShort();
    }
  };

  const handleShare = () => {
    const aux = document.createElement('input');
    const host = window.location.href.split('?')[0];
    // eslint-disable-next-line react/prop-types
    const url = `${host}?hid=${houseInfo.packageId}&domain=${houseInfo.domain}`;
    aux.setAttribute('value', url);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand('copy');
    document.body.removeChild(aux);
    setIsMessage(true);
    setTimeout(() => {
      setIsMessage(false);
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
        <Message visible={isMessage} />
        <ToolItemSC visible={tourShow} onClick={() => handleTour(!tourActive)} active={tourActive}>
          <IcoMoon iconSet={iconSet} icon="tour" size={20} />
        </ToolItemSC>
        <PlaySC visible onClick={() => handlePlayMusic(!musicState)} active={musicState}>
          <IcoMoon iconSet={iconSet} icon="music" size={20} />
        </PlaySC>
        <ShareSC visible onClick={() => handleShare()}>
          <IcoMoon iconSet={iconSet} icon="share" size={20} />
        </ShareSC>
        <VrTour visible onClick={handleVr}>
          <IcoMoon iconSet={iconSet} icon="vr" size={20} />
        </VrTour>
        {/* <ShortSC onClick={() => handleShort(!isShort)} isShort={isShort}> */}
        {/* <i className="icon-short" /> */}
        {/* </ShortSC> */}
      </ContainerSC>
    </GlobalClose>
  );
};

ToolBar.propTypes = {
  styleSC: PropTypes.shape({}),
  positionSC: PropTypes.shape({}),
  onVrOpen: PropTypes.func,
  onShort: PropTypes.func,
  onUnShort: PropTypes.func,
  // activePackageId: PropTypes.string.isRequired,
  houseInfo: PropTypes.shape({}),
  activePackage: PropTypes.shape({}),
};

ToolBar.defaultProps = {
  styleSC: {},
  positionSC: {
    position: 'absolute',
    right: '12px',
    top: '162px',
  },
  onVrOpen: () => { console.log('This is onVrOpen callback'); },
  onShort: () => { console.log('This is onShort callback'); },
  onUnShort: () => { console.log('This is onUnShort callback'); },
  houseInfo: {},
  activePackage: {},
};

export default ToolBar;
