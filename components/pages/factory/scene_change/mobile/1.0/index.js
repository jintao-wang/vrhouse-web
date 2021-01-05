import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { ColorTheme } from '../../../../../../styles/factory/common';
import { HotSpotInfoMap } from '../../../../../../solution_config/factory/data';
import RowScroll from '../../../../../common/rowScroll/3.0';
import Title from '../../../../../common/title/2.0';

const ContainerSC = styled('div', ['styleSC'])`
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  position: fixed;
  background: rgb(68, 68, 68);
`;

const VrContainerParentSC = styled('div')`
  width: 100%;
  height: 80%;
  position: relative;
`;

const VrContainerSC = styled('div')`
  width: 100%;
  height: 100%;
`;

const EnterSC = styled('div')`
  position: absolute;
  bottom: 20px;
  right: 15px;
  display: flex;
  align-items: center;
  
  .icon {
    height: 13px;
    margin-right: 4px;
  }
  
  .word {
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
  }
`;

const PanelSC = styled('div')`
  width: 100%;
  height: 20%;
  background: rgb(245, 245, 245);
  border-radius: 16px 16px 0 0;
  display: flex;
  flex-direction: column;
`;

const ChooseSC = styled('div')`
  width: 100%;
  height: 60px;
`;

const ChooseItemSC = styled('div', ['active'])`
  padding: 8px 10px;
  background: ${(props) => (props.active ? ColorTheme() : '#EEEEEE')};
  border-radius: 20px;
  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: ${(props) => (props.active ? '#ffffff' : '#666666')};
`;

const IntroductionSC = styled('div')`
  width: 100%;
  flex: 1;
  padding: 0 20px;
  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
`;

const SceneChangeMobile = ({
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
    <ChooseItemSC
      active={active}
    >
      {item.Name}
    </ChooseItemSC>
  );

  const getIntroduction = () => {
    if (currentFloor) {
      return HotSpotInfoMap[currentFloor.ID].introduction;
    }
    return '';
  };

  return (
    <ContainerSC>
      <VrContainerParentSC>
        <Title
          iconDisplay={false}
          titleName="场地规划"
          styleSC={{
            top: '20px',
            background: 'none',
          }}
        />
        <EnterSC onClick={() => {
          HouseViewer.BaseAPI.onThumbnailClick(currentFloor.Rooms[0].HotSpotIds[0]);
        }}
        >
          <img className="icon" src={require('../../static/img/enter.svg')} alt="" />
          <span className="word">进入当前区域</span>
        </EnterSC>
        <VrContainerSC ref={packageDisplayRef} />
      </VrContainerParentSC>
      <PanelSC>
        <ChooseSC>
          <RowScroll
            scrollList={floors}
            activeItem={currentFloor}
            onChange={handleScrollChange}
            liMargin={11}
          >
            <ScrollItemRender />
          </RowScroll>
        </ChooseSC>
        <IntroductionSC>
          {getIntroduction()}
        </IntroductionSC>
      </PanelSC>
    </ContainerSC>
  );
};

SceneChangeMobile.propTypes = {
  vrDom: PropTypes.node,
  viewDataModel: PropTypes.shape({}),
  currentHotSpotId: PropTypes.string,
  viewState: PropTypes.string,
  visible: PropTypes.bool,
};

SceneChangeMobile.defaultProps = {
  vrDom: <div />,
  viewDataModel: {},
  currentHotSpotId: '',
  viewState: '',
  visible: false,
};

export default SceneChangeMobile;
