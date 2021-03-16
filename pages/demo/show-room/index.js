import React, { useRef, useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import * as THREE from 'three';
import { MapControls } from '../../../projects/demo/show_room/_sdk/OrbitControls';
import CommonHeader from '../../../components/common_header';
import ShowRoomControl from '../../../projects/demo/show_room/_sdk/controls';
import Title from '../../../components/title/2.0';
import Animation from '../../../components/animation/2.0';
import Slide3D from '../../../components/slide_3d/1.0';
import ShowRoomPanel from '../../../projects/demo/show_room/components/show_room_panel/ShowRoomPanel';
import RegionPanel from '../../../projects/demo/show_room/components/region_panel/RegionPanel';
import { getUrlParameter, UUID8Bit } from '../../../tools/common';
import { default as ThreeApp } from '../../../projects/demo/show_room/_sdk/app';

const bookedMaterial = new THREE.MeshPhongMaterial({
  color: 'rgb(160,160,160)',
});

export default () => {
  const [mode, setMode] = useState('3D');
  const [isSlide3D, setSlide3D] = useState(false);
  const [isShowRoomPanel, setShowRoomPanel] = useState(false);
  const [regions, setAllRegions] = useState(null);
  const [showRoomPanelInfo, setShowRoomPanelInfo] = useState({
    code: null,
    number: null,
    size: [],
    area: null,
    price: null,
  });
  const [isCurrentBooked, setCurrentBooked] = useState(false);
  const [selectedShowRoomId, setSelectedShowRoomId] = useState(null);
  const [bookedShowRoomsId, setBookedShowRoomsId] = useState([]);
  const showRoomControl = useRef(null);
  const threeApp = useRef(null);

  const threeRef = useRef(null);
  useEffect(() => {
    const initial = async () => {
      const packageId = getUrlParameter('packageId');
      const domain = getUrlParameter('domain');
      const showRoomDataRes = await fetch(`${domain}${packageId}/ShowRoomData.json?${UUID8Bit()}`);
      const showRoomData = await showRoomDataRes.json();
      threeApp.current = new ThreeApp({
        mode,
        renderDom: threeRef.current,
        showRoomData,
        webCallback: {
          getShowRoomControl: (_showRoomControl) => {
            showRoomControl.current = _showRoomControl;
          },
          onSelectCancel: () => {
            setSelectedShowRoomId(null);
            setShowRoomPanel(false);
          },
          onSelected: ({
            showRoomId,
            displayInfo,
            booked,
          }) => {
            setSelectedShowRoomId(showRoomId);
            setShowRoomPanel(true);
            setShowRoomPanelInfo(displayInfo);
            setCurrentBooked(booked);
          },
        },
      });
      setAllRegions(showRoomData);
    };
    initial();
  }, []);

  const handleBook = () => {
    ThreeApp.selectedShowRoom.material = bookedMaterial;
    ThreeApp.selectedShowRoom.booked = true;
    const id = Symbol.for('showRoomId');
    bookedShowRoomsId.push(ThreeApp.selectedShowRoom[id]);
    setCurrentBooked(true);
  };

  const handleView = (showRoomId) => {
    const id = Symbol.for('showRoomId');
    // 再次点击已经原则的展位
    if (ThreeApp.selectedShowRoom && ThreeApp.selectedShowRoom[id] === showRoomId) return;

    // 复原上一个点击的展位材质
    if (ThreeApp.selectedShowRoom) {
      ThreeApp.selectedShowRoom.material.opacity = 1;
    }

    // 复原上一个选择的不同的展位
    if (ThreeApp.selectedShowRoom) {
      // eslint-disable-next-line max-len
      ThreeApp.selectedShowRoom.position.set(
        ThreeApp.selectedShowRoom.position.x,
        ThreeApp.selectedShowRoom.position.y - 150,
        ThreeApp.selectedShowRoom.position.z,
      );
      const textPositionPre = ThreeApp.selectedShowRoom.text.position;
      textPositionPre.set(
        textPositionPre.x,
        textPositionPre.y - 150,
        textPositionPre.z,
      );
    }

    const materialClone = showRoomControl.current.showRooms[showRoomId].showRoom3D.material.clone();
    materialClone.opacity = 0.75;
    showRoomControl.current.showRooms[showRoomId].showRoom3D.material = materialClone;

    setSelectedShowRoomId(showRoomControl.current.showRooms[showRoomId].showRoom3D[id]);
    setShowRoomPanel(true);
    setShowRoomPanelInfo(showRoomControl.current.showRooms[showRoomId].showRoom3D.displayInfo);
    setShowRoomPanelInfo(showRoomControl.current.showRooms[showRoomId].showRoom3D.displayInfo);
    setCurrentBooked(showRoomControl.current.showRooms[showRoomId].showRoom3D.booked);
    setCurrentBooked(showRoomControl.current.showRooms[showRoomId].showRoom3D.booked);
    ThreeApp.selectedShowRoom = showRoomControl.current.showRooms[showRoomId].showRoom3D;
    ThreeApp.selectedShowRoom.position.set(
      ThreeApp.selectedShowRoom.position.x,
      ThreeApp.selectedShowRoom.position.y + 150,
      ThreeApp.selectedShowRoom.position.z,
    );
    const textPosition = ThreeApp.selectedShowRoom.text.position;
    textPosition.set(textPosition.x, textPosition.y + 150, textPosition.z);
  };

  const switchMode = (_mode) => {
    if (mode === _mode) return;
    setMode(_mode);
    if (_mode === '2D') {
      threeApp.current.switchMode(_mode);
    } else if (_mode === '3D') {
      threeApp.current.switchMode(_mode);
    }
  };

  return (
    <>
      <CommonHeader title="展会" />
      <ContainerSC>
        <ThreeContainerSC ref={threeRef} />
        <Title
          titleName="上海国际汽车改装博览会"
          onChange={setSlide3D}
        />
        <Animation visible={isSlide3D}>
          <Slide3DSC>
            <Slide3D />
          </Slide3DSC>
        </Animation>
        {
          isShowRoomPanel && (
            <ShowRoomPanelContainerSC>
              <ShowRoomPanel
                showRoomPanelInfo={showRoomPanelInfo}
                onBook={handleBook}
                booked={isCurrentBooked}
              />
            </ShowRoomPanelContainerSC>
          )
        }
        <RegionPanelContainerSC>
          <RegionPanel
            regions={regions}
            selectedShowRoomId={selectedShowRoomId}
            bookedShowRoomsId={bookedShowRoomsId}
            onView={handleView}
          />
        </RegionPanelContainerSC>
        <SwitchModeContainerSC>
          <SwitchModeBackgroundSC is2D={mode === '2D'} />
          <SwitchModeSC active={mode === '2D'} onClick={() => switchMode('2D')}>
            <svg
              width="18px"
              height="18px"
              viewBox="0 0 20 20"
              className="icon"
            >
              <g stroke="none" strokeWidth="1" fillRule="evenodd">
                <g transform="translate(-862.000000, -1016.000000)" fill={mode === '2D' ? '#00A1FC' : '#ffffff'} fillRule="nonzero" stroke={mode === '2D' ? '#00A1FC' : '#ffffff'} strokeWidth="0.5">
                  <g transform="translate(844.000000, 1002.000000)">
                    <g transform="translate(7.000000, 7.000000)">
                      <g transform="translate(11.000000, 7.000000)">
                        <path d="M13.2117887,7.3242204 L18.0219878,7.3242204 L18.0754374,18.0748979 L13.2117887,18.0160911 L13.2117887,14.8085263 C13.2195875,14.6644947 13.1657874,14.5239404 13.0638168,14.4219454 C12.9618461,14.3199503 12.8213253,14.2661374 12.6773281,14.2739381 C12.5333308,14.2661374 12.39281,14.3199503 12.2908394,14.4219454 C12.1888687,14.5239404 12.1350686,14.6644947 12.1428674,14.8085263 L12.1428674,18.0160911 L1.98800858,18.0160911 L1.98800858,10.5317674 L5.19480797,10.5317674 C5.48998244,10.5317674 5.72926862,10.2924241 5.72926862,9.99717919 C5.72926862,9.70193428 5.48998244,9.46259098 5.19480797,9.46259098 L1.98800858,9.46259098 L1.98800858,1.97828508 L4.66034732,1.97828508 C4.95552669,1.97828508 5.19481685,1.73893781 5.19481685,1.44368799 C5.19481685,1.14843818 4.95552669,0.909090909 4.66034732,0.909090909 L1.40009831,0.909090909 C1.13780376,0.935037929 0.933582381,1.14837617 0.919051778,1.41161235 L0.919051778,18.5774016 C0.88879857,18.7142835 0.92842181,18.8572602 1.02481238,18.9590285 C1.12120295,19.0607968 1.26179728,19.1080922 1.40008056,19.0852675 L18.6098803,19.0852675 C18.8257813,18.966271 18.9952552,18.7779272 19.0909091,18.5506793 L19.0909091,6.78961444 C18.974855,6.55856828 18.7874256,6.37110034 18.5564307,6.25502624 L13.2117887,6.25502624 L13.2117887,1.44367912 C13.1390573,1.14363577 12.8785987,0.9265375 12.5704288,0.909090909 L8.40160736,0.909090909 C8.106428,0.909090909 7.86713784,1.14843818 7.86713784,1.44368799 C7.86713784,1.73893781 8.106428,1.97828508 8.40160736,1.97828508 L12.1428674,1.97828508 L12.1428674,9.46259098 L10.0050071,9.48931329 C9.86932614,9.47753444 9.73568243,9.52829611 9.64201704,9.6271872 C9.54835164,9.72607829 9.50489277,9.86229994 9.52397828,9.99717919 C9.50520382,10.1315155 9.54896746,10.2670542 9.64275218,10.3650292 C9.7365369,10.4630043 9.87001397,10.5126256 10.0050071,10.4997006 L13.2118065,10.5317674 C13.3186879,10.5317674 13.2118065,10.6547255 13.2118065,10.5317674 L13.2118065,7.3242204 L13.2117887,7.3242204 Z" id="路径" />
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            </svg>
            <span>平面图</span>
          </SwitchModeSC>
          <SwitchModeSC active={mode === '3D'} onClick={() => switchMode('3D')}>
            <svg
              width="18px"
              height="18px"
              viewBox="0 0 20 20"
              className="icon"
            >
              <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g transform="translate(-971.000000, -1016.000000)" fill={mode === '3D' ? '#00A1FC' : '#ffffff'} fillRule="nonzero" stroke={mode === '3D' ? '#00A1FC' : '#ffffff'} strokeWidth="0.5">
                  <g transform="translate(844.000000, 1002.000000)">
                    <g transform="translate(127.000000, 14.000000)">
                      <g transform="translate(1.111111, 0.000000)">
                        <path d="M16.9246032,4.78423215 L9.18650794,0.356865073 C9.00234063,0.251415346 8.77543715,0.251415346 8.59126984,0.356865073 L0.853174603,4.78423215 C0.669196008,4.88957367 0.555773457,5.08417198 0.555555556,5.29485515 L0.555555556,14.1495893 C0.555773457,14.3602725 0.669196008,14.5548708 0.853174603,14.6602123 L8.62996032,19.0875794 C8.81412763,19.1930291 9.04103111,19.1930291 9.22519841,19.0875794 L16.9246032,14.6602123 C17.1085818,14.5548708 17.2220043,14.3602725 17.2222222,14.1495893 L17.2222222,5.29485515 C17.2220043,5.08417198 17.1085818,4.88957367 16.9246032,4.78423215 Z M16.031746,13.8101578 L8.92460317,17.8951418 L1.74603175,13.8072062 L1.74603175,5.6372382 L8.88888889,1.5493026 L16.031746,5.6372382 L16.031746,13.8101578 Z M3.78584748,6.53716252 C3.6101178,6.42700319 3.38728873,6.42071518 3.20545832,6.52078454 C3.0236279,6.6208539 2.91206871,6.81117062 2.91483478,7.01649081 C2.91770518,7.22181099 3.03444715,7.40908049 3.21895756,7.50426015 L8.32096679,10.4167333 L8.32096679,15.9649668 C8.32096679,16.2737028 8.57477205,16.5239828 8.88785671,16.5239828 C9.20094136,16.5239828 9.45474662,16.2737028 9.45474662,15.9649668 L9.45474662,10.4167333 L14.5567558,7.50426015 C14.8131333,7.3435453 14.8954613,7.01210429 14.7434289,6.7527413 C14.5913964,6.49337832 14.2590539,6.39830199 13.9898659,6.53716252 L8.88785671,9.44963572 L3.78584748,6.53716252 Z" id="形状" />
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            </svg>
            <span>3D展馆</span>
          </SwitchModeSC>
        </SwitchModeContainerSC>
      </ContainerSC>
    </>
  );
};

const ContainerSC = styled('div')`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

const ThreeContainerSC = styled('div')`
  border: none;
  cursor: pointer;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #EEEEEE;
`;

const opacityFadeIn = keyframes`
  0% {
     opacity: 0;
  }
  100% {
     opacity: 1;
  }
`;

const opacityFadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const opacityFadeCss = (aniTrigger) => {
  if (aniTrigger) return css` ${opacityFadeIn} .2s forwards`;
  return css` ${opacityFadeOut} .2s forwards`;
};

const Slide3DSC = styled('div', ['aniTrigger'])`
  animation: ${(props) => opacityFadeCss(props.aniTrigger)};
`;

const ShowRoomPanelContainerSC = styled.div`
  width: 240px;
  position: absolute;
  right: 30px;
  top: 50px;
`;

const RegionPanelContainerSC = styled.div`
  width: 260px;
  position: absolute;
  left: 45px;
  top: 50px;
`;

const SwitchModeContainerSC = styled.div`
  padding: 8px;
  border-radius: 4px;
  background: rgba(27, 34, 40, 0.8);
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  margin: auto;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  width: fit-content;
`;

const SwitchModeBackgroundSC = styled('div', ['is2D'])`
  position: absolute;
  width: 90px;
  height: 28px;
  background: rgba(0, 161, 252, 0.2);
  left: ${(props) => (props.is2D ? '8px' : '98px')};
  border-radius: 2px;
  cursor: pointer;
  transition: left .4s;
  
`;

const SwitchModeSC = styled('div', ['active'])`
  display: flex;
  width: 90px;
  height: 28px;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: ${(props) => (props.active ? '#00A1FC' : '#FFFFFF')};
  cursor: pointer;

  .icon {
    margin-right: 5px;
    margin-top: -1px;
  }
`;
