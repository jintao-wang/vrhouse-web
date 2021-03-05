import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { ColorTheme } from '../../../config';
import RowScroll from '../../../../../../components/rowScroll/2.0';

const Container = styled('div')`
  width: 100%;
  pointer-events: none;
  overflow: hidden;
  position: absolute;
  bottom: 0;
`;

const SecondContainerSC = styled('div', ['thumbnailState'])`
  width: 100%;
  background: rgba(0,0,0,0.75);
  border-radius: 16px 16px 0 0;
  border-bottom: ${(props) => props.thumbnailState !== 'prompt' && '1px solid rgba(255,255,255,.1)'};
  opacity: ${(props) => {
    if (props.thumbnailState === 'hidden') return 0;
    return 1;
  }};
  transform: ${(props) => {
    if (props.thumbnailState === 'hidden') return 'translateY(100%)';
    if (props.thumbnailState === 'prompt') return 'translateY(100px)';
    return 'translateY(0)';
  }};
  transition: transform .4s, opacity .4s;
  pointer-events: auto;
`;

const TitleSC = styled('div')`
  padding: 8px 15px 5px 15px;
  color: white;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-family: PingFangSC-Medium,PingFang SC;
  font-weight: 500;
  border-bottom: 1px solid rgba(255,255,255,.1);
`;

const ScrollContainerSC = styled('div')`
   width: 100%;
   height: 100px;
`;

const ThumbnailItemSC = styled('div', ['active', 'item', 'active'])`
  height: 100px;
  width: 62px;
  margin: 0 5px;
  position: relative; 
  font-size: 12px; 
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  flex-direction: column;
  
  .img {
    width: calc(100% - 2px);
    height: 62px;
    background: url(${(props) => props.url}) no-repeat center / cover;
    border: ${(props) => (props.active ? `1px solid ${ColorTheme()}` : '1px solid rgba(0,0,0,0)')};
  }
  
  .word {
    margin-top: 5px;
    color: ${(props) => (props.active ? ColorTheme() : 'white')};
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }
  
`;

const ThumbnailItem = ({ item, active }) => (
  // eslint-disable-next-line react/prop-types
  <ThumbnailItemSC url={item.ImagePath} active={active}>
    <div className="img" />
    {/* eslint-disable-next-line react/prop-types */}
    <div className="word">{item.Name}</div>
  </ThumbnailItemSC>
);

ThumbnailItem.propTypes = {
  item: PropTypes.shape({}),
  active: PropTypes.bool,
};

ThumbnailItem.defaultProps = {
  item: {},
  active: false,
};

const ThumbnailBar = ({
  thumbnailList,
  onChange,
  thumbnailState,
  onDisplayChange,
  activeIndex,
}) => {
  const handleDisplay = () => {
    if (thumbnailState === 'visible') {
      onDisplayChange('prompt');
      return;
    }
    if (thumbnailState === 'prompt') {
      onDisplayChange('visible');
    }
  };

  return (
    <Container>
      <SecondContainerSC thumbnailState={thumbnailState}>
        <TitleSC onClick={() => handleDisplay()}>
          <span>
            全部空间
          </span>
          <span>
            <i className="icon-pointTop" />
          </span>
        </TitleSC>
        <ScrollContainerSC>
          <RowScroll
            scrollList={thumbnailList}
            onChange={onChange}
            activeIndex={activeIndex}
          >
            <ThumbnailItem />
          </RowScroll>
        </ScrollContainerSC>
      </SecondContainerSC>
    </Container>
  );
};

ThumbnailBar.propTypes = {
  thumbnailList: PropTypes.arrayOf({}),
  onChange: PropTypes.func,
  thumbnailState: PropTypes.string,
  onDisplayChange: PropTypes.func,
  activeIndex: PropTypes.number,
};

ThumbnailBar.defaultProps = {
  thumbnailList: [],
  onChange: () => {},
  thumbnailState: 'visible',
  onDisplayChange: () => {},
  activeIndex: 0,
};

export default ThumbnailBar;
