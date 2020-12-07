import React, {useState, useEffect, useRef, useCallback} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import TouchCommon from '../../touch_common/TouchCommon';
import { Slide3DInfo } from '../../../../solution_config/sales_office/data';
import Introduction from '../introduction/1.0';
import VideoIntroduction from '../video_introduction/1.0';
import MapInfo from '../map_info/1.0';
import PictureView from '../picture_view/1.0';
import ZTop from '../../z_top/1.0';
import Slide2D from '../../slide_2d/1.0';
import GlobalClose from '../../global-close/2.0';

const ContainerSC = styled('div')`
  width: 100vw;
  position: fixed;
  top: 50px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  //overflow: hidden;
  
`;

const SceneSC = styled('div')`
  width: 320px;
  height: 225px;
  perspective: 10000px;
`;

const Carousel = styled('div', ['rotateDeg', 'transitionSceneTime'])`
  width: 100%;
  height:100%;
  position: absolute;
  transform-style: preserve-3d;
  transition: transform ${(props) => props.transitionSceneTime}s;
`;

const ItemSC = styled('div', ['visible', 'index', 'active', 'scale'])`
  position: absolute;
  width: 310px;
  height:215px;
  left: 5px;
  top:5px;
  font-weight: 500;
  font-size: 4rem;
  background: rgba(34,34,34,1);
  box-shadow:0 0 4px 0 rgba(0,0,0,.5);
  border-radius: 4px;
  transform: rotateY( ${(props) => props.index * 72}deg) translateZ(225px) ${(props) => (props.active ? '' : `scale(${props.scale})`)};
  visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};
  transition: transform .5s;
  overflow: auto;
  cursor: pointer;
`;

const PictureViewBigSC = styled('div')`
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

const ViewBigSC = styled('div', ['height'])`
  width: 100vw;
  max-width: 500px;
  height: ${(props) => props.height}px;
  position: relative;
  
  @media(min-width: 1026px) {
      width: 500px;
  }
`;

const LeftSC = styled('div')`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 15px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(34,34,34,.7);
  margin: auto;
  opacity: .4;
  cursor: pointer;
  transform: rotate(-90deg);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 22px;
  
  &:hover {
    opacity: 1;
  }
`;

const RightSC = styled(LeftSC)`
  left: unset;
  right: 15px;
  transform: rotate(90deg);
`;

const ViewBigItemSC = styled('div', ['url', 'height'])`
  width: calc(100vw - 60px);
  height: ${(props) => props.height}px;
  margin: 0 8px;
  padding-bottom: 30px;
  //background: white;
  box-sizing: border-box;
  @media(min-width: 1026px) {
      width: 500px;
  }
  
  .img {
    width: 100%;
    height: 100%;
    background: url(${(props) => props.url}) no-repeat center / cover;
  }
`;

const Slide3D = ({
  slideList,
}) => {
  const rotateDeg = useRef(0);
  const [transitionSceneTime, setTransitionSceneTime] = useState(0);
  const [activeItem, setActiveItem] = useState(0);
  const [scale, setScale] = useState(0.9);
  const slideListTemp = useRef(slideList);
  const [_slideList, setSlideList] = useState([]);
  const objectRef = useRef(null);
  const rotateStart = useRef(null);
  const isLegalTouch = useRef(true);
  const [viewBigger, setViewBigger] = useState(false);
  const [viewActiveIndex, setViewActiveIndex] = useState(0);

  useEffect(() => {
    updateList(activeItem);
  }, []);

  const checkVisible = (index) => {
    if (
      index === activeItem
      || index === (activeItem + 5 + 1) % 5
      || index === (activeItem + 5 - 1) % 5
    ) {
      return true;
    }
    return false;
  };

  const updateList = (activeIndex) => {
    if (slideListTemp.current.length === 4) {
      const array = [...slideListTemp.current];
      array.splice((activeIndex + 2 + 5) % 5, 0, {
        name: 'hiddenItem',
        content: {},
      });
      setSlideList(array);
    }
    if (slideListTemp.current.length === 3) {
      const array = [...slideListTemp.current];
      if ((activeIndex + 2 + 5) % 5 > slideListTemp.current.length) {
        array.splice((activeIndex + 3 + 5) % 5, 0, {
          name: 'hiddenItem',
          content: {},
        });
        array.splice((activeIndex + 2 + 5) % 5, 0, {
          name: 'hiddenItem',
          content: {},
        });
      } else {
        array.splice((activeIndex + 2 + 5) % 5, 0, {
          name: 'hiddenItem',
          content: {},
        });
        array.splice((activeIndex + 3 + 5) % 5, 0, {
          name: 'hiddenItem',
          content: {},
        });
      }
      // console.log(array);

      setSlideList(array);
    }
  };

  const correctList = (newActive, deg) => {
    if (deg < 0) {
      if ((newActive + 2 + 5) % 5 === 0 && slideListTemp.current.length === 4) {
        const array = [];
        array.push(slideListTemp.current[1]);
        array.push(slideListTemp.current[2]);
        array.push(slideListTemp.current[3]);
        array.push(slideListTemp.current[0]);
        slideListTemp.current = array;
      } else if ((newActive + 3 + 5) % 5 === 0 && slideListTemp.current.length === 3) {
        const array = [];
        array.push(slideListTemp.current[1]);
        array.push(slideListTemp.current[2]);
        array.push(slideListTemp.current[0]);
        slideListTemp.current = array;
      } else if ((newActive + 2 + 5) % 5 === 0 && slideListTemp.current.length === 3) {
        const array = [];
        array.push(slideListTemp.current[1]);
        array.push(slideListTemp.current[2]);
        array.push(slideListTemp.current[0]);
        slideListTemp.current = array;
      }
    } else if ((newActive + 2 + 5) % 5 === 4 && slideListTemp.current.length === 4) {
      const array = [];
      array.push(slideListTemp.current[3]);
      array.push(slideListTemp.current[0]);
      array.push(slideListTemp.current[1]);
      array.push(slideListTemp.current[2]);
      slideListTemp.current = array;
    } else if ((newActive - 3 + 5) % 5 === 4 && slideListTemp.current.length === 3) {
      const array = [];
      array.push(slideListTemp.current[2]);
      array.push(slideListTemp.current[0]);
      array.push(slideListTemp.current[1]);
      slideListTemp.current = array;
    } else if ((newActive - 2 + 5) % 5 === 4 && slideListTemp.current.length === 3) {
      const array = [];
      array.push(slideListTemp.current[2]);
      array.push(slideListTemp.current[0]);
      array.push(slideListTemp.current[1]);
      slideListTemp.current = array;
    }
  };

  const moveLeft = () => {
    const newActive = (activeItem + 5 + 1) % 5;
    setActiveItem(newActive);
    rotateDeg.current -= 72;
    objectRef.current.style.transform = `rotateY(${rotateDeg.current}deg)`;
    correctList(newActive, -72);
    updateList(newActive);
  };

  const moveRight = () => {
    const newActive = (activeItem + 5 - 1) % 5;
    setActiveItem(newActive);
    rotateDeg.current += 72;
    objectRef.current.style.transform = `rotateY(${rotateDeg.current}deg)`;
    correctList(newActive, 72);
    updateList(newActive);
  };

  const handTouchStart = (e) => {
    if (e.touches.length > 1) {
      isLegalTouch.current = false;
      return;
    }
    isLegalTouch.current = true;
    setScale(1);
    setTransitionSceneTime(0);
    rotateStart.current = parseFloat(objectRef.current.style.transform.slice(8));
  };

  const handleTouchMove = (e) => {
    if (!isLegalTouch.current) return;
    objectRef.current.style.transform = `rotateY(${rotateStart.current + e.x_move * 1 / 5}deg)`;
  };

  const handleTouchEnd = (e) => {
    setScale(0.9);
    setTransitionSceneTime(1);
    if (!isLegalTouch.current) return;
    if (e.x_move < 0) {
      if (e.x_move > -30) {
        objectRef.current.style.transform = `rotateY(${rotateStart.current}deg)`;
        return;
      }
      moveLeft();
    } else {
      if (e.x_move < 30) {
        objectRef.current.style.transform = `rotateY(${rotateStart.current}deg)`;
        return;
      }
      moveRight();
    }
  };

  const handleChange = (index) => {
    if ((activeItem + 5 - 1) % 5 === index) {
      setScale(0.9);
      setTransitionSceneTime(1);
      moveRight();
    } else if ((activeItem + 5 + 1) % 5 === index) {
      setScale(0.9);
      setTransitionSceneTime(1);
      moveLeft();
    }
  };

  const handleViewClick = (index) => {
    setViewActiveIndex(index);
    setViewBigger(true);
  };

  const handleViewChange = (number) => {
    // eslint-disable-next-line max-len
    const nextActive = (viewActiveIndex + number + Slide3DInfo[2].content.length) % Slide3DInfo[2].content.length;
    setViewActiveIndex(nextActive);
  };

  // eslint-disable-next-line react/prop-types
  const ViewBigItemRender = ({ item, active }) => (
    <ViewBigItemSC url={item.url} active={active} height={280}>
      <div className="img" />
    </ViewBigItemSC>
  );

  // eslint-disable-next-line react/prop-types
  const componentRender = (item, active) => {
    switch (item.component) {
      case 'Introduction':
        return <Introduction title={item.content.title} params={item.content.params} />;
      case 'VideoIntroduction':
        return (
          <VideoIntroduction
            title={item.content.title}
            url={item.content.url}
            poster={item.poster}
          />
        );
      case 'PictureView':
        return (
          <PictureView
            pictureList={item.content}
            onImgClick={handleViewClick}
            active={active}
          />
        );
      case 'MapInfo':
        return (
          <MapInfo
            title={item.content.title}
            addressPoint={item.content.addressPoint}
          />
        );
      default:
        return <div>{item.component}</div>;
    }
  };

  return (
    <ContainerSC>
      <TouchCommon
        on_touchStart={handTouchStart}
        on_touchMove={handleTouchMove}
        on_touchEnd={handleTouchEnd}
      >
        <SceneSC>
          <Carousel
            ref={objectRef}
            style={{ transform: 'rotateY(0deg)' }}
            transitionSceneTime={transitionSceneTime}
          >
            {
              _slideList.map((item, index) => (
                <ItemSC
                  index={index}
                  visible={checkVisible(index)}
                  active={index === activeItem}
                  scale={scale}
                  onClick={() => {
                    if (index === activeItem) return;
                    handleChange(index);
                  }}
                >
                  {
                    componentRender(item, index === activeItem)
                  }
                </ItemSC>
              ))
            }
          </Carousel>
        </SceneSC>
      </TouchCommon>
       {
        viewBigger && (
          <ZTop>
            <PictureViewBigSC>
              <GlobalClose
                onClose={() => { setViewBigger(false); }}
              >
                <ViewBigSC height={280}>
                  <Slide2D
                    activeIndex={viewActiveIndex}
                    slideList={Slide3DInfo[2].content}
                    onChange={(item, index, callback) => {
                      // if (index === viewActiveIndex) return;
                      setViewActiveIndex(index);
                      callback();
                    }}
                  >
                    <ViewBigItemRender />
                  </Slide2D>
                  <LeftSC onClick={() => handleViewChange(-1)}>
                    <i className="icon-pointTop" />
                  </LeftSC>
                  <RightSC onClick={() => handleViewChange(1)}>
                    <i className="icon-pointTop" />
                  </RightSC>
                </ViewBigSC>
              </GlobalClose>
            </PictureViewBigSC>
          </ZTop>
        )
       }
    </ContainerSC>
  );
};

Slide3D.propTypes = {
  slideList: PropTypes.arrayOf(),
};

Slide3D.defaultProps = {
  slideList: Slide3DInfo,
};

export default Slide3D;
