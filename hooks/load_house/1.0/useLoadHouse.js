import { useEffect, useRef, useState } from 'react';
import NameConverter from '../../../tools/nameConverter';
import Resource from '../../../tools/resource';
import VRHouse from '../../../tools/vrHouse';

const useLoadHouse = ({
  mainContainer,
  setViewState,
  setActivePanner,
  setChangingPanorama,
  onLoaded,
  houseInfo,
}) => {
  const [loadState, setLoadState] = useState('loadStart');
  const currentHotInfo = useRef(null);
  const viewDataModel = useRef(null);
  const isFirstLoad = useRef(true);
  const activePackageId = useRef(null);
  const vrHouse = useRef(null);
  const [loadPercent, setLoadPercent] = useState(0);

  useEffect(() => {
    document.addEventListener('LoadingProgress', (event) => {
      setLoadPercent(Math.floor(event.progress * 100));
    }, false);
  }, []);

  useEffect(() => {
    if (!mainContainer) return;
    vrHouse.current = new VRHouse(houseInfo.packageId, houseInfo.domain);
    setLoadState('loadStart');
    getViewData().then((data) => {
      const { viewDataString, editDataString } = data;
      // eslint-disable-next-line no-undef
      HouseViewer.BaseAPI.initNameConvert(NameConverter);
      initBaseView(viewDataString, editDataString);
    });
  }, [mainContainer, houseInfo.packageId, houseInfo.domain]);

  const getViewData = async () => {
    const viewDataPromise = fetch(vrHouse.current.getViewDataUrl());
    const singleViewDataPromise = fetch(vrHouse.current.getSingleViewDataUrl());
    const editDataPromise = fetch(vrHouse.current.getEditDataUrl());
    return new Promise((resolve, reject) => {
      Promise.all([viewDataPromise, singleViewDataPromise, editDataPromise])
        .then(async (results) => {
          let viewDataString;
          let editDataString;
          const viewDataRes = await results[0];
          const singleViewDataRes = await results[1];
          const editorDataRes = await results[2];
          if (editorDataRes.ok) {
            editDataString = await editorDataRes.json();
          }
          if (viewDataRes.ok) {
            const viewDataJson = await viewDataRes.json();
            if (houseInfo.defaultHotSpot) {
              viewDataJson.DefaultHotSpotId = houseInfo.defaultHotSpot;
            } else if (houseInfo.defaultRoom) {
              console.log(viewDataJson);
              // eslint-disable-next-line no-restricted-syntax
              for (const item of viewDataJson.HotSpots) {
                if (item.Name.includes(houseInfo.defaultRoom)) {
                  viewDataJson.DefaultHotSpotId = item.ID;
                  break;
                }
              }
            }
            viewDataString = JSON.stringify(viewDataJson);
          } else {
            viewDataString = await singleViewDataRes.json();
          }
          resolve({ viewDataString, editDataString });
        }).catch((e) => {
          reject(e);
        });
    });
  };
  const initBaseView = (viewDataString, editDataString) => {
    const editorData = editDataString;
    const viewerInitConfig = {
      mainContainer,
      is3DViewAtStart: false,
      viewData: viewDataString,
      editorData,
      houseId: vrHouse.current.getHouseId(),
      housePathPrefix: `${vrHouse.current.getHousePathPrefix()}/`,
      isSingleMode: false,
      smallView: {
        container: 'godViewPanel',
        content: 'small-view-content',
        defaultManager: '3D',
      },
      compassContainer: null,

      switchPanoramaTo2DCallback: (state) => {
        console.log(state);
        setViewState('floorPlan');
      },
      switchPanoramaTo3DCallback: (state) => {
        console.log(state);
        setViewState('3D');
      },
      // 次callback存在问题
      switch2DToPanoramaCallback: (state, hotSpotId) => {
        console.log(state);
        console.log(hotSpotId);
        setViewState('panorama');
      },
      switch3DToPanoramaCallback: (state, hotSpotId) => {
        console.log(state);
        console.log(hotSpotId);
        if (state === 'animationEnd') {
          setViewState('panorama');
          setActivePanner('3D');
        }
      },
      switchPanoramaCallback: (state, hotSpotId) => {
        if (state === 'animationBegin') {
          currentHotInfo.current = viewDataModel.current.getRoomByHotSpotId(hotSpotId);
          setChangingPanorama(true);
        }
        if (state === 'animationEnd') {
          console.log(hotSpotId);
          setChangingPanorama(false);
        }
      },
      switch2DTo3DCallback: (state) => {
        console.log(state);
      },
      switch3DTo2DCallback: (state) => {
        console.log(state);
      },
      changeFloorCallBack: (floorData) => {
        console.log(floorData);
      },
    };
    const onInited = (ViewDataModel) => {
      setLoadState('loadEnd');
      setLoadPercent(0);
      if (onLoaded) onLoaded();
      viewDataModel.current = ViewDataModel;
      // eslint-disable-next-line max-len
      currentHotInfo.current = ViewDataModel.getRoomByHotSpotId(ViewDataModel.getDefaultHotSpotId());
      activePackageId.current = vrHouse.current.getHouseId();
      setTimeout(() => {
        isFirstLoad.current = false;
      });
    };
    const onError = (err) => {
      console.error(err);
    };
    if (activePackageId.current) {
      // eslint-disable-next-line no-undef
      HouseViewer.BaseAPI.initChangeHouse(
        viewerInitConfig,
        onInited,
        onError,
      );
    } else {
      // eslint-disable-next-line no-undef
      HouseViewer.Resources.init('https://vrhouse-web.oss-cn-shanghai.aliyuncs.com/Solution/', Resource);
      // eslint-disable-next-line no-undef
      HouseViewer.BaseAPI.initViewer(
        viewerInitConfig,
        onInited,
        onError,
      );
    }
  };

  return [viewDataModel.current, currentHotInfo.current, loadState, isFirstLoad.current, loadPercent];
};



export default useLoadHouse;
