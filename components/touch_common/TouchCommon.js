import React, { useRef } from 'react';
import PropTypes from 'prop-types';

const directionMap = {
  '-1': 'short',
  0: 'notMoved',
  1: 'up',
  2: 'down',
  3: 'left',
  4: 'right',
};

const TouchCommon = ({
  children,
  on_touchStart,
  on_touchMove,
  on_touchEnd,
}) => {
  const moveInfo = useRef({
    x_start: null,
    x_end: null,
    x_move: 0,
    y_start: null,
    y_end: null,
    y_move: 0,
  });

  // eslint-disable-next-line camelcase,no-mixed-operators
  const getAngle = (x_move, y_move) => Math.atan2(y_move, x_move) * 180 / Math.PI;

  // 根据起点终点返回方向 1向上 2向下 3向左 4向右 0未滑动 -1滑动距离过短
  // eslint-disable-next-line camelcase
  const getDirection = (x_move, y_move) => {
    let result = 0;
    // 如果滑动距离太短
    if (Math.abs(x_move) < 2 && Math.abs(y_move) < 2) {
      return -1;
    }

    const angle = getAngle(x_move, y_move);
    if (angle >= -135 && angle <= -45) {
      result = 1;
    } else if (angle > 45 && angle < 135) {
      result = 2;
    } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
      result = 3;
    } else if (angle >= -45 && angle <= 45) {
      result = 4;
    }

    return result;
  };

  const handTouchStart = (e) => {
    moveInfo.current.x_start = e.touches[0].pageX;
    moveInfo.current.y_start = e.touches[0].pageY;
    on_touchStart({
      x_start: moveInfo.current.x_start,
      y_start: moveInfo.current.y_start,
      touches: e.touches,
      event: e,
    });
  };

  const handleTouchMove = (e) => {
    moveInfo.current.x_move = e.touches[0].pageX - moveInfo.current.x_start;
    moveInfo.current.y_move = e.touches[0].pageY - moveInfo.current.y_start;
    const direction = getDirection(
      moveInfo.current.x_move,
      moveInfo.current.y_move,
    );

    // console.log(directionMap[direction]);

    on_touchMove({
      x_move: moveInfo.current.x_move,
      y_move: moveInfo.current.y_move,
      x_current: e.touches[0].pageX,
      y_current: e.touches[0].pageY,
      directionCode: direction,
      direction: directionMap[direction],
      touches: e.touches,
      event: e,
    });
  };

  const handTouchEnd = (e) => {
    moveInfo.current.x_end = e.changedTouches[0].pageX;
    moveInfo.current.y_end = e.changedTouches[0].pageY;

    const direction = getDirection(
      moveInfo.current.x_end - moveInfo.current.x_start,
      moveInfo.current.y_end - moveInfo.current.y_start,
    );

    on_touchEnd({
      directionCode: direction,
      direction: directionMap[direction],
      x_move: moveInfo.current.x_move,
      y_move: moveInfo.current.y_move,
      touches: e.touches,
      event: e,
    });

    moveInfo.current = {
      x_start: null,
      x_end: null,
      x_move: 0,
      y_start: null,
      y_end: null,
      y_move: 0,
    };
  };

  return (
    React.cloneElement(
      children,
      {
        // ref: touchRef,
        onTouchStart: handTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handTouchEnd,
      },
    )
  );
};

TouchCommon.prototype = {
  children: PropTypes.node,
  on_touchStart: PropTypes.func,
  on_touchMove: PropTypes.func,
  on_touchEnd: PropTypes.func,
};

TouchCommon.defaultProps = {
  children: <div />,
  on_touchStart: () => {},
  on_touchMove: () => {},
  on_touchEnd: () => {},
};
export default TouchCommon;
