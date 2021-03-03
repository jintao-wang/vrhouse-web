import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import useLoadHouse from '../../../hooks/load_house/1.0/useLoadHouse';
import BottomBar from './components/bottom_bar/1.0';
import Panner3D from '../../../components/pannel_3d/1.0';
import ToolBar from './components/tool_bar/1.0';
import useInterval from '../../../hooks/useInterval';
import PanelChange3D from '../../../components/panel_change_3D/1.0';
import { BackgroundTheme, nodeList } from './config';
import HouseInfo from '../../../models/houseInfo';
import { getUrlParameter } from '../../../util/common';
import GlobalLoading from '../../../components/global_loading/1.0';

const ContainerSC = styled('div')`
  width: 100%;
  height: 100%;
`;

const VRContainerSC = styled('div')`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
  
  >canvas {
    width: 100% !important;
    height: 100% !important;
    float: left;  
  }
`;

const PanoramaContainerSC = styled('div', ['visible'])`
   display: ${(props) => !props.visible && 'none'}
`;

const CoverContainerSC = styled('div', ['url', 'aniTrigger'])`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
  background: #2B2B2B url(${(props) => props.url}) no-repeat center / cover;
  opacity: ${(props) => (props.aniTrigger ? 1 : 0)};
  transition: opacity .5s;
  
  &:after {
    content: "";
    width:100%;
    height:100%;
    position: absolute;
    left:0;
    top:0;
    background: inherit;
    filter: blur(4px);
    z-index: 1;
  }
  
  .content {
    position: absolute;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
    padding: 5px 20px;
    z-index:2;
    //background: ${BackgroundTheme()};
    border-radius: 16px;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    
    .loading {
      width: 24px;
    }
  }
  
`;

const LogoCenterSC = styled('img')`
  width: 50px;
  height: 50px;
`;

const LoadPercentSC = styled('div')`
  margin-top: 10px;
  color: white;
  text-align: center;
  font-size: 13px;
`;

const LogoSC = styled('img')`
  position: absolute;
  left: 20px;
  top: 20px;
  width: 60px;
`;

const DecorationNode = () => {
  const [vrContainerRef, setVrContainerRef] = useState(useRef(null));
  const [activePanner, setActivePanner] = useState('3D');
  // panorama, floorPlan, 3D
  const [viewState, setViewState] = useState('panorama');
  const [activePackageId, setActivePackageId] = useState('071f30f1-3783-4231-9593-ca1c7602ec27');
  const [activeDomain, setActiveDomain] = useState('//vrhouse.oss-cn-shanghai.aliyuncs.com/');
  const [isChangingPanorama, setChangingPanorama] = useState(false);
  const [loadingDes, setLoadingDes] = useState('·');

  const onLoaded = () => {
    console.log('loaded');
  };

  useEffect(() => {
    const packageId = getUrlParameter('hid');
    const domain = getUrlParameter('domain');
    if (packageId && packageId !== activePackageId) {
      setActivePackageId(packageId);
    }
    if (domain && domain !== activeDomain) {
      setActiveDomain(domain);
    }
  }, []);

  const [viewDataModel, currentHotInfo, loadState, isFirstLoad, loadPercent] = useLoadHouse({
    mainContainer: vrContainerRef.current,
    setViewState,
    setActivePanner,
    setChangingPanorama,
    onLoaded,
    packageId: activePackageId,
    domain: activeDomain,
    houseInfo: new HouseInfo({
      packageId: activePackageId,
      domain: activeDomain,
      // defaultHotSpot: '8mtLFsyd',
      defaultRoom: '阳台',
    }),
  });

  useEffect(() => {
    setVrContainerRef({ ...vrContainerRef });
  }, []);

  useInterval({
    runningCallback: () => {
      if (loadingDes.length >= 3) {
        setLoadingDes('·');
      } else {
        setLoadingDes(`${loadingDes}·`);
      }
    },
    stopCallBack: () => {
      setLoadingDes('·');
    },
    delay: loadState === 'loadStart' ? 500 : null,
    immediately: false,
  });

  return (
    <ContainerSC>
      <VRContainerSC ref={vrContainerRef} />
      <GlobalLoading
        visible={loadState === 'loadStart'}
        url={`https://${activeDomain}${activePackageId}/CoverImage/Cover.jpg`}
        loadPercent={loadPercent}
      />
      <PanoramaContainerSC visible={viewState === 'panorama'}>
        <Panner3D
          viewState={viewState}
          activePanner={activePanner}
          onPannerChange={setActivePanner}
          positionSC={{
            position: 'absolute',
            top: '20px',
            left: '12px',
          }}
          hotSpotInfo={currentHotInfo}
        />
        <ToolBar
          activePackageId={activePackageId}
          positionSC={{
            position: 'absolute',
            right: '12px',
            top: '20px',
          }}
        />
        <BottomBar
          viewDataModel={viewDataModel}
          currentHotSpotId={currentHotInfo?.ID}
          isChangingPanorama={isChangingPanorama}
          nodeList={nodeList}
          onPackageChange={setActivePackageId}
          activePackageId={activePackageId}
          activeDomain={activeDomain}
        />
      </PanoramaContainerSC>
      <PanelChange3D
        visible={viewState !== 'panorama'}
        viewState={viewState}
        onChange={setViewState}
      />
    </ContainerSC>
  );
};

export default DecorationNode;
