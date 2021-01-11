import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ContainerSC = styled('div')`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(34,34,34, .75);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 12vw;
  
  .coverImg {
    width: 24vh;
  }
  
  .word {
    margin-top: 20px;
    
    .wordCommon {
      margin: 10px 0;
      
      .label {
        font-weight: 600;
        color: white;
      }
      
      .content {
        font-size: 15px;
        font-weight: 500;
        color: #ccc;
      }
    }
  }
`;

const VrCover = ({
  onVrClose,
}) => (
  <ContainerSC id="vrStartTip" onClick={onVrClose}>
    {/* eslint-disable-next-line jsx-a11y/alt-text,global-require */}
    <img className="coverImg" src={require('../static/img/vrImage.png')} />
    <div className="word">
      <div className="wordCommon">
        <span className="label">开始：</span>
        <span className="content">将手机横屏放入VR眼镜中</span>
      </div>
      <div className="wordCommon">
        <span className="label">前进：</span>
        <span className="content">将视角中的圆圈对准房间名后即可前进观看</span>
      </div>
      <div className="wordCommon">
        <span className="label">结束：</span>
        <span className="content">手机竖屏状态，任意位置触屏即可退出</span>
      </div>
    </div>
  </ContainerSC>
);

VrCover.propTypes = {
  onVrClose: PropTypes.func,
};

VrCover.defaultProps = {
  onVrClose: () => { console.log('This is onVrClose callback'); },
};

export default VrCover;
