import React, { useState, useRef, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import Title from '../../common/title/1.0';
import BottomBar from './bottom_bar/1.0';
import useLoadHouse from '../../../hooks/load_house/2.0/useLoadHouse';
import HouseInfo from '../../../models/houseInfo';
import GlobalLoading from '../../common/global_loading/1.0';
import Panner3D from '../../common/pannel_3d/1.0';
import PanelChange3D from '../../common/panel_change_3D/1.0';
import ToolBar from './tool_bar/1.0';
import { ColorTheme } from '../../../styles/sales-office-icon/common';
import { GroupMap, GroupInfo, RecommendList } from '../../../solution_config/sales_office/data';
import Slide3D from '../../common/slide_3d/1.0';
import Animation from '../../common/animation/2.0';
import VrCover from '../../common/vr_cover/1.0';

const opacityFadeIn = keyframes`
  0% {
     opacity: 0;
  }
  100% {
     opacity: 1;
  }
`;

const opacityFadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const opacityFadeCss = (aniTrigger) => {
  if (aniTrigger) return css` ${opacityFadeIn} .2s forwards`;
  return css` ${opacityFadeOut} .2s forwards`;
};

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

const Slide3DSC = styled('div', ['aniTrigger'])`
  animation: ${(props) => opacityFadeCss(props.aniTrigger)};
`;

const SalesOffice = () => {
  const [loadAvailable, setLoadAvailable] = useState(false);
  const [activePanner, setActivePanner] = useState('3D');
  // panorama, floorPlan, 3D,
  const [viewState, setViewState] = useState('panorama');
  const [activeGroup, setActiveGroup] = useState(GroupInfo[0]);
  const [activePackage, setActivePackage] = useState(GroupMap.get(GroupInfo[0])[0]);
  const [isChangingPanorama, setChangingPanorama] = useState(false);
  const [sandTableState, setSandTableState] = useState(false);
  const [isSlide3D, setSlide3D] = useState(false);
  const [isFocus, setFocus] = useState(false);
  const vrContainerRef = useRef(null);

  const onLoad = () => {
    console.log('start loaded');
  };

  const onLoaded = () => {
    console.log('on loaded');
    // eslint-disable-next-line no-unused-expressions
  };

  const [viewDataModel, currentHotId, loadState, isFirstLoad, loadPercent] = useLoadHouse({
    loadAvailable,
    mainContainer: vrContainerRef.current,
    setViewState,
    setActivePanner,
    setChangingPanorama,
    onLoad,
    onLoaded,
    houseInfo: new HouseInfo({
      packageId: activePackage.packageId,
      domain: activePackage.domain || activeGroup.defaultDomain,
      // defaultHotSpot: '8mtLFsyd',
      // defaultRoom: '阳台',
    }),
    wxShareInfo: {
      title: '欧美金融城EFC T6',
      desc: 'Foster+Partners，Benoy，Genslen联合打造',
      imgUrl: 'https://vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/customer/EFC/static/weixinshare.jpeg',
    },
  });

  useEffect(() => {
    setLoadAvailable(true);
  }, []);

  const handleTitleChange = (bool) => {
    setSlide3D(bool);
  };

  return (
    <ContainerSC>
      <VRContainerSC ref={vrContainerRef} />
      {/* <SandTable */}
      {/*  visible={sandTableState} */}
      {/*  recommendList={RecommendList} */}
      {/* /> */}
      <GlobalLoading
        visible={loadState === 'loadStart'}
        url={`https://${activePackage.domain || activeGroup.defaultDomain}${activePackage.packageId}/CoverImage/Cover.jpg`}
        loadPercent={loadPercent}
      />
      {
        isFocus && (
        <VrCover
          onVrClose={
            () => {
              // eslint-disable-next-line no-undef
              HouseViewer.BaseAPI.toggleVR(false);
              // eslint-disable-next-line no-undef
              HouseViewer.BaseAPI.app.floorPlanManager.object3D.visible = false;
              setFocus(false);
            }
          }
        />
        )
      }
      {/* <CompassSC id="compassContainer" /> */}
      <PanoramaContainerSC visible={viewState === 'panorama' && !isFocus}>
        {
          !sandTableState && activeGroup.defaultPanelShow && !isSlide3D && (
            <Panner3D
              viewState={viewState}
              activePanner={activePanner}
              onPannerChange={setActivePanner}
              positionSC={{
                position: 'absolute',
                top: '30px',
                left: '12px',
              }}
              hotSpotInfo={viewDataModel?.getRoomByHotSpotId(currentHotId)}
              colorTheme={ColorTheme}
            />
          )
        }
        {
          !sandTableState && (
            <>
              <Title
                titleName="欧美金融城 EFC"
                onChange={handleTitleChange}
              />
              <Animation visible={isSlide3D}>
                <Slide3DSC>
                  <Slide3D />
                </Slide3DSC>
              </Animation>
            </>
          )
        }
        <ToolBar
          visible={!isSlide3D && !sandTableState}
          positionSC={{
            position: 'absolute',
            right: '12px',
            top: '38px',
          }}
          colorTheme={ColorTheme}
          houseInfo={{
            packageId: activePackage.packageId,
            domain: activePackage.domain || activeGroup.defaultDomain,
          }}
          activePackage={activePackage}
          onVrOpen={() => {
            // eslint-disable-next-line no-undef
            HouseViewer.BaseAPI.toggleVR(true);
            setFocus(true);
          }}
        />
        <BottomBar
          isChangingPanorama={isChangingPanorama}
          currentHotSpotId={currentHotId}
          viewDataModel={viewDataModel}
          group={activeGroup}
          loadState={loadState}
          onPackageChange={setActivePackage}
          activePackage={activePackage}
          onGroupChange={setActiveGroup}
          setSandTableState={setSandTableState}
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

export default SalesOffice;
