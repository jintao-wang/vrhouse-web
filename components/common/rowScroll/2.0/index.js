import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ContainerSC = styled('div', ['styleSC'])`
    position: relative;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const UlContainerSC = styled('div')`
    height: 100%;
    flex: 1;
    display: flex;
    align-items: center;
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
    

    li {
     list-style: none;
     display: inline-block;
     margin: ${(props) => props.styleSC.liMargin};
     cursor: pointer;
    }
`;

const RowScroll = ({
  styleSC, children, scrollList, onChange, rowItemInfo, activeIndex,
}) => {
  const [_activeIndex, setActiveIndex] = useState(activeIndex);
  const containerRef = useRef(null);
  const ulRef = useRef(null);
  const [scrollLength, setScrollLength] = useState(null);
  const style = {
    ...styleSC,
  };
  const listsInfoRef = useRef([]);

  useEffect(() => {
    setTimeout(() => {
      setActiveIndex(activeIndex);
      setActiveCenterNew(activeIndex);
      if (activeIndex === -1) {
        setActiveCenterNew(0);
      }
    });
  }, [activeIndex]);

  useEffect(() => {
    if (rowItemInfo) {
      const rowWidthTemp = rowItemInfo.width + 2 * rowItemInfo.margin + 2;
      scrollList.forEach(() => {
        listsInfoRef.current.push(rowWidthTemp);
      });
      setScrollLength(scrollList.length * rowWidthTemp);
    } else {
      let scrollLengthTemp;
      ulRef.current.children.forEach((item) => {
        scrollLengthTemp += item.clientWidth;
        listsInfoRef.current.push(item.clientWidth);
      });
      setScrollLength(scrollLengthTemp);
    }
  }, [scrollList]);

  const animate = ({ timing, draw, duration }) => {
    const start = performance.now();
    // eslint-disable-next-line no-shadow
    requestAnimationFrame(function animate(time) {
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;

      const progress = timing(timeFraction);
      draw(progress); // 绘制

      if (timeFraction < 1) {
        // eslint-disable-next-line no-unused-vars
        requestAnimationFrame(animate);
      }
    });
  };

  const scrollAnimate = (totalScrollLeft) => {
    const preScrollLeft = ulRef.current.scrollLeft;
    animate({
      duration: 400,
      timing: (timeFraction) => timeFraction,
      draw: (progress) => {
        // eslint-disable-next-line max-len
        ulRef.current.scrollLeft = preScrollLeft + (totalScrollLeft - preScrollLeft) * progress;
      },
    });
  };

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
    if (scrollLength <= containerWidth) return;
    if (getActiveWidth(index) < containerWidth / 2) {
      scrollAnimate(0);
    } else if (scrollLength - getActiveWidth(index + 1) <= containerWidth / 2) {
      scrollAnimate(scrollLength - containerWidth);
    } else {
      // eslint-disable-next-line max-len
      scrollAnimate(getActiveWidth(index + 1) - containerWidth / 2 - listsInfoRef.current[index] / 2);
    }
  };

  return (
    <ContainerSC styleSC={style} ref={containerRef}>
      <UlContainerSC styleSC={style}>
        <UlSC styleSC={style} ref={ulRef}>
          {
            scrollList.map((item, index) => (
              // eslint-disable-next-line max-len
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
              <li
                onClick={() => {
                  onChange(item, index, () => {
                    setActiveIndex(index);
                    setActiveCenterNew(index);
                  });
                }}
                key={index}
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
              </li>
            ))
          }
        </UlSC>
      </UlContainerSC>
    </ContainerSC>
  );
};

RowScroll.propTypes = {
  styleSC: PropTypes.shape({
  }),
  children: PropTypes.node,
  scrollList: PropTypes.arrayOf(PropTypes.any),
  onChange: PropTypes.func,
  rowItemInfo: PropTypes.shape({
    width: PropTypes.number,
    margin: PropTypes.number,
  }) || null,
  activeIndex: PropTypes.number,
};

RowScroll.defaultProps = {
  styleSC: {},
  children: <div />,
  scrollList: [],
  onChange: () => { console.log('on change callback'); },
  rowItemInfo: null,
  activeIndex: 0,
};

export default RowScroll;
