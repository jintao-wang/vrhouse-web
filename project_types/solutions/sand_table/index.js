import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const ContainerSC = styled('div', ['sandImg'])`
  width: 100vw;
  height: 100vh;
  background: url(${(props) => props.sandImg}) no-repeat center / cover;
  position: relative;
  overflow: hidden;
`;

const PointSC = styled('div', ['left', 'bottom', 'rotate', 'selected'])`
  width: 20px;
  height: 80px;
  background: orange;
  position: absolute;
  left: ${(props) => props.left || 0}px;
  bottom: ${(props) => props.bottom || 0}px;
  transform: rotate(${(props) => props.rotate || 0}deg);
  border: ${(props) => (props.selected ? '1px solid #000' : '1px solid rgba(0,0,0,0)')};
  transition: border .2s;
  cursor: pointer;
`;

const PannerSC = styled('div')`
  width: 300px;
  position: fixed;
  left: 20px;
  top: 20px;
  background: rgba(0,0,0,.2);
  box-shadow: 0 0 6px 1px rgba(0,0,0,.4);
  box-sizing: border-box;
  padding: 10px 15px 0 15px;
  
  .item {
    margin-bottom: 10px;
    
    .label {
      margin-right: 10px;
    }
  }
`;

const SandTable = () => {
  const [sandImg, setSandImg] = useState('http://webresource.123kanfang.com/Solution/travel-test/static/img/sandbox_pc.8b3f413.jpg');
  const [containerWidth, setContainerWidth] = useState(window.innerWidth);
  const [containerHeight, setContainerHeight] = useState(window.innerHeight);
  const [imgInfo, setImgInfo] = useState({});
  const [points, setPoints] = useState([
    {
      left: {
        value: 493.2433822454053,
        offset: 10,
      },
      bottom: {
        value: 328.01897983392644,
        offset: 0,
      },
      rotate: 0,
    },
    {
      left: {
        value: 780,
        offset: 10,
      },
      bottom: {
        value: 330,
        offset: 40,
      },
      rotate: 55,
    },
    {
      left: {
        value: 480,
        offset: 10,
      },
      bottom: {
        value: 150,
        offset: 40,
      },
      rotate: -55,
    },
    {
      left: {
        value: 895.1343050748304,
        offset: 10,
      },
      bottom: {
        value: 348.8196915776986,
        offset: 40,
      },
      rotate: 55,
    },
  ]);
  const [activePoint, setActivePoint] = useState(null);
  const [pannerInfo, setPannerInfo] = useState(null);
  const [moveInfo, setMoveInfo] = useState({
    mouseDown: false,
    sourceLeft: null,
    sourceBottom: null,
    x: null,
    x_move: null,
    x_gap: 0,
    y: null,
    y_move: null,
    y_gap: 0,
  });
  const pointRef = useRef(null);

  useEffect(() => {
    getImgInfo();
  }, []);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setContainerWidth(window.innerWidth);
      setContainerHeight(window.innerHeight);
    });
  }, []);

  const getImgInfo = () => {
    const image = new Image();
    let width; let height;
    image.src = sandImg;
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

  const handleSelect = (point, index) => {
    const newPoint = JSON.parse(JSON.stringify(point));
    points.splice(index, 1);
    setPoints([...points]);
    // eslint-disable-next-line no-param-reassign
    newPoint.left.value = left(newPoint.left.value, newPoint.left.offset);
    // eslint-disable-next-line no-param-reassign
    newPoint.bottom.value = bottom(newPoint.bottom.value, newPoint.bottom.offset);
    setActivePoint(newPoint);
    setTimeout(() => {
      pointRef.current.style.left = `${newPoint.left.value}px`;
      pointRef.current.style.bottom = `${newPoint.bottom.value}px`;
      moveInfo.sourceLeft = newPoint.left.value;
      moveInfo.sourceBottom = newPoint.bottom.value;
    });
  };

  const onTouchStart = (e) => {
    moveInfo.mouseDown = true;
    moveInfo.x = e.clientX;
    moveInfo.y = e.clientY;
  };

  const onTouchMove = (e) => {
    if (!moveInfo.mouseDown) return;
    pointRef.current.style.left = `${moveInfo.sourceLeft + e.clientX - moveInfo.x}px`;
    pointRef.current.style.bottom = `${moveInfo.sourceBottom - e.clientY + moveInfo.y}px`;
    moveInfo.x_move = e.clientX - moveInfo.x;
    moveInfo.y_move = e.clientY - moveInfo.y;
  };

  const onTouchEnd = () => {
    if (!moveInfo.mouseDown) return;
    // eslint-disable-next-line max-len
    activePoint.left.value = getLeftParameter(moveInfo.sourceLeft + moveInfo.x_move, activePoint.left.offset);
    // eslint-disable-next-line max-len
    activePoint.bottom.value = getBottomParameter(moveInfo.sourceBottom - moveInfo.y_move, activePoint.bottom.offset);
    setPannerInfo(activePoint);
    points.push(activePoint);
    setActivePoint(null);
    setMoveInfo({
      mouseDown: false,
      x: null,
      x_move: null,
      x_gap: 0,
      y: null,
      y_move: null,
      y_gap: 0,
    });
  };

  // eslint-disable-next-line no-shadow
  const left = (left, offsetWidth = 0) => {
    // eslint-disable-next-line max-len,no-mixed-operators
    // if (containerHeight / containerWidth < imgInfo.height / imgInfo.width) return containerWidth / 2 - (1125 / 2 - left) / 1125 * containerWidth - offsetWidth;
    // eslint-disable-next-line max-len
    if (containerHeight / containerWidth < imgInfo.height / imgInfo.width) return (left / 1125 - 3 / 2) * containerWidth - offsetWidth;
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

  const getLeftParameter = (leftActual, offsetWidth = 0) => {
    // eslint-disable-next-line max-len
    if (containerHeight / containerWidth < imgInfo.height / imgInfo.width) {
      return ((leftActual + offsetWidth) / containerWidth + 3 / 2) * 1125;
    }
    // eslint-disable-next-line max-len,no-mixed-operators
    return 1125 / 2 - (containerWidth / 2 - offsetWidth - leftActual) / containerHeight * (imgInfo.height / imgInfo.width) * 1125;
  };

  const getBottomParameter = (bottomActual, offsetHeight = 0) => {
    // eslint-disable-next-line max-len,no-mixed-operators
    if (containerHeight / containerWidth >= imgInfo.height / imgInfo.width) {
      return (bottomActual + offsetHeight) * 835 / containerHeight;
    }
    // eslint-disable-next-line max-len
    return 835 / 2 - (835 / containerWidth) * (imgInfo.width / imgInfo.height) * (containerHeight / 2 - offsetHeight - bottomActual);
  };
  return (
    <ContainerSC sandImg={sandImg} onMouseUp={onTouchEnd} onMouseMove={onTouchMove}>
      <PannerSC>
        <div className="item">
          <span className="label">Left:</span>
          <span>{pannerInfo?.left.value}</span>
        </div>
        <div className="item">
          <span className="label">OffsetLeft:</span>
          <span>{pannerInfo?.left.offset}</span>
        </div>
        <div className="item">
          <span className="label">Bottom:</span>
          <span>{pannerInfo?.bottom.value}</span>
        </div>
        <div className="item">
          <span className="label">OffsetBottom:</span>
          <span>{pannerInfo?.bottom.offset}</span>
        </div>
        <div className="item">
          <span className="label">Rotate:</span>
          <span>{pannerInfo?.rotate}</span>
        </div>
      </PannerSC>
      { points.map((point, index) => point === activePoint || (
        <PointSC
          left={left(point.left.value, point.left.offset)}
          bottom={bottom(point.bottom.value, point.bottom.offset)}
          rotate={point.rotate}
          key={point.left.value / point.bottom.value}
          onDoubleClick={() => handleSelect(point, index)}
          selected={false}
        />
      ))}
      {
        activePoint && (
          <PointSC
            ref={pointRef}
            rotate={activePoint.rotate}
            key={activePoint.left.value / activePoint.bottom.value}
            onDoubleClick={() => handleSelect(activePoint)}
            selected
            onMouseDown={onTouchStart}
            onMouseUp={onTouchEnd}
            onMouseMove={onTouchMove}
            // onMouseLeave={onTouchEnd}
          />
        )
      }

    </ContainerSC>
  );
};

export default SandTable;
