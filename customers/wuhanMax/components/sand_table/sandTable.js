import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Transition from '../../../../components/transition/2.0';
import Slide2D from '../../../../components/slide_2d/1.0';
import { BuildList } from '../../config';
import ZTop from '../../../../components/z_top/1.0';
import GlobalClose from '../../../../components/global-close/2.0';

const ContainerSC = styled('div', ['aniTrigger'])`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  opacity: ${(props) => (props.aniTrigger ? 1 : 0)};
  transition: opacity .2s;
  
`;

const SandSC = styled('div', ['sandImgUrl'])`
  width: 100%;
  height: 100%;
  background: rgb(0,0,0) url('https://vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/sales-office/static/building.jpg') no-repeat center / cover;
`;

const PointSC = styled('div', ['left', 'bottom', 'rotate', 'selected', 'active'])`
  position: absolute;
  left: ${(props) => props.left || 0}px;
  bottom: ${(props) => props.bottom || 0}px;
  transform: rotate(${(props) => props.rotate || 0}deg);
  border: ${(props) => (props.selected ? '1px solid #000' : '1px solid rgba(0,0,0,0)')};
  transition: border .2s;
  cursor: pointer;
  
  img {
    width: 26px;
  }
  
  .info {
    position: absolute;
    color: ${(props) => (props.active ? 'rgba(51,51,51,1)' : 'orange')};
    left: 0;
    right: 0;
    top: 4px;
    bottom: 0;
    margin: auto;
    text-align: center;
    font-size: 14px;
  }
`;

const RecommendViewSC = styled('div')`
  width: 100%;
  height: 280px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  background: white;
`;

const RecommendItemSC = styled('div', ['url'])`
  width: 100vw;
  height: 250px;
  margin: 0;
  padding-bottom: 30px;
  background: white;
  
  .img {
    width: 100%;
    height: 100%;
    background: white url(${(props) => props.url}) no-repeat center / contain;
  }
`;

const BigIconSC = styled('div')`
  position: absolute;
  width: 40px;
  height: 40px;
  top: 20px;
  right: 15px;
  z-index: 1;
  color: #666666;
  font-size: 20px;
  text-align: right;
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

const ViewBigSC = styled('div')`
  width: 100vw;
  height: 480px;
`;

const ViewBigItemSC = styled('div', ['url'])`
  width: calc(100vw - 60px);
  height: 480px;
  margin: 0 8px;
  padding-bottom: 30px;
  background: white;
  box-sizing: border-box;
  
  .img {
    width: 100%;
    height: 100%;
    background: white url(${(props) => props.url}) no-repeat center / contain;
  }
`;

const SandTable = ({
  visible,
  sandImgUrl,
  recommendList,
}) => {
  const [containerWidth, setContainerWidth] = useState(null);
  const [containerHeight, setContainerHeight] = useState(null);
  const [imgInfo, setImgInfo] = useState({});
  const [points, setPoints] = useState(BuildList);
  const sandRef = useRef(null);
  const [activeRecommend, setActiveRecommend] = useState(0);
  const [viewBigger, setViewBigger] = useState(false);
  const [viewBiggerInfo, setViewBiggerInfo] = useState({});

  useEffect(() => {
    getImgInfo();
  }, []);

  useEffect(() => {
    if (!visible) return;
    setTimeout(() => {
      setActiveRecommend(0);
      setContainerWidth(sandRef.current.clientWidth);
      setContainerHeight(sandRef.current.clientHeight);
      window.addEventListener('resize', () => {
        setContainerWidth(sandRef.current.clientWidth);
        setContainerHeight(sandRef.current.clientHeight);
      });
    });
  }, [visible]);

  const getImgInfo = () => {
    const image = new Image();
    let width; let height;
    image.src = sandImgUrl;
    // 如果有缓存，读缓存
    if (image.complete) {
      width = image.width;
      height = image.height;
      setImgInfo({
        width,
        height,
      });
    } else {
      image.onload = function () {
        width = image.width;
        height = image.height;
        image.onload = null;
        setImgInfo({
          width,
          height,
        });
      };
    }
  };

  // eslint-disable-next-line no-shadow
  const left = (left, offsetWidth = 0) => {
    // eslint-disable-next-line max-len,no-mixed-operators
    // if (containerHeight / containerWidth < imgInfo.height / imgInfo.width) return containerWidth / 2 - (1125 / 2 - left) / 1125 * containerWidth - offsetWidth;
    // eslint-disable-next-line max-len,no-mixed-operators
    if (containerHeight / containerWidth < imgInfo.height / imgInfo.width) return left * containerWidth / 1125 - offsetWidth;
    // eslint-disable-next-line max-len,no-mixed-operators
    return containerWidth / 2 - (1125 / 2 - left) / 1125 * imgInfo.width / imgInfo.height * containerHeight - offsetWidth;
  };
  // eslint-disable-next-line no-shadow
  const bottom = (bottom, offsetHeight = 0) => {
    // eslint-disable-next-line max-len,no-mixed-operators
    // if (containerHeight / containerWidth >= imgInfo.height / imgInfo.width) return containerHeight / 2 - (835 / 2 - bottom) / 835 * containerHeight - offsetHeight;
    // eslint-disable-next-line max-len,no-mixed-operators
    if (containerHeight / containerWidth >= imgInfo.height / imgInfo.width) return bottom * containerHeight / 835 - offsetHeight;
    // eslint-disable-next-line max-len,no-mixed-operators
    return containerHeight / 2 - (835 / 2 - bottom) / 835 * imgInfo.height / imgInfo.width * containerWidth - offsetHeight;
  };

  const handleRecommendChange = (item, index, callback) => {
    setActiveRecommend(index);
    callback();
  };

  const RecommendItem = ({ item, active }) => (
    // eslint-disable-next-line react/prop-types
    <RecommendItemSC url={item.src} active={active}>
      <div className="img" />
    </RecommendItemSC>
  );

  const ViewBigItem = ({ item, active }) => (
    // eslint-disable-next-line react/prop-types
    <ViewBigItemSC url={item.srcBig} active={active}>
      <div className="img" />
    </ViewBigItemSC>
  );

  const checkActive = (build) => {
    if (build.floorPlan.includes(recommendList[activeRecommend])) return true;
    return false;
  };

  return (
    <Transition visible={visible}>
      <ContainerSC>
        <RecommendViewSC>
          <BigIconSC onClick={() => {
            setViewBiggerInfo({
              title: '户型鉴赏',
              list: recommendList,
            });
            setViewBigger(true);
          }}
          >
            <i className="icon-zoomOut" />
          </BigIconSC>
          <Slide2D
            slideList={recommendList}
            onChange={handleRecommendChange}
          >
            <RecommendItem />
          </Slide2D>
        </RecommendViewSC>
        <SandSC
          sandImgUrl={sandImgUrl}
          ref={sandRef}
        >
          { points.map((point, index) => (
            <PointSC
              left={left(point.left.value, point.left.offset)}
              bottom={bottom(point.bottom.value, point.bottom.offset)}
              rotate={point.rotate}
              key={point.left.value / point.bottom.value}
              active={checkActive(point)}
              onClick={() => {
                setViewBiggerInfo({
                  title: `${point.info}栋`,
                  list: point.floorPlan,
                });
                setViewBigger(true);
              }}
            >
              {/* eslint-disable-next-line global-require,jsx-a11y/alt-text */}
              <img src={checkActive(point) ? require('./static/pointActive.svg') : require('./static/point.svg')} />
              <div className="info">{point.info}</div>
            </PointSC>
          ))}
        </SandSC>
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
                  <ViewBigSC>
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
    </Transition>
  );
};

SandTable.propTypes = {
  visible: PropTypes.bool,
  sandImgUrl: PropTypes.string,
  recommendList: PropTypes.arrayOf(),
};

SandTable.defaultProps = {
  visible: false,
  sandImgUrl: 'https://vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/sales-office/static/building.jpg',
  recommendList: [],
};

export default SandTable;
