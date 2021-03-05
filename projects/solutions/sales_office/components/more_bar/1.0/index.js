import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import TriangleIcon from '../../triangle_icon/1.0/triangleIcon';
import Introduction from '../../introduction/1.0';
import TMapReact from '../../../../../../components/TMap/1.0';
import { FloorPlanList, IntroductionInfo, TrafficList } from '../../../config';
import ZTop from '../../../../../../components/z_top/1.0';
import GlobalClose from '../../../../../../components/global-close/2.0';
import Slide2D from '../../../../../../components/slide_2d/1.0';

const ContainerSC = styled('div')`
  width: 100%;
  pointer-events: none;
  padding-bottom: 18px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
`;

const SecondContainerSC = styled('div', ['visible'])`
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transform: ${(props) => (props.visible ? 'translateY(0)' : 'translateY(118px)')};
  transition: transform .4s, opacity .4s;
`;

const ContentSC = styled('div')`
  width: 100%;
  background: rgba(0,0,0,0.75);
  height: 56px;
  border-radius: 6px;
  pointer-events: auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const IconSC = styled('div', ['active', 'styleSC'])`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  color: rgb(255,255,255);

  .icon {
    width: 25px;
    height: 25px;
    display: flex;
    justify-content: center;
    align-items: center;

    i {
      font-size: 22px;
    }
  }

  .describe {
    font-size: 11px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    text-decoration: none;
    color: white;
  }

`;

const RecommendBigContainerSC = styled('div')`
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  position: fixed;
  background: rgba(0,0,0,.5);
  backdrop-filter: Blur(5px);
  z-index: 10000;
  pointer-events: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TitleSC = styled('div')`
    letter-spacing: 2px;
    padding: 6px 15px;
    background: rgba(0,0,0,.7);
    border-radius: 18px;
    font-size: 13px;
    font-family: PingFangSC-Medium,PingFang SC;
    font-weight: 500;
    color: rgba(255,255,255,1);
    display: flex;
    position: absolute;
    top: 35px;
`;

const ViewBigSC = styled('div', ['height'])`
  width: 100vw;
  height: ${(props) => props.height}px;
`;

const ViewBigItemSC = styled('div', ['url', 'height'])`
  width: calc(100vw - 60px);
  height: ${(props) => props.height}px;
  margin: 0 8px;
  padding-bottom: 30px;
  //background: white;
  box-sizing: border-box;
  
  .img {
    width: 100%;
    height: 100%;
    background: url(${(props) => props.url}) no-repeat center / contain;
  }
`;

const TMapSC = styled('div')`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
  z-index: 10000;
  pointer-events: auto;
`;

const MoreBar = ({
  visible,
  iconPosition,
}) => {
  const [introductionState, setIntroductionState] = useState(false);
  const [isMap, setIsMap] = useState(false);
  const [viewBigger, setViewBigger] = useState(false);
  const [viewBiggerInfo, setViewBiggerInfo] = useState({});
  const [viewBiggerHeight, setViewBiggerHeight] = useState(480);

  useEffect(() => {}, []);

  const handleRecommendChange = (item, index, callback) => {
    callback();
  };

  const ViewBigItem = ({ item, active }) => (
    // eslint-disable-next-line react/prop-types
    <ViewBigItemSC url={item.srcBig} active={active} height={viewBiggerHeight}>
      <div className="img" />
    </ViewBigItemSC>
  );

  return (
    <ContainerSC>
      <SecondContainerSC visible={visible}>
        <ContentSC>
          <IconSC onClick={() => setIntroductionState(true)}>
            <div>
              <i className="icon-projectIntroduction" />
            </div>
            <div className="describe">项目介绍</div>
          </IconSC>
          <IconSC onClick={() => {
            setViewBiggerHeight(480);
            setViewBigger(true);
            setViewBiggerInfo({
              title: '户型鉴赏',
              list: FloorPlanList,
            });
          }}
          >
            <div>
              <i className="icon-planView" />
            </div>
            <div className="describe">户型鉴赏</div>
          </IconSC>
          <IconSC onClick={() => {
            setViewBiggerHeight(240);
            setViewBigger(true);
            setViewBiggerInfo({
              title: '区域交通',
              list: TrafficList,
            });
          }}
          >
            <div>
              <i className="icon-traffic" />
            </div>
            <div className="describe">区域交通</div>
          </IconSC>
          <IconSC>
            <div>
              <i className="icon-phone" />
            </div>
            <a className="describe" href="tel:10086">电话</a>
          </IconSC>
        </ContentSC>
        <TriangleIcon left={iconPosition} />
      </SecondContainerSC>
      {
        introductionState && (
          <Introduction
            title={IntroductionInfo.title}
            content={IntroductionInfo.content}
            onClose={() => setIntroductionState(false)}
          />
        )
      }
      {
        isMap && (
          <TMapSC>
            <TMapReact showClose onClose={() => setIsMap(false)} />
          </TMapSC>
        )
      }
      {
        viewBigger && (
          <ZTop>
            <RecommendBigContainerSC>
              <TitleSC>
                {viewBiggerInfo.title}
              </TitleSC>
              <GlobalClose
                onClose={() => { setViewBigger(false); }}
              >
                <ViewBigSC height={viewBiggerHeight}>
                  <Slide2D
                    slideList={viewBiggerInfo.list}
                    onChange={handleRecommendChange}
                  >
                    <ViewBigItem />
                  </Slide2D>
                </ViewBigSC>
              </GlobalClose>
            </RecommendBigContainerSC>
          </ZTop>
        )
      }
    </ContainerSC>
  );
};

MoreBar.propTypes = {
  visible: PropTypes.bool,
  iconPosition: PropTypes.number,
};

MoreBar.defaultProps = {
  visible: true,
  iconPosition: 0,
};

export default MoreBar;
