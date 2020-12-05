import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ContainerSC = styled('div', ['styleSC', 'positionSC', 'visible'])`
  width: 98px;
  border-radius: 4px;
  ${(props) => props.positionSC};
  overflow: hidden;
  display: ${(props) => (!props.visible && 'none')};
  
  .title {
    font-size: 10px;
    height: 16px;
    color: #FFFFFF;
    text-align: center;
    padding: 4px 3px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background: rgba(0,0,0,.3);
  }
  
  .small-view-content {
    width: 100%;
    height: 85px;
    pointer-events: auto;
    cursor: pointer;
    background: rgba(0,0,0,.18);
    
    @media(min-width: 1026px) {
      height: 105px;
    }
  }
  
  .panner {
    width: 100%;
    display: flex;
    justify-content: space-around;
    font-size: 10px;
    color: #FFFFFF;
    padding: 6px 0;
    background: rgba(0,0,0,.3);
  }
`;

const PannerSC = styled('div', ['active', 'colorTheme'])`
  color: ${(props) => (props.active ? props.colorTheme : '#FFFFFF')};
  font-weight: ${(props) => (props.active ? 600 : 400)};
`;

const Panner3D = ({
  styleSC,
  positionSC,
  hotSpotInfo,
  activePanner,
  onPannerChange,
  viewState,
  onChange,
  colorTheme,
}) => {
  const style = {
    ...styleSC,
  };
  const handleSwitch = (type) => {
    onPannerChange(type);
    // eslint-disable-next-line no-undef,no-unused-expressions
    type === '3D' ? HouseViewer.BaseAPI.switchTo3DSmallView() : HouseViewer.BaseAPI.switchTo2DSmallView();
  };

  const infoDisplay = () => {
    if (hotSpotInfo && hotSpotInfo.Area) {
      return `${hotSpotInfo.Name}：${hotSpotInfo.Area.toFixed(1)}m²`;
    }
    if (hotSpotInfo) {
      return `${hotSpotInfo.Name}`;
    }
    return '';
  };

  const switchToLargeView = () => {
    onChange();
    // eslint-disable-next-line no-undef,no-unused-expressions
    activePanner === '3D' ? HouseViewer.BaseAPI.switchTo3DLargeView() : HouseViewer.BaseAPI.switchTo2DLargeView();
  };

  return (
    <ContainerSC
      styleSC={style}
      positionSC={positionSC}
      visible={viewState === 'panorama'}
    >
      <div className="title">
        {infoDisplay()}
      </div>
      {/* eslint-disable-next-line max-len */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div
        id="small-view-content"
        className="small-view-content"
        onClick={switchToLargeView}
      />
      <div className="panner">
        <PannerSC
          active={activePanner === '2D'}
          onClick={() => handleSwitch('2D')}
          colorTheme={colorTheme}
        >
          户型图
        </PannerSC>
        <PannerSC
          active={activePanner === '3D'}
          onClick={() => handleSwitch('3D')}
          colorTheme={colorTheme}
        >
          3D模型
        </PannerSC>
      </div>
    </ContainerSC>
  );
};

Panner3D.propTypes = {
  positionSC: PropTypes.shape({}),
  styleSC: PropTypes.shape({}),
  hotSpotInfo: PropTypes.shape({}) || null,
  activePanner: PropTypes.string,
  viewState: PropTypes.string,
  onChange: PropTypes.func,
  onPannerChange: PropTypes.func,
  colorTheme: PropTypes.string,
};

Panner3D.defaultProps = {
  positionSC: {
    position: 'fixed',
    top: '20px',
    right: '12px',
  },
  styleSC: {},
  hotSpotInfo: {},
  activePanner: '3D',
  viewState: 'panorama',
  colorTheme: 'rgba(54,217,136,1)',
  onChange: () => { console.log('view state change callback'); },
  onPannerChange: () => { console.log('panner state change callback'); },
};

export default Panner3D;
