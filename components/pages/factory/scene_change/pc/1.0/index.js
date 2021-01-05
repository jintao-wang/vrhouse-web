import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { ColorTheme } from '../../../../../../styles/factory/common';
import ColumnScroll from '../../../../../common/column_scroll/2.0';
import { HotSpotInfoMap } from '../../../../../../solution_config/factory/data';

const ContainerSC = styled('div', ['styleSC'])`
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  position: fixed;
  display: flex;
`;

const PanelSC = styled('div')`
  width: 20%;
  max-width: 480px;
  min-width: 300px;
  height: 100%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  background: rgb(245, 245, 245);
`;

const SearchContainerSC = styled('div')`
  width: 100%;
  background: rgb(255,255,255);
  border-bottom: 1px solid #E8EAED;
  font-size: 15px;
  padding: 10px 12px 16px 12px;
  box-sizing: border-box;
`;

const SearchContentSC = styled('div')`
  width: 100%;
  height: 225px;
  background: rgb(255,255,255);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const SearchBoxSC = styled('div')`
  width: 100%;
  height: 48px;
  box-sizing: border-box;
  border-bottom: 1px solid #DADCE0;
  padding: 5px 0px;
  color: rgba(0, 0, 0, 0.87);
  font-weight: 600;
  font-size: 16px;
`;

const ResultsSC = styled('div')`
  padding: 8px 0;
  height: 177px;
`;

const ResultItemSC = styled('div', ['active'])`
  font-size: 14px;
  padding: 10px 5px;
  cursor: pointer;
  background: ${(props) => (props.active ? ColorTheme() : 'unset')};
  color: ${(props) => (props.active ? '#fff' : 'rgba(0,0,0,0.85)')};
  border-radius: 4px;
  letter-spacing: 2px;
  font-weight: ${(props) => (props.active ? 600 : 500)};
  
  
  :hover {
    background:  ${(props) => (props.active ? ColorTheme() : 'rgb(240, 240, 240)')};
  }
`;

const IntroductionSC = styled('div')`
  width: 100%;
  min-height: 180px;
  margin-top: 40px;
  background: rgb(255,255,255);
  border-bottom: 1px solid #E8EAED;
  border-top: 1px solid #E8EAED;
  padding: 0 12px;
  box-sizing: border-box;
`;

const IntroductionTitleSC = styled('div')`
  width: 100%;
  padding: 15px 0;
  color: rgba(0, 0, 0, 0.87);
  font-weight: 600;
  font-size: 16px;
  border-bottom: 1px solid #E8EAED;
`;

const IntroductionContentSC = styled('div')`
  width: 100%;
  padding: 20px 0;
  font-size: 15px;
  color: #333;
`;

const NoInfoSC = styled('div')`
  width: 100%;
  height: 60px;
  margin-top: 40px;
  background: rgb(255,255,255);
  border-bottom: 1px solid #E8EAED;
  border-top: 1px solid #E8EAED;
  display: flex;
  align-items: center;
  padding-left: 20px;
  color: rgba(0, 0, 0, 0.54);
  font-size: 13px;
`;

const VrContainerSC = styled('div')`
  flex: 1;
  background: rgb(68, 68, 68);
`;

const SceneChangePC = ({
  vrDom,
  viewDataModel,
  currentHotSpotId,
  viewState,
  visible,
}) => {
  const packageDisplayRef = useRef(null);
  const [currentFloor, setCurrentFloor] = useState(null);
  const [floors, setFloors] = useState([]);

  useEffect(() => {
    if (visible) {
      setFloors([...viewDataModel.Floors]);
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const _currentFloor = getCurrentFloor();
    setCurrentFloor(_currentFloor);
    HouseViewer.BaseAPI.changeFloor({
      id: _currentFloor.ID,
      name: _currentFloor.Name,
    });
  }, [visible]);

  useEffect(() => {
    if (visible) {
      packageDisplayRef.current.append(vrDom);
    }
  }, [visible]);

  const getCurrentFloor = () => {
    // eslint-disable-next-line react/prop-types,no-shadow,array-callback-return,max-len
    const floor = viewDataModel?.Floors.find((floor) => floor.Rooms.find((room) => room.HotSpotIds.find((id) => id === currentHotSpotId)));
    return floor;
  };

  const handleScrollChange = (item) => {
    selectFloor(item);
  };

  const selectFloor = (floor) => {
    setCurrentFloor(floor);
    onFloorSwitch(floor);
  };

  const onFloorSwitch = (floor) => {
    if (floor) {
      HouseViewer.BaseAPI.changeFloor({
        id: floor.ID,
        name: floor.Name,
      });
    } else {
      HouseViewer.BaseAPI.changeFloor(false);
    }
  };

  // eslint-disable-next-line react/prop-types
  const ScrollItemRender = ({ item, active }) => (
    <ResultItemSC
      active={active}
    >
      {item.Name}
    </ResultItemSC>
  );

  const getIntroduction = () => {
    if (currentFloor) {
      return HotSpotInfoMap[currentFloor.ID].introduction;
    }
    return '';
  };

  return (
    <ContainerSC>
      <PanelSC>
        <SearchContainerSC>
          <SearchContentSC>
            <SearchBoxSC>
              场景选择
            </SearchBoxSC>
            <ResultsSC>
              <ColumnScroll
                scrollList={floors}
                activeItem={currentFloor}
                onChange={handleScrollChange}
              >
                <ScrollItemRender />
              </ColumnScroll>
            </ResultsSC>
          </SearchContentSC>
        </SearchContainerSC>
        <IntroductionSC>
          <IntroductionTitleSC>{`${currentFloor?.Name} - 介绍` }</IntroductionTitleSC>
          <IntroductionContentSC>
            {getIntroduction()}
          </IntroductionContentSC>
        </IntroductionSC>
        <NoInfoSC>
          <i>没有可供显示的更多信息</i>
        </NoInfoSC>
      </PanelSC>
      <VrContainerSC ref={packageDisplayRef} />
    </ContainerSC>
  );
};

SceneChangePC.propTypes = {
  vrDom: PropTypes.node,
  viewDataModel: PropTypes.shape({}),
  currentHotSpotId: PropTypes.string,
  viewState: PropTypes.string,
  visible: PropTypes.bool,
};

SceneChangePC.defaultProps = {
  vrDom: <div />,
  viewDataModel: {},
  currentHotSpotId: '',
  viewState: '',
  visible: false,
};

export default SceneChangePC;
