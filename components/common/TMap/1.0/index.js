import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import getConfig from "next/config";


const { publicRuntimeConfig } = getConfig();

const ContainerSC = styled('div')`
  width: 100%;
  height: 100%;
  background: #F2F1ED;
  position: relative;
  z-index: 1000;
`;

const MapSC = styled('div')`
  width: 100%;
  height: 100%;
`;

const BackSC = styled('div')`
  position: absolute;
  top: 20px;
  left: 15px;
  font-size: 22px;
  text-shadow: 2px 2px 3px rgba(0,0,0,.2);
  z-index: 1001;
`;

const TMapReact = ({
  addressPoint,
  showClose,
  showControl,
  styleSC,
  onClose,
}) => {
  const mapRef = useRef(null);
  const script = useRef(document.createElement('script'));
  let map;

  useEffect(() => {
    if (window.TMap) {
      initMap();
    } else {
      loadScript();
      script.current.onload = () => {
        initMap();
      };
    }
    return () => {
      map.destroy();
    };
  }, []);

  const loadScript = () => {
    script.current.type = 'text/javascript';
    script.current.src = 'https://map.qq.com/api/gljs?v=1.exp&key=QFEBZ-XHG3S-RGJOK-6BGPG-NYJXO-3XBZM&callback=init';
    document.body.appendChild(script.current);
  };

  const initMap = () => {
    // 定义地图中心点坐标
    // eslint-disable-next-line no-undef
    const center = new TMap.LatLng(addressPoint.x, addressPoint.y);
    // 定义map变量，调用 TMap.Map() 构造函数创建地图
    // eslint-disable-next-line no-unused-vars
    map = new TMap.Map(mapRef.current, {
      center, // 设置地图中心点坐标
      zoom: 18, // 设置地图缩放级别
      draggable: showControl,
      showControl,
    });
    // 初始化marker
    new TMap.MultiMarker({
      id: 'marker-layer', // 图层id
      map,
      styles: { // 点标注的相关样式
        marker: new TMap.MarkerStyle({
          width: 50,
          height: 50,
          anchor: { x: 16, y: 32 },
          src: `${publicRuntimeConfig.ASSET_PREFIX}/static/mapLogo.png`,
        }),
      },
      geometries: [{ // 点标注数据数组
        id: 'demo',
        styleId: 'marker',
        position: new TMap.LatLng(addressPoint.x, addressPoint.y),
        properties: {
          title: 'marker',
        },
      }],
    });
  };

  return (
    <ContainerSC>
      {
        showClose && (
          <BackSC onClick={() => {
            onClose();
          }}
          >
            <i className="icon-back" />
          </BackSC>
        )
      }
      <MapSC ref={mapRef} />
    </ContainerSC>
  );
};

TMapReact.propTypes = {
  addressPoint: PropTypes.shape({}),
  showClose: PropTypes.bool,
  showControl: PropTypes.bool,
  styleSC: PropTypes.shape({}),
  onClose: PropTypes.func,
};

TMapReact.defaultProps = {
  addressPoint: {
    x: 30.280125,
    y: 120.001544,
  },
  showClose: true,
  showControl: true,
  styleSC: {},
  onClose: () => {},
};

export default TMapReact;
