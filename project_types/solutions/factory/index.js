import React, { useState, useRef, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import Title from '../../../components/title/1.0';
import BottomBar from './components/bottom_bar/1.0';
import useLoadHouse from '../../../hooks/load_house/2.0/useLoadHouse';
import HouseInfo from '../../../models/houseInfo';
import GlobalLoading from '../../../components/global_loading/1.0';
import Panner3D from '../../../components/pannel_3d/1.0';
import PanelChange3D from '../../../components/panel_change_3D/1.0';
import ToolBar from './components/tool_bar/1.0';
import {
  ColorTheme,
  GroupMap,
  GroupInfo,
  Slide3DInfo,
} from './config';
import Slide3D from '../../../components/slide_3d/1.0';
import Animation from '../../../components/animation/2.0';
import VrCover from '../../../components/vr_cover/1.0';
import EarthTable from '../../../components/earth_table/1.0';
import RShow from '../../../components/r_show/1.0';
import RLazyShow from '../../../components/r_lazy_show/1.0';
import SceneChange from './components/scene_change/1.0';

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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
`;

const VRContainerParentSC = styled('div')`
  width: 100%;
  height: 100%;
`;

const VRContainerSC = styled('div')`
  width: 100%;
  height: 100%;
  
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

const Factory = () => {
  const vrContainerParentSC = useRef(null);
  const [vrContainerRef, setVrContainerRef] = useState(useRef(null));
  const [activePanner, setActivePanner] = useState('3D');
  // panorama, floorPlan, 3D,
  const [viewState, setViewState] = useState('panorama');
  const [activeGroup, setActiveGroup] = useState(GroupInfo[0]);
  const [activePackage, setActivePackage] = useState(GroupMap.get(GroupInfo[0])[0]);
  const [isChangingPanorama, setChangingPanorama] = useState(false);
  const [sandTableState, setSandTableState] = useState(false);
  const [isSceneChange, setSceneChange] = useState(false);
  const [isSlide3D, setSlide3D] = useState(false);
  const [isFocus, setFocus] = useState(false);

  const onLoad = () => {
    console.log('start loaded');
  };

  const onLoaded = () => {
    console.log('on loaded');
  };

  const [viewDataModel, currentHotId, loadState, isFirstLoad, loadPercent] = useLoadHouse({
    container: vrContainerParentSC.current,
    mainContainer: vrContainerRef.current,
    is3DViewAtStart: sandTableState,
    setViewState,
    setActivePanner,
    setChangingPanorama,
    onLoad,
    onLoaded,
    houseInfo: new HouseInfo({
      packageId: activePackage.packageId,
      domain: activePackage.domain || activeGroup.defaultDomain,
      // defaultHotSpot: '8mtLFsyd',
      defaultRoom: '阳台',
    }),
    switch3DToPanoramaCallback: () => {
      setSandTableState(false);
      setSceneChange(false);
    },
  });

  useEffect(() => {
    const keyCodeMap = {
      // 91: true, // command
      61: true,
      107: true, // 数字键盘 +
      109: true, // 数字键盘 -
      173: true, // 火狐 - 号
      187: true, // +
      189: true, // -
    };
    // 覆盖ctrl||command + ‘+’/‘-’
    document.onkeydown = function (event) {
      const e = event || window.event;
      const ctrlKey = e.ctrlKey || e.metaKey;
      if (ctrlKey && keyCodeMap[e.keyCode]) {
        e.preventDefault();
      } else if (e.detail) { // Firefox
        event.returnValue = false;
      }
    };
    // 覆盖鼠标滑动
    document.body.addEventListener('wheel', (e) => {
      if (e.ctrlKey) {
        if (e.deltaY < 0) {
          e.preventDefault();
          return false;
        }
        if (e.deltaY > 0) {
          e.preventDefault();
          return false;
        }
      }
    }, { passive: false });

    document.addEventListener('gesturestart', (e) => {
      e.preventDefault();
    });
  }, []);

  useEffect(() => {
    setVrContainerRef({ ...vrContainerRef });
  }, []);

  const handleTitleChange = (bool) => {
    setSlide3D(bool);
  };

  return (
    <ContainerSC>
      <VRContainerParentSC ref={vrContainerParentSC}>
        <VRContainerSC ref={vrContainerRef} />
      </VRContainerParentSC>
      <RLazyShow
        visible={sandTableState}
        onload={loadPercent === 100}
      >
        <EarthTable
          activePackage={activePackage}
          activeGroup={activeGroup}
          groupMap={GroupMap}
          vrDom={vrContainerRef.current}
          onPackageChange={setActivePackage}
          loadState={loadState}
          visible={sandTableState}
        />
      </RLazyShow>
      <RLazyShow
        visible={isSceneChange}
        onload={loadPercent === 100}
      >
        <SceneChange
          viewDataModel={viewDataModel}
          vrDom={vrContainerRef.current}
          currentHotSpotId={currentHotId}
          viewState={viewState}
          visible={isSceneChange}
        />
      </RLazyShow>
      <GlobalLoading
        visible={loadState === 'loadStart' && !sandTableState}
        url={`https://${activePackage.domain || activeGroup.defaultDomain}${activePackage.packageId}/CoverImage/Cover.jpg`}
        loadPercent={loadPercent}
      />
      {
        isFocus && (
        <VrCover
          onVrClose={
            () => {
              HouseViewer.BaseAPI.toggleVR(false);
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
          !sandTableState && !isSceneChange && activeGroup.defaultPanelShow && !isSlide3D && (
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
              colorTheme={ColorTheme()}
            />
          )
        }
        {
          !sandTableState && !isSceneChange && (
            <>
              <Title
                onChange={handleTitleChange}
                titleName="工厂信息"
              />
              <Animation visible={isSlide3D}>
                <Slide3DSC>
                  <Slide3D slideList={Slide3DInfo} />
                </Slide3DSC>
              </Animation>
            </>
          )
        }
        {
          !isSlide3D && !sandTableState && !isSceneChange && (
            <ToolBar
              positionSC={{
                position: 'absolute',
                right: '12px',
                top: '38px',
              }}
              colorTheme={ColorTheme()}
              houseInfo={{
                packageId: activePackage.packageId,
                domain: activePackage.domain || activeGroup.defaultDomain,
              }}
              activePackage={activePackage}
              onVrOpen={() => {
                HouseViewer.BaseAPI.toggleVR(true);
                setFocus(true);
              }}
            />
          )
        }
        <RShow visible={!isSceneChange}>
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
            onSceneChange={() => setSceneChange(true)}
            viewState={viewState}
          />
        </RShow>
      </PanoramaContainerSC>
      <PanelChange3D
        visible={viewState !== 'panorama' && !sandTableState && !isSceneChange}
        viewState={viewState}
        onChange={setViewState}
      />
    </ContainerSC>
  );
};

export default Factory;
