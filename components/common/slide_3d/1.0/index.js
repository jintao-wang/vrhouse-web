import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import TouchCommon from '../../touch_common/TouchCommon';
import { Slide3DInfo } from '../../../../solution_config/sales_office/data';
import Introduction from '../introduction/1.0';
import VideoIntroduction from '../video_introduction/1.0';
import MapInfo from '../map_info/1.0';

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
`;

const Slide3D = ({
  slideList,
}) => {
  const [transitionSceneTime, setTransitionSceneTime] = useState(0);
  const [activeItem, setActiveItem] = useState(0);
  const [scale, setScale] = useState(0.9);
  const slideListTemp = useRef(slideList);
  const [_slideList, setSlideList] = useState([]);
  const objectRef = useRef(null);
  const rotateDeg = useRef(0);
  const rotateStart = useRef(null);
  const isLegalTouch = useRef(true);

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

  const componentRender = (item) => {
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
                >
                  {
                    componentRender(item)
                  }
                </ItemSC>
              ))
            }
          </Carousel>
        </SceneSC>
      </TouchCommon>
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
