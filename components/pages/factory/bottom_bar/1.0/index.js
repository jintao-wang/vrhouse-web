import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import PropTypes from 'prop-types';
import { getUrlParameter, isMobile } from '../../../../../util/common';
import ThumbnailBar from '../../thumbnail_bar/1.0';
import Thumbnail from '../../../../../models/thumbnail';
import { GroupInfo, GroupMap } from '../../../../../solution_config/factory/data';
import ProjectGroupBar from '../../group_list_bar/1.0';
import MoreBar from '../../more_bar/1.0';

const fadeIn = keyframes`
  0% {
     transform: translateY(100px);
  }
  100% {
     transform: translateY(0);
  }
`;

const fadeOut = keyframes`
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(100px);
  }
`;

const borderInAni = keyframes`
  0% {
     border-radius: 6px;
  }
  5% {
     border-radius: 0 0 6px 6px;
  }
  100% {
     border-radius: 0 0 6px 6px;
  }
`;

const borderOutAni = keyframes`
  0% {
    border-radius: 0 0 6px 6px;
  }
  50% {
    border-radius: 0 0 6px 6px;
  }
  100% {
    border-radius: 6px;
  }
`;

const borderCss = (aniTrigger) => {
  if (aniTrigger) return css` ${borderInAni} .4s forwards`;
  return css` ${borderOutAni} .4s forwards`;
};

const fadeCss = (aniTrigger) => {
  if (aniTrigger) return css` ${fadeIn} .4s forwards`;
  return css` ${fadeOut} .4s forwards`;
};

const ContainerSC = styled('div', ['styleSC'])`
  position: fixed;
  left: 10px;
  right: 10px;
  bottom: 15px;
  margin: auto;
  
  @media(min-width: 726px) {
    left: 100px;
    right: 100px;
    max-width: 600px;
  }
`;

const TopContainerSC = styled('div')`
  width: 100%;
  position: relative;
`;

const MainMenuSC = styled('div', ['allRadius'])`
  width: 100%;
  height: 52px;
  border-radius: ${(props) => (props.allRadius ? '6px' : '0 0 6px 6px')};
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: rgba(0,0,0,.75);
  //animation: ${(props) => borderCss(props.aniTrigger)};
`;

const IconSC = styled('div', ['active', 'styleSC'])`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  color:${(props) => (props.active ? (props.styleSC.iconActiveColor || 'rgba(242, 170, 54)') : (props.styleSC.iconDefaultColor || 'rgb(255,255,255)'))};

  .icon {
    width: 25px;
    height: 25px;
    display: flex;
    justify-content: center;
    align-items: center;

    i {
      //font-size: ${isMobile ? '20px' : '22px'};
      font-size: 22px;
    }
  }

  .describe {
    // font-size:${isMobile ? '9px' : '11px'};
    font-size: 11px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
  }

`;

const BottomBar = ({
  styleSC,
  viewDataModel,
  currentHotSpotId,
  isChangingPanorama,
  group,
  loadState,
  onPackageChange,
  activePackage,
  onGroupChange,
  setSandTableState,
  viewState,
  onSceneChange,
}) => {
  const [thumbnailList, setThumbnailList] = useState([]);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  // visible prompt hidden
  const [thumbnailState, setThumbnailState] = useState('prompt');
  const [groupOneState, setGroupOneState] = useState(false);
  const [groupOneIndex, setGroupOneIndex] = useState(-1);
  const [moreState, setMoreState] = useState(false);
  const iconRef = useRef([]);
  const [iconPosition, setIconPosition] = useState([]);
  const [activeMenu, setActiveMenu] = useState(0);

  useEffect(() => {
    for(const [index, packageCurrent] of [...GroupMap.get(GroupInfo[0]), ...GroupMap.get(GroupInfo[1])].entries()) {
      if(packageCurrent === activePackage) {
        setGroupOneIndex(index);
      }
    }
  }, [activePackage]);

  useEffect(() => {
    if (viewState === 'panorama') {
      setActiveMenu(0);
    }
  }, [viewState]);

  useEffect(() => {
    if (!viewDataModel) return;
    // eslint-disable-next-line react/prop-types
    setThumbnailList(viewDataModel.HotSpots.map((hotSpot) => new Thumbnail(hotSpot)));
  }, [viewDataModel]);

  useEffect(() => {
    if (getUrlParameter('hid')) {
      const item = getPackage(getUrlParameter('hid'));
      onPackageChange(item);
    } else {
      setGroupOneIndex(0);
    }
    document.addEventListener('anchorNameClicked', (event) => {
      if (event.data.anchor && event.data.anchor.ResourceType === 'changeHouse' && event.data.anchor.Url) {
        const item = getPackage(event.data.anchor.Url);
        setSandTableState(false);
        if (activePackage !== item) {
          onPackageChange(item);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (!viewDataModel) return;
    // eslint-disable-next-line react/prop-types,no-plusplus
    for (let i = 0; i < viewDataModel.HotSpots.length; i++) {
      // eslint-disable-next-line react/prop-types
      if (viewDataModel.HotSpots[i].ID === currentHotSpotId) {
        setThumbnailIndex(i);
        return;
      }
    }
  }, [currentHotSpotId]);

  useEffect(() => {
    iconPosition[0] = iconRef.current[0].offsetLeft + iconRef.current[0].clientWidth / 2;
    iconPosition[2] = iconRef.current[2].offsetLeft + iconRef.current[2].clientWidth / 2;
    iconPosition[3] = iconRef.current[3].offsetLeft + iconRef.current[3].clientWidth / 2;
    setIconPosition([...iconPosition]);
  }, []);

  /**
   * package加载或切换后状态管理
   * * */
  useEffect(() => {
    if (loadState === 'loadEnd') {
      setGroupOneState(false);
      setThumbnailState('prompt');
    }
  }, [loadState]);

  const style = {
    top: '50px',
    ...styleSC,
  };

  const handlePackageChange = (item, index, callback) => {
    if (isChangingPanorama) return;
    checkGroup(item, index);
    setSandTableState(false);
    if (activePackage !== item) {
      onPackageChange(item);
      if (callback) callback();
    }
  };

  const handleThumbnail = (item, index, callback) => {
    if (isChangingPanorama) return;
    if (currentHotSpotId !== item.ID) {
      // eslint-disable-next-line no-undef
      HouseViewer.BaseAPI.onThumbnailClick(item.ID);
      if (callback) callback();
    }
  };

  const handleGroupOneClick = (state) => {
    setMoreState(false);
    setGroupOneState(state);
    if (activeMenu === 1) return;
    if (state) {
      setThumbnailState('hidden');
    } else {
      setThumbnailState('prompt');
    }
  };

  const handleGroupTwoClick = (state) => {
    setGroupOneState(false);
    setMoreState(false);
    if (activeMenu === 1) return;
    if (state) {
      setThumbnailState('hidden');
    } else {
      setThumbnailState('prompt');
    }
  };

  const handleMoreClick = (state) => {
    setGroupOneState(false);
    setMoreState(state);
    if (activeMenu === 1) return;
    if (state) {
      setThumbnailState('hidden');
    } else {
      setThumbnailState('prompt');
    }
  };

  const checkGroup = (item, activeIndex) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const key of GroupMap.keys()) {
      if (GroupMap.get(key).includes(item)) {
        if (key === GroupInfo[0]) {
          window.appConfig.panoramaLogoOpacity = 0;
          window.appConfig.isOutScene = true;
          setActiveMenu(0);
          setGroupOneIndex(activeIndex);
        } else if (key === GroupInfo[1]) {
          window.appConfig.panoramaLogoOpacity = 1;
          window.appConfig.isOutScene = false;
          setActiveMenu(0);
          setGroupOneIndex(-1);
        }
        onGroupChange(key);
        return;
      }
    }
  };

  const getPackage = (packageId) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const groupKey of GroupMap.keys()) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < GroupMap.get(groupKey).length; i++) {
        if (GroupMap.get(groupKey)[i].packageId === packageId) {
          if (groupKey === GroupInfo[0]) {
            window.appConfig.panoramaLogoOpacity = 0;
            window.appConfig.isOutScene = true;
            setActiveMenu(0);
            setGroupOneIndex(i);
          } else if (groupKey === GroupInfo[1]) {
            window.appConfig.panoramaLogoOpacity = 1;
            window.appConfig.isOutScene = false;
            setActiveMenu(2);
          }
          onGroupChange(groupKey);
          return GroupMap.get(groupKey)[i];
        }
      }
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const groupValue of GroupMap.values()) {
      if (groupValue[0]) return groupValue[0];
    }
    return null;
  };

  return (
    <ContainerSC>
      <TopContainerSC>
        <MoreBar
          visible={moreState}
          iconPosition={iconPosition[3]}
        />
        {/* groupOne */}
        <ProjectGroupBar
          visible={groupOneState}
          iconPosition={iconPosition[0]}
          groupList={[...GroupMap.get(GroupInfo[0]), ...GroupMap.get(GroupInfo[1])]}
          group={group}
          onChange={handlePackageChange}
          activeIndex={groupOneIndex}
        />
        <ThumbnailBar
          thumbnailState={thumbnailState}
          thumbnailList={thumbnailList}
          onChange={handleThumbnail}
          onDisplayChange={setThumbnailState}
          activeIndex={thumbnailIndex}
        />
      </TopContainerSC>
      <MainMenuSC allRadius={thumbnailState === 'hidden'}>
        <IconSC
          ref={(e) => iconRef.current[0] = e}
          styleSC={style}
          onClick={() => handleGroupOneClick(!groupOneState)}
          active={activeMenu === 0}
        >
          <div>
            <i className="icon-projectView" />
          </div>
          <div className="describe">生产基地</div>
        </IconSC>
        <IconSC
          styleSC={style}
          active={activeMenu === 1}
          onClick={() => {
            HouseViewer.BaseAPI.switchTo3DLargeView();
            setGroupOneState(false);
            setMoreState(false);
            setThumbnailState('hidden');
            // setActiveMenu(1);
            setSandTableState(true);
          }}
        >
          <div>
            <i className="icon-projectModel" />
          </div>
          <div className="describe">全球分布</div>
        </IconSC>
        <IconSC
          ref={(e) => iconRef.current[2] = e}
          styleSC={style}
          active={activeMenu === 2}
          onClick={() => {
            HouseViewer.BaseAPI.switchTo3DLargeView();
            onSceneChange();
          }}
        >
          <div>
            <i className="icon-sampleRoom" />
          </div>
          <div className="describe">场景规划</div>
        </IconSC>
        <IconSC
          ref={(e) => iconRef.current[3] = e}
          styleSC={style}
          active={activeMenu === 3}
          onClick={() => handleMoreClick(!moreState)}
        >
          <div>
            <i className="icon-more" />
          </div>
          <div className="describe">更多</div>
        </IconSC>
      </MainMenuSC>
    </ContainerSC>
  );
};

BottomBar.propTypes = {
  styleSC: PropTypes.shape({
    top: PropTypes.string,
  }),
  viewDataModel: PropTypes.shape({}),
  isChangingPanorama: PropTypes.bool.isRequired,
  currentHotSpotId: PropTypes.string || null,
  group: PropTypes.shape({}),
  onGroupChange: PropTypes.func,
  loadState: PropTypes.string,
  onPackageChange: PropTypes.func,
  activePackage: PropTypes.shape({}),
  setSandTableState: PropTypes.func,
  viewState: PropTypes.string,
  onSceneChange: PropTypes.func,
};

BottomBar.defaultProps = {
  styleSC: {},
  viewDataModel: {},
  currentHotSpotId: null,
  group: {},
  loadState: 'loadEnd',
  onPackageChange: () => {},
  activePackage: {},
  onGroupChange: () => {},
  setSandTableState: () => {},
  viewState: 'panorama',
  onSceneChange: () => {},
};

export default BottomBar;
