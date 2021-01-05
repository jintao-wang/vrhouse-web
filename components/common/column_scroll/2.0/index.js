import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { GetObjectId } from '../../../../util/closures';
import { AnimateJS } from '../../../../util/common';

const ContainerSC = styled('div')`
  position: relative;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
`;

const UlSC = styled('ul')`
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 0;
  margin: 0; 
`;

const ColumnScroll = ({
  children,
  scrollList,
  onChange,
  activeItem,
}) => {
  const containerRef = useRef(null);
  const getObject = useRef(GetObjectId());
  const listsInfoRef = useRef([]);
  const scrollTotalHeight = useRef(null);
  const ulRef = useRef(null);

  useEffect(() => {
    console.log('initial');
    return () => {
      getObject.current();
    };
  }, []);

  useEffect(() => {
    if (!scrollList || scrollList.length === 0) return;
    let rowHeightTemp = 0;
    listsInfoRef.current = [];
    ulRef.current.children.forEach((item) => {
      rowHeightTemp += item.clientHeight;
      listsInfoRef.current.push(item.clientHeight);
    });
    scrollTotalHeight.current = rowHeightTemp;
  }, [scrollList]);

  const scrollAnimate = (totalScrollTop) => {
    const preScrollTop = ulRef.current.scrollTop;
    AnimateJS({
      duration: 400,
      timing: (timeFraction) => timeFraction,
      draw: (progress) => {
        // eslint-disable-next-line max-len
        ulRef.current.scrollTop = preScrollTop + (totalScrollTop - preScrollTop) * progress;
      },
    });
  };

  const getActiveHeight = (index) => {
    let height = 0;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < index; i++) {
      height += listsInfoRef.current[i];
    }
    return height;
  };

  const setActiveCenter = (index) => {
    const containerHeight = containerRef.current.clientHeight;
    if (scrollTotalHeight.current <= containerHeight) return;
    if (getActiveHeight(index) < containerHeight / 2) {
      scrollAnimate(0);
    } else if (scrollTotalHeight.current - getActiveHeight(index + 1) <= containerHeight / 2) {
      scrollAnimate(scrollTotalHeight.current - containerHeight);
    } else {
      // eslint-disable-next-line max-len
      scrollAnimate(getActiveHeight(index + 1) - containerHeight / 2 - listsInfoRef.current[index] / 2);
    }
  };

  return (
    <ContainerSC ref={containerRef}>
      <UlSC ref={ulRef}>
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
    </ContainerSC>
  );
};

ColumnScroll.propTypes = {
  styleSC: PropTypes.shape({
  }),
  children: PropTypes.node,
  scrollList: PropTypes.arrayOf(PropTypes.shape({})),
  onChange: PropTypes.func,
  activeItem: PropTypes.shape({}),
};

ColumnScroll.defaultProps = {
  styleSC: {},
  children: <div />,
  scrollList: [],
  onChange: () => { console.log('on change callback'); },
  activeItem: {},
};

export default ColumnScroll;
