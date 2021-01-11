import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ContainerSC = styled('div', ['visible'])`
   display: ${(props) => !props.visible && 'none'}
`;

const ButtonContainerSC = styled('div')`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 20px;
  margin: auto;
  pointer-events: none;
  text-align: center;
`;

const ButtonGroupSC = styled('div')`
  height: 38px;
  background: #222;
  pointer-events: auto;
  display: inline-flex;
  border-radius: 4px;
  position: relative;
 
`;

const ButtonActiveSC = styled('div', ['is3D'])`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 80px;
  background: #666666;
  left: ${(props) => (props.is3D ? '100px' : '0')};
  z-index: 0;
  border-radius: 4px;
  padding: 0 10px;
  transition: left .5s;
`;

const ButtonSC = styled('div', ['active'])`
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  color: ${(props) => (props.active ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.5)')};
  border-radius: 4px;
  z-index: 1;
  padding: 0 10px;
  font-size: 14px;
`;

const PanelChange3D = ({
  styleSC,
  visible,
  onChange,
  viewState,
}) => {
  const style = {
    ...styleSC,
  };
  return (
    <ContainerSC visible={visible}>
      <ButtonContainerSC>
        <ButtonGroupSC>
          <ButtonActiveSC is3D={viewState === '3D'} />
          <ButtonSC
            onClick={() => {
              // eslint-disable-next-line no-undef
              HouseViewer.BaseAPI.switchTo2DLargeView();
              onChange('floorPlan');
            }}
            active={viewState === 'floorPlan'}
          >
            <i className="icon-floor-plan-panel" />
            <span>
              户型图
            </span>
          </ButtonSC>
          <ButtonSC
            onClick={() => {
              // eslint-disable-next-line no-undef
              HouseViewer.BaseAPI.switchTo3DLargeView();
              onChange('3D');
            }}
            active={viewState === '3D'}
          >
            <i className="icon-3d-panel" />
            <span>
              3D模型
            </span>
          </ButtonSC>
        </ButtonGroupSC>
      </ButtonContainerSC>
    </ContainerSC>
  );
};

PanelChange3D.propTypes = {
  styleSC: PropTypes.shape({
  }),
  visible: PropTypes.bool,
  onChange: PropTypes.func,
  viewState: PropTypes.string,
};

PanelChange3D.defaultProps = {
  styleSC: {},
  visible: true,
  onChange: () => {},
  viewState: '3D',
};

export default PanelChange3D;
