import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import TouchCommon from '../../touch_common/TouchCommon';

const ContainerSC = styled('div', ['styleSC'])`
   width: 100%; 
   height: 100%;
   position: relative;
`;

const UlContainerSC = styled('div')`
   width: 100%;
   height: 100%;
   flex: 1;
   display: flex;
   position:relative;
   overflow:hidden;
`;

const UlSC = styled('ul', ['styleSC'])`
  white-space: nowrap;
  padding: 0;
  margin: 0;
  display: inline-flex;
  align-items: center;
  overflow: auto;
  //scrollbar-width: none;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
     display: none;
  }
  position: absolute;
  height: 100%;
  transition: ${(props) => props.transitionOpen && 'left .4s'};
`;

const LiSC = styled('li', ['active', 'transitionStart', 'styleSC', 'scale'])`
  list-style: none;
  display: inline;
  margin: ${(props) => props.styleSC.liMargin};
  transform: ${(props) => (props.active ? 'scale(1)' : `scale(${props.scale})`)};
  transition: transform .4s;
`;

const PointListSC = styled('div')`
  display: flex;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 10px;
  margin: auto;
  justify-content: center;
`;

const PointSmallSC = styled('div', ['active'])`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) => (props.active ? 'rgba(251,186,83,1)' : 'rgba(187,187,187,1)')};
  margin-left: 5px;
  margin-right: 5px;
`;

const Slide2D = ({
  styleSC,
  children,
  slideList,
  onChange,
  rowItemInfo,
  activeIndex,
  defaultIndex,
}) => {
  const style = {
    ...styleSC,
  };

  const [_activeIndex, setActiveIndex] = useState(activeIndex ?? defaultIndex ?? 0);
  const [scrollLength, setScrollLength] = useState(null);
  const containerRef = useRef(null);
  const ulRef = useRef(null);
  const listsInfoRef = useRef([]);
  const leftStart = useRef(null);
  const [transitionOpen, setTransitionOpen] = useState(false);
  const [scale, setScale] = useState(0.95);

  useEffect(() => {
    if (typeof activeIndex !== 'number') return;
    setActiveIndex(activeIndex);
    setTimeout(() => {
      setActiveCenterNew(activeIndex);
    });
  }, [activeIndex]);

  useEffect(() => {
    if (typeof defaultIndex !== 'number') return;
    setTimeout(() => {
      setActiveCenterNew(defaultIndex);
    });
  }, []);

  useEffect(() => {
    if (rowItemInfo) {
      const rowWidthTemp = rowItemInfo.width + 2 * rowItemInfo.margin + 2;
      slideList.forEach(() => {
        listsInfoRef.current.push(rowWidthTemp);
      });
      setScrollLength(slideList.length * rowWidthTemp);
    } else {
      let scrollLengthTemp;
      ulRef.current.children.forEach((item) => {
        scrollLengthTemp += item.clientWidth;
        listsInfoRef.current.push(item.clientWidth);
      });
      setScrollLength(scrollLengthTemp);
    }
  }, [slideList]);

  const getActiveWidth = (index) => {
    let width = 0;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < index; i++) {
      width += listsInfoRef.current[i];
    }
    return width;
  };

  const setActiveCenterNew = (index) => {
    const containerWidth = containerRef.current.clientWidth;
    // if (scrollLength <= containerWidth) return;
    // if (getActiveWidth(index) < containerWidth / 2) {
    //   ulRef.current.style.left = 0;
    // } else if (scrollLength - getActiveWidth(index + 1) <= containerWidth / 2) {
    //   ulRef.current.style.left = `${-scrollLength + containerWidth}px`;
    // } else {
    //   ulRef.current.style.left = `${-getActiveWidth(index + 1) + containerWidth / 2 + listsInfoRef.current[index] / 2}px`;
    // }
    ulRef.current.style.left = `${-getActiveWidth(index + 1) + containerWidth / 2 + listsInfoRef.current[index] / 2}px`;
  };

  const handTouchStart = (e) => {
    setTransitionOpen(false);
    setScale(1);
    // eslint-disable-next-line radix,max-len
    leftStart.current = parseInt(ulRef.current.style.left.slice(0, ulRef.current.style.left.length - 2));
  };

  const handleTouchMove = (e) => {
    if (e.direction !== 'left' && e.direction !== 'right') return;
    ulRef.current.style.left = `${leftStart.current + e.x_move}px`;
  };

  const handleTouchEnd = (e) => {
    setScale(0.95);
    setTransitionOpen(true);
    if (e.direction === 'left') {
      onChange({}, moveLeft(), () => {
        setActiveIndex(moveLeft());
        setActiveCenterNew(moveLeft());
      });
      return;
    }
    if (e.direction === 'right') {
      onChange({}, moveRight(), () => {
        setActiveIndex(moveRight());
        setActiveCenterNew(moveRight());
      });
    }
  };

  const moveLeft = () => (_activeIndex + slideList.length + 1) % slideList.length;

  const moveRight = () => (_activeIndex + slideList.length - 1) % slideList.length;

  return (
    <ContainerSC ref={containerRef}>
      <TouchCommon
        on_touchStart={handTouchStart}
        on_touchMove={handleTouchMove}
        on_touchEnd={handleTouchEnd}
      >
        <UlContainerSC>
          <UlSC
            styleSC={style}
            ref={ulRef}
            style={{ left: 0 }}
            transitionOpen={transitionOpen}
          >
            {
              slideList.map((item, index) => (
                // eslint-disable-next-line max-len
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
                <LiSC
                  // onClick={() => {
                  //   onChange(item, index, () => {
                  //     setActiveIndex(index);
                  //     setActiveCenterNew(index);
                  //   });
                  // }}
                  active={_activeIndex === index}
                  key={index}
                  styleSC={style}
                  scale={scale}
                >
                  {
                    React.cloneElement(
                      children,
                      {
                        item,
                        active: _activeIndex === index,
                      },
                    )
                  }
                </LiSC>
              ))
            }
          </UlSC>
        </UlContainerSC>
      </TouchCommon>
      <PointListSC>
        {
          slideList.map((item, index) => (
            <PointSmallSC active={index === _activeIndex} />
          ))
        }
      </PointListSC>
    </ContainerSC>
  );
};

Slide2D.propTypes = {
  styleSC: PropTypes.shape({
  }),
  children: PropTypes.node,
  slideList: PropTypes.arrayOf(PropTypes.any),
  onChange: PropTypes.func,
  rowItemInfo: PropTypes.shape({
    width: PropTypes.number,
    margin: PropTypes.number,
  }) || null,
  activeIndex: PropTypes.number || null,
  defaultIndex: PropTypes.number || null,
};

Slide2D.defaultProps = {
  styleSC: {},
  children: <div />,
  slideList: [],
  onChange: () => { console.log('on change callback'); },
  rowItemInfo: null,
  activeIndex: null,
  defaultIndex: null,
};

export default Slide2D;
