import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Thumbnail from '../../../../../../models/thumbnail';
import RowScroll from '../../../../../../components/rowScroll/index/1.0';
import { BackgroundTheme, ColorTheme } from '../../../config';
import Animation from '../../../../../../components/animation/2.0';
import TouchCommon from '../../../../../../components/touch_common/TouchCommon';
import GlobalClose from '../../../../../../components/global-close/2.0';
import Modal from '../../../../../../components/modal/3.0';
import TMapReact from '../../../../../../components/TMap/1.0';

const ContainerSC = styled('div')`
  position: fixed;
  left: 10px;
  right: 10px;
  bottom: 15px;
  margin: auto;
  user-select: none;
`;

const TopContainerSC = styled('div')`
  width: 100%;
  overflow: hidden;
`;

const ButtonMenuSC = styled('div', ['bottomRadiusActive'])`
  width: 100%;
  height: 64px;
  background: ${BackgroundTheme()};  
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  border-radius: ${(props) => (props.bottomRadiusActive ? '6px' : '0 0 6px 6px')};
`;

const LogoSC = styled('div')`
  display: flex;
  align-items: center;
  img {
    width: 32px;
    margin-right: 10px;
  }
  
  .info {
    .name {
      font-size: 12px;
      color: #FFFFFF;
    }
    
    .detail {
      font-size: 11px;
      color: ${ColorTheme()};
    }
    
  }
`;

const MenuSC = styled('div')`
  display: flex;
  color: white;
  
  .price {
    display: flex;
    align-items: center;
    margin: 0 5px; 
    
    .icon {
      margin-right: 8px;
      margin-bottom: -2px;
      
      img {
        height: 20px;
      }
    }
    
    .word {
      font-size: 14px;
      font-weight: 500;
    }
  }
  
  .contact {
    display: flex;
    align-items: center;
    margin: 0 5px; 
    text-decoration: none;
   
    .icon {
      margin-right: 4px;
      margin-bottom: -2px;
      
      img {
        height: 20px;
      }
    }
    
    .word {
      font-size: 14px;
      font-weight: 500;
      color: white;
      text-decoration: none;
    }
  }
`;

const ThumbnailSC = styled('div', ['thumbnailBottom', 'active', 'isTransition'])`
  width: 100%;
  box-sizing: border-box;
  transition: ${(props) => props.isTransition && 'margin-bottom .2s'};
  transform: translateZ(0);
  //will-change: margin-bottom;
  
  .scrollArea {
    width: 58px;
    height: 22px;
    margin-left: auto;
    margin-right: auto;
    position: relative;
    
    .style {
      position: absolute;
      bottom: 0;
      height: 9px;
      width: 100%;
      border-radius: 10px 10px 0 0;
      background: ${BackgroundTheme()};  
      display: flex;
      justify-content: center;
      align-items: center;
      
      img {
        margin-top: ${(props) => (props.active ? '-2px' : '2px')};
        width: 12px;
        display: block;
        transform: ${(props) => props.active && 'rotate(180deg)'};
        transition: transform .3s;
      }
    }
    
  }
  
  .main {
    width: 100%;
    background: ${BackgroundTheme()};   
    border-radius: 6px 6px 0 0;
    padding-bottom: 5px;
  }
`;

const ScrollSC = styled('div')`
  width: 58px;
  height: 100%;
  margin-left: -40px;
`;

const ThumbnailItemSC = styled('div', ['url', 'active'])`
  width: 50px;
  height: 50px;
  background: url(${(props) => props.url}) no-repeat center / cover;
  margin: 0 5px;
  position: relative;  
  border-radius: 1px;
  border: ${(props) => (props.active ? '1px solid rgba(54,217,136, 1)' : '1px solid rgba(54,217,136, 0)')};
  
  
  .name {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 1px 0;
    font-size: 10px;
    color: #FFFFFF;
    text-align: center;
    background: rgba(0,0,0,.49);
  }
`;

const NodeListSC = styled('div')`
  width: 100%;
  height: 38px;
`;

const NodeItemSC = styled('div', ['active'])`
  height: 100%;
  margin: 0 10px;
  position: relative; 
  font-size: 12px; 
  color: ${(props) => (props.active ? ColorTheme() : 'white')};
`;

const ActiveNodeSC = styled('div', ['aniTrigger'])`
  display: inline-block;
  padding: 8px 10px;
  background: ${BackgroundTheme()};
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: ${ColorTheme()};
  border-radius: 4px;
  position: absolute;
  bottom: 68px;
  opacity: ${(props) => (props.aniTrigger ? 1 : 0)};
  transition: opacity .3s;
`;

const IntroductionSC = styled('div', [])`
  width: 204px;
  background: white;
  border-radius: 10px;
  position: relative;
  padding: 0 24px 16px 24px;
  
  .logo {
    width: 52px;
    position: absolute;
    left: 20px;
    transform: translateY(-50%);
  }
  .title {
    padding-top: 46px;
    font-size: 18px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
  }
  .content {
    margin-top: 10px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #000000;
  }
  .buttonGroup {
    margin-top: 24px;
    display: flex;
    justify-content: space-between;
    
    .button {
      width: 45%;
      height: 40px;
      background: orangered;
      border-radius: 23px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #FFFFFF;
      text-decoration: none;
    }
    
    .green {
       background: #36D988;
    }
  }
`;

const TMapSC = styled('div')`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
  z-index: 999;
`;

const PriceInfoSC = styled('div', ['url', '_window'])`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
  background: white;
   z-index: 1001;
  
  
  .img {
    width: 100%;
    height: 35%;
    background: url(${(props) => props.url}) no-repeat center / cover;
    position: relative;
    
    .back {
      position: absolute;
      left: 15px;
      top: 20px;
      font-size: 22px;
      text-shadow: 2px 2px 3px rgba(0,0,0,.2);
    }
  }
  
  .title {
    font-weight: 400;
    color: #000000;
    position: relative;
    display: inline-block;
    margin-top: 20px;
    margin-left: 16px;
    
    .word {
      z-index: 1;
      position: relative;
    }
    
    .background {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 50%;
      background: #FFE300;
      z-index: 0;
    }
  }
  
  .info {
    margin-left: 16px;
    margin-top: 18px;
    font-size: 14px;
    color: rgba(0,0,0,1);
    
    .item {
      margin: 5px 0;
    }
  }
  
  .contact {
    position: absolute;
    bottom: 44px;
    left: 44px;
    right: 44px;
    height: 46px;
    background: #36D988;
    border-radius: 8px;
    font-weight: 500;
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    color: white;
  }
 
`;

const scrollAreaHeight = 95;
const scrollDisplayMargin = 4;

const BottomBar = ({
  viewDataModel,
  currentHotSpotId,
  isChangingPanorama,
  nodeList,
  onPackageChange,
  activePackageId,
  activeDomain,
}) => {
  const [thumbnailList, setThumbnailList] = useState([]);
  const [thumbnailActive, setThumbnailActive] = useState(false);
  const [activeThumbnailIndex, setActiveThumbnailIndex] = useState(0);
  const [activeNodeIndex, setActiveNodeIndex] = useState(1);
  const [bottomRadiusActive, setBottomRadiusActive] = useState(true);
  const [isIntroduction, setIsIntroduction] = useState(false);
  const [isPriceInfo, setIsPriceInfo] = useState(false);
  const [isActiveNode, setIsActiveNode] = useState(true);
  const thumbnailRef = useRef(null);
  const initialStyleRef = useRef(null);
  const [isTransition, setIsTransition] = useState(false);
  const lastUsefulMoveState = useRef(null);
  const thumbnailBottom = useRef(-scrollAreaHeight);
  const [isMap, setIsMap] = useState(false);

  useEffect(() => {
    if (!viewDataModel) return;
    setThumbnailList(viewDataModel.HotSpots.map((hotSpot) => new Thumbnail(hotSpot)));
  }, [viewDataModel]);

  const handTouchStart = () => {
    setIsActiveNode(false);
    setBottomRadiusActive(false);
    // eslint-disable-next-line radix
    initialStyleRef.current = parseInt(thumbnailRef.current.style.marginBottom);
  };

  const handleTouchMove = (e) => {
    if (e.direction !== 'down' && e.direction !== 'up') return;
    lastUsefulMoveState.current = e.direction;
    // setIsActiveNode(false);
    if (
      // eslint-disable-next-line radix
      parseInt(thumbnailRef.current.style.marginBottom) >= -scrollAreaHeight
      // eslint-disable-next-line radix
      && parseInt(thumbnailRef.current.style.marginBottom) <= scrollDisplayMargin
    ) {
      if (initialStyleRef.current - e.y_move >= scrollDisplayMargin) {
        thumbnailRef.current.style.marginBottom = `${scrollDisplayMargin}px`;
        return;
      }
      if (initialStyleRef.current - e.y_move <= -scrollAreaHeight) {
        thumbnailRef.current.style.marginBottom = `${-scrollAreaHeight}px`;
        return;
      }
      // eslint-disable-next-line radix
      thumbnailRef.current.style.marginBottom = `${initialStyleRef.current - e.y_move}px`;
    }
    // setBottomRadiusActive(false);
  };

  const handleTouchEnd = (e) => {
    if (lastUsefulMoveState.current === 'down') {
      setTimeout(() => {
        setThumbnailActive(false);
        setIsTransition(true);
        setBottomRadiusActive(true);
        setIsActiveNode(true);
        thumbnailRef.current.style.marginBottom = `${-scrollAreaHeight}px`;
      }, 10);
    } else if (lastUsefulMoveState.current === 'up') {
      setTimeout(() => {
        setThumbnailActive(true);
        setIsTransition(true);
        setBottomRadiusActive(false);
        thumbnailRef.current.style.marginBottom = `${scrollDisplayMargin}px`;
      }, 10);
    } else {
      console.log(e.direction);
    }
  };

  const handleThumbnail = (item, index, callback) => {
    if (isChangingPanorama) return;
    setActiveThumbnailIndex(index);
    if (currentHotSpotId !== item.ID) {
      // eslint-disable-next-line no-undef
      HouseViewer.BaseAPI.onThumbnailClick(item.ID);
      if (callback) callback();
    }
  };

  const handleNodeChange = (item, index, callback) => {
    if (index === 0) return;
    onPackageChange(nodeList[item].packageId);
    setActiveNodeIndex(index);
    if (callback) callback();
  };

  return (
    <ContainerSC>
      <TopContainerSC>
        <Animation visible={isActiveNode}>
          <ActiveNodeSC
            onClick={() => {
              setIsActiveNode(false);
              setIsTransition(true);
              setThumbnailActive(true);
              thumbnailRef.current.style.marginBottom = `${scrollDisplayMargin}px`;
            }}
          >
            {Object.keys(nodeList)[activeNodeIndex - 1]}
          </ActiveNodeSC>
        </Animation>
        <GlobalClose
          onClose={() => {
            setThumbnailActive(false);
            setIsTransition(true);
            setBottomRadiusActive(true);
            setIsActiveNode(true);
            thumbnailRef.current.style.marginBottom = `${-scrollAreaHeight}px`;
          }}
          openListener={thumbnailActive}
          stopPropagation={false}
        >
          <TouchCommon
            on_touchStart={handTouchStart}
            on_touchMove={handleTouchMove}
            on_touchEnd={handleTouchEnd}
          >
            <ThumbnailSC
              isTransition={isTransition}
              ref={thumbnailRef}
              active={thumbnailActive}
              onTransitionEnd={() => {
                setIsTransition(false);
              }}
              style={{ marginBottom: `${thumbnailBottom.current}px` }}
            >
              <div
                className="scrollArea"
              >
                <div className="style">
                  {/* eslint-disable-next-line global-require,jsx-a11y/alt-text */}
                  <img src={require('../../../../../../next_static/decoration_node/img/icon/indicate.svg')} />
                </div>
              </div>
              <div className="main">
                <NodeListSC>
                  <RowScroll
                    scrollList={
                      ['施工节点:', ...Object.keys(nodeList)]
                    }
                    onChange={handleNodeChange}
                  >
                    {
                      (item, index) => (
                        <NodeItemSC active={index === activeNodeIndex}>
                          {item}
                        </NodeItemSC>
                      )
                    }
                  </RowScroll>
                </NodeListSC>
                <RowScroll
                  scrollList={thumbnailList}
                  onChange={handleThumbnail}
                  rowItemInfo={{
                    width: 50,
                    margin: 5,
                  }}
                >
                  {
                    (item, index) => (
                      <ThumbnailItemSC url={item.ImagePath} active={index === activeThumbnailIndex}>
                        <div className="name">
                          {item.Name}
                        </div>
                      </ThumbnailItemSC>
                    )
                  }
                </RowScroll>
              </div>
            </ThumbnailSC>
          </TouchCommon>
        </GlobalClose>

      </TopContainerSC>
      {
        isMap && (
          <TMapSC>
            <TMapReact onClose={() => setIsMap(false)} />
          </TMapSC>
        )
      }
      <ButtonMenuSC bottomRadiusActive={bottomRadiusActive}>
        <Modal
          visible={isIntroduction}
          closeFunc={() => setIsIntroduction(false)}
          content={(
            <IntroductionSC>
              {/* eslint-disable-next-line global-require */}
              <img className="logo" src={require('../../../static/logoColor.png')} />
              <div className="title">全屋定制</div>
              <div className="content">
                构家，互联网整体家装开创者。为了彻底改变传统家装业的操作方式和行业业态，为了让用户不再受装修之苦，构家开创“构家”如“构车”的家装理念。
              </div>
              <div className="buttonGroup">
                <a
                  className="button green"
                  onClick={() => {
                    setIsMap(true);
                    setIsIntroduction(false);
                  }}
                >
                  地址
                </a>
                <a className="button" href="https://www.123kanfang.com" target="_blank">官网</a>
              </div>
            </IntroductionSC>
          )}
          trigger={(
            <LogoSC onClick={() => setIsIntroduction(true)}>
              {/* eslint-disable-next-line global-require,jsx-a11y/alt-text */}
              <img src={require('../../../static/logo.png')} />
              {/* eslint-disable-next-line max-len */}
              {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */}
              <div className="info" onClick={() => setIsIntroduction(true)}>
                <div className="name">全屋定制</div>
                <div className="detail">查看详情</div>
              </div>
            </LogoSC>
          )}
        />
        <TouchCommon
          on_touchStart={handTouchStart}
          on_touchMove={handleTouchMove}
          on_touchEnd={handleTouchEnd}
        >
          <ScrollSC />
        </TouchCommon>
        <MenuSC>
          {
            isPriceInfo && (
              <PriceInfoSC url={`https://${activeDomain}${activePackageId}/CoverImage/Cover.jpg`}>
                <div className="img">
                  <div className="back" onClick={() => setIsPriceInfo(false)}>
                    <i className="icon-back" />
                  </div>
                </div>
                <div className="title">
                  <div className="background" />
                  <div className="word">万达城市公寓1902室</div>
                </div>
                <div className="info">
                  <div className="item">发布公司: 亦我全屋定制</div>
                  <div className="item">房源户型： 两室一厅</div>
                  <div className="item">房源面积： 78²</div>
                  <div className="item">装修风格： 欧式</div>
                  <div className="item">装修报价： 约15万</div>
                </div>
                <a className="contact" href="tel:10086">联系我们</a>
              </PriceInfoSC>
            )
          }
          <div className="price" onClick={() => setIsPriceInfo(true)}>
                <span className="icon">
                  {/* <i className="icon-projectView" /> */}
                  {/* eslint-disable-next-line global-require,jsx-a11y/alt-text */}
                  <img src={require('../../../../../../next_static/decoration_node/img/icon/price.svg')} />
                </span>
            <span className="word">
                  报价
            </span>
          </div>
          {/* <a className="contact" href="tel:10086"> */}
          {/*  <span className="icon"> */}
          {/*    /!* <i className="icon-phone" /> *!/ */}
          {/*    /!* eslint-disable-next-line global-require,jsx-a11y/alt-text *!/ */}
          {/*    <img src={require('../../../../../next_static/decoration_node/img/icon/phone.svg')} /> */}
          {/*  </span> */}
          {/*  <div className="word"> */}
          {/*    咨询 */}
          {/*  </div> */}
          {/* </a> */}
        </MenuSC>
      </ButtonMenuSC>
    </ContainerSC>
  );
};

BottomBar.propTypes = {
  styleSC: PropTypes.shape({
    top: PropTypes.string,
  }),
  viewDataModel: PropTypes.shape({}) || null,
  currentHotSpotId: PropTypes.string || null,
  isChangingPanorama: PropTypes.bool.isRequired,
  nodeList: PropTypes.shape({}),
  onPackageChange: PropTypes.func,
  activeDomain: PropTypes.string,
  activePackageId: PropTypes.string,
};

BottomBar.defaultProps = {
  styleSC: {},
  viewDataModel: {},
  currentHotSpotId: null,
  nodeList: {},
  onPackageChange: () => {},
  activeDomain: '',
  activePackageId: '',
};

export default BottomBar;
