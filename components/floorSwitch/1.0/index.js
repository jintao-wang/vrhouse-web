import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import ColumnScroll from '../../column_scroll/2.0';
import { ColorTheme } from '../../../customers/wuhanMax/config';

const ContainerSC = styled('div')`
  margin-bottom: 20px;
  height: 140px;
  width: 40px;
  background-color: rgba(0,0,0,.3);
  border-radius: 4px;
`;

const ResultItemSC = styled('div', ['active'])`
  font-size: 14px;
  padding: 10px 5px;
  cursor: pointer;
  color: ${(props) => (props.active ? ColorTheme() : '#fff')};
  border-radius: 2px;
  letter-spacing: 2px;
  font-weight: ${(props) => (props.active ? 500 : 400)};
  text-align: center;
  
  
  // :hover {
  //   background:  ${(props) => (props.active ? ColorTheme() : 'rgb(240, 240, 240)')};
  // }
`;

const FloorSwitch = ({
  viewDataModel,
  currentHotSpotId,
}) => {
  const [floors, setFloors] = useState([]);
  const [currentFloor, setCurrentFloor] = useState(null);

  useEffect(() => {
    setFloors([...viewDataModel.Floors]);
  }, [viewDataModel]);

  useEffect(() => {
    setTimeout(() => {
      const _currentFloor = getCurrentFloor();
      setCurrentFloor(_currentFloor);
    })
  }, [currentHotSpotId]);

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
      // HouseViewer.BaseAPI.changeFloor({
      //   id: floor.ID,
      //   name: floor.Name,
      // });
      HouseViewer.BaseAPI.onThumbnailClick(floor.Rooms[0].HotSpotIds[0]);
    } else {
      HouseViewer.BaseAPI.changeFloor(false);
    }
  };

  const ScrollItemRender = ({ item, active }) => (
    <ResultItemSC
      active={active}
    >
      {item.Name}
    </ResultItemSC>
  );

  return (
    <ContainerSC>
      <ColumnScroll
        scrollList={floors}
        activeItem={currentFloor}
        onChange={handleScrollChange}
      >
        <ScrollItemRender />
      </ColumnScroll>
    </ContainerSC>
  );
};

export default FloorSwitch;
