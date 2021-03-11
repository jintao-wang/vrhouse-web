import React, { useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ShowRoomPanel = ({
  showRoomPanelInfo,
  booked,
  onBook,
}) => {
  useEffect(() => {}, []);
  return (
    <ContainerSC>
      <TitleSC>展位信息</TitleSC>
      <InfoSC>
        <LineSC>
          <span>展区：</span>
          <input className="region" readOnly value={showRoomPanelInfo.code} />
        </LineSC>
        <LineSC>
          <span>展位号：</span>
          <input className="number" readOnly value={showRoomPanelInfo.number} />
        </LineSC>
        <LineSC>
          <span>尺寸：</span>
          <div className="size">
            <input readOnly value={showRoomPanelInfo.size[0] || ''} />
            <input readOnly value={showRoomPanelInfo.size[1] || ''} />
            <input readOnly value={showRoomPanelInfo.size[2] || ''} />
          </div>
        </LineSC>
        <LineSC>
          <span>面积：</span>
          <div className="area">
            <input readOnly value={showRoomPanelInfo.area || ''} />
            <span>㎡</span>
          </div>
        </LineSC>
        <LineSC>
          <span>价格：</span>
          <div className="price">
            <input readOnly value={showRoomPanelInfo.price || ''} />
            <span>元</span>
          </div>
        </LineSC>
      </InfoSC>
      <BookingSC onClick={() => { !booked && onBook(); }} active={!booked}>
        {booked ? '已被预定' : '预定'}
      </BookingSC>
    </ContainerSC>
  );
};

ShowRoomPanel.propTypes = {
  showRoomPanelInfo: PropTypes.shape({
    code: PropTypes.string,
    number: PropTypes.number,
    size: PropTypes.arrayOf(),
    area: PropTypes.number,
    price: PropTypes.number,
  }).isRequired,
};

export default ShowRoomPanel;

const ContainerSC = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(27, 34, 40, 0.8);
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  padding-bottom: 18px;
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
const InfoSC = styled.div`
  width: 100%;
`;
const LineSC = styled.div`
  width: 100%;
  padding: 15px 20px 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  color: #FFFFFF;
  
  .region,.number {
    width: 80px;
    height: 25px;
    border-radius: 2px;
    background: rgba(34, 42, 58, 0.7);
    outline: none;
    border: none;
    text-align: center;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #FFFFFF;
  }
  
  .size {
    display: flex;
    input {
      margin-left: 10px;
      width: 35px;
      height: 25px;
      border-radius: 2px;
      background: rgba(34, 42, 58, 0.7);
      outline: none;
      border: none;
      text-align: center;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #FFFFFF;
    }
  }
  
  .area,.price {
    width: 80px;
    height: 25px;
    border-radius: 2px;
    background: rgba(34, 42, 58, 0.7);
    display: flex;
    align-items: center;
    
    input {
      width: 60%;
      outline: none;
      border: none;
      text-align: center;
      background: none;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #FFFFFF;
      text-align: center;
    }
    
    
    span {
      width: 40%;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #999999;
    }
  }
  
`;

const BookingSC = styled('a', 'active')`
  margin-top: 18px;
  width: 160px;
  height: 30px;
  margin-left: auto;
  margin-right: auto;
  background: ${(props) => (props.active ? '#00A1FC' : '#999999')};
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #FFFFFF;
  cursor: pointer;
`;
