import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const RegionPanel = ({
  regions,
  selectedShowRoomId,
  bookedShowRoomsId,
  onView,
}) => {
  const [openedRegion, setOpenedRegion] = useState(null);
  useEffect(() => {
    // console.log(regions);
  }, [regions]);

  const handleRegionClick = (region) => {
    if (region === openedRegion) {
      setOpenedRegion(null);
    } else {
      setOpenedRegion(region);
    }
  };

  const checkBooked = (_showRoomId) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const showRoomId of bookedShowRoomsId) {
      if (_showRoomId === showRoomId) return true;
    }
    return false;
  };

  return (
    <ContainerSC>
      <TitleSC>展位选择</TitleSC>
      <ContentSC>
        {
          regions && Object.values(regions).map((region) => (
            <RegionInfoContainerSC>
              <RegionInfoContentSC>
                <RegionInfoTitleSC
                  onClick={() => handleRegionClick(region)}
                  active={openedRegion === region}
                >
                  <span>{`${region.code} 展区`}</span>
                  <svg
                    className="icon"
                    viewBox="0 0 1024 1024"
                    width="12"
                    height="12"
                  >
                    <path
                      d="M547.59424 739.69664l383.76448-383.76448a35.82976 35.82976 0 1 0-50.67776-50.67776l-358.42048 358.42048-358.42048-358.42048a35.82976 35.82976 0 1 0-50.67776 50.67776l383.76448 383.76448c7.00416 7.00416 16.15872 10.496 25.344 10.496s18.31936-3.49184 25.32352-10.496z"
                      fill="#FFFFFF"
                    />
                  </svg>
                  {
                    openedRegion === region && <RegionInfoLineSC />
                  }
                </RegionInfoTitleSC>
                {
                  openedRegion === region && (
                    <RegionInfoSC>
                      {
                        Object.values(region.drawElements).map((showRoom) => (
                          <ShowRoomInfoSC
                            active={selectedShowRoomId === showRoom.id}
                            booked={checkBooked(showRoom.id)}
                          >
                            <span className="name">{showRoom.showRoomNameParams.name}</span>
                            <span
                              className="view"
                              onClick={() => {
                                if (checkBooked(showRoom.id)) return;
                                onView(showRoom.id);
                              }}
                            >
                              {
                                checkBooked(showRoom.id) ? '已被预定' : '查看'
                              }
                            </span>
                          </ShowRoomInfoSC>
                        ))
                      }
                    </RegionInfoSC>

                  )
                }
              </RegionInfoContentSC>
            </RegionInfoContainerSC>
          ))
        }
      </ContentSC>
    </ContainerSC>
  );
};

RegionPanel.propTypes = {
  regions: PropTypes.shape().isRequired,
  // eslint-disable-next-line react/require-default-props
  selectedShowRoomId: null || PropTypes.string.isRequired,
  bookedShowRoomsId: PropTypes.arrayOf.isRequired,
  onView: PropTypes.func.isRequired,
};

export default RegionPanel;

const ContainerSC = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(27, 34, 40, 0.8);
  border-radius: 4px;
  padding-bottom: 25px;
  overflow: hidden;
`;
const TitleSC = styled.div`
  width: 100%;
  padding: 13px 20px;
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #FFFFFF;
  background: rgba(34, 42, 58, 0.7);
  box-sizing: border-box;
`;

const ContentSC = styled.div`
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 8px;
  box-sizing: border-box;
`;

const RegionInfoContainerSC = styled.div`
  width: 100%;
  min-height: 38px;
  background: rgba(27, 34, 40, .7);
  border-radius: 4px;
  margin-top: 20px;
  box-sizing: border-box;
`;

const RegionInfoContentSC = styled.div`
  width: 100%;
  cursor: pointer;
`;

const RegionInfoTitleSC = styled('div', 'active')`
  width: 100%;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #FFFFFF;
  font-size: 12px;
  padding: 0 20px;
  box-sizing: border-box;
  position: relative;
  
  .icon {
    transform: rotate(${(props) => (props.active ? 180 : 0)}deg);
    transition: transform .2s;
  }
`;

const RegionInfoSC = styled.div`
  width: 100%;
  max-height: 198px;
  overflow: auto;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const RegionInfoLineSC = styled.div`
  position: absolute;
  bottom: 0;
  left: 20px;
  right: 20px;
  margin-left: auto;
  margin-right: auto;
  height: 1px;
  background: rgba(119, 119, 119, 1);
`;

const ShowRoomInfoSC = styled('div', 'active', 'booked')`
  width: 100%;
  height: 30px;
  box-sizing: border-box;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;

  .name {
    color: ${(props) => (props.booked ? 'rgba(204, 204, 204, 0.7)' : props.active ? 'rgba(0,161,252, 0.7)' : 'rgba(255, 255, 255, 0.7)')};
  }

  .view {
    width: 48px;
    height: 18px;
    border-radius: 2px;
    border: ${(props) => (props.booked ? 'none' : '1px solid rgba(0,161,252, 0.7)')};
    display: ${(props) => (props.booked ? 'flex' : 'none')};
    justify-content: center;
    align-items: center;
    color: ${(props) => (props.booked ? 'rgba(204, 204, 204, 0.7)' : 'rgba(0,161,252, 0.7)')};
    font-size: 10px;
  }

  :hover {
    background: rgba(62, 72, 91, 1);
  }

  :hover .view {
    display: flex;
  }
`;
