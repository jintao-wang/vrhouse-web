import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { AnimateJS } from '../../../util/common';
import { GetObjectId } from '../../../util/closures';

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

const UlSC = styled('ul', ['styleSC', 'liMargin'])`
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
     margin: ${(props) => props.liMargin}px;
     cursor: pointer;
    }
`;

const RowScroll = ({
  styleSC,
  children,
  scrollList,
  onChange,
  activeItem,
  liMargin,
}) => {
  const containerRef = useRef(null);
  const getObject = useRef(GetObjectId());
  const ulRef = useRef(null);
  const scrollTotalWidth = useRef(null);
  const style = {
    ...styleSC,
  };
  const listsInfoRef = useRef([]);

  useEffect(() => {
    if (!scrollList || scrollList.length === 0) return;
    let rowWidthTemp = 0;
    listsInfoRef.current = [];
    ulRef.current.children.forEach((item) => {
      rowWidthTemp += item.clientWidth + (2 * liMargin);
      listsInfoRef.current.push(item.clientWidth + (2 * liMargin));
    });
    scrollTotalWidth.current = rowWidthTemp;
  }, [scrollList]);

  const scrollAnimate = (totalScrollLeft) => {
    const preScrollLeft = ulRef.current.scrollLeft;
    AnimateJS({
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

  const setActiveCenter = (index) => {
    const containerWidth = containerRef.current.clientWidth;
    if (scrollTotalWidth.current <= containerWidth) return;
    if (getActiveWidth(index) < containerWidth / 2) {
      scrollAnimate(0);
    } else if (scrollTotalWidth.current - getActiveWidth(index + 1) <= containerWidth / 2) {
      scrollAnimate(scrollTotalWidth.current - containerWidth);
    } else {
      // eslint-disable-next-line max-len
      scrollAnimate(getActiveWidth(index + 1) - containerWidth / 2 - listsInfoRef.current[index] / 2);
    }
  };

  return (
    <ContainerSC styleSC={style} ref={containerRef}>
      <UlContainerSC styleSC={style}>
        <UlSC styleSC={style} ref={ulRef} liMargin={liMargin}>
          {
            scrollList.map((item, index) => (
              // eslint-disable-next-line max-len
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
              <li
                key={getObject.current(item)}
                onClick={() => {
                  onChange(item);
                  setActiveCenter(index);
                }}
              >
                {
                  React.cloneElement(
                    children,
                    {
                      item,
                      active: activeItem === item,
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
  liMargin: PropTypes.number,
  children: PropTypes.node,
  scrollList: PropTypes.arrayOf(PropTypes.any),
  onChange: PropTypes.func,
  activeItem: PropTypes.shape({}),
};

RowScroll.defaultProps = {
  styleSC: {},
  liMargin: 0,
  children: <div />,
  scrollList: [],
  onChange: () => { console.log('on change callback'); },
  activeItem: {},
};

export default RowScroll;
