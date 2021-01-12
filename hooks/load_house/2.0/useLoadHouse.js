import { useEffect, useRef, useState } from 'react';
import NameConverter from '../../../util/nameConverter';
import Resource from '../../../util/resource';
import VRHouse from '../../../util/vrHouse';

const useLoadHouse = ({
  container,
  mainContainer,
  is3DViewAtStart,
  setViewState,
  setActivePanner,
  setChangingPanorama,
  onLoad,
  onLoaded,
  houseInfo,
  switch3DToPanoramaCallback,
  wxShareInfo,
}) => {
  const [loadState, setLoadState] = useState('loadStart');
  const currentHotId = useRef(null);
  const [viewDataModel, setViewDataModel] = useState(null);
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
    setLoadPercent(0);
    vrHouse.current = new VRHouse(houseInfo.packageId, houseInfo.domain);
    setLoadState('loadStart');
    // eslint-disable-next-line no-unused-expressions
    onLoad && onLoad();
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
      is3DViewAtStart,
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
      compassContainer: 'compassContainer',

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
          HouseViewer.BaseAPI.changeFloor(false);
          // eslint-disable-next-line no-unused-expressions
          switch3DToPanoramaCallback && switch3DToPanoramaCallback();
          currentHotId.current = hotSpotId;
        }
      },
      switchPanoramaCallback: (state, hotSpotId) => {
        if (state === 'animationBegin') {
          currentHotId.current = hotSpotId;
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
      if (onLoaded) onLoaded();
      setViewDataModel(ViewDataModel);
      // eslint-disable-next-line max-len
      currentHotId.current = ViewDataModel.getDefaultHotSpotId();
      activePackageId.current = vrHouse.current.getHouseId();
      setTimeout(() => {
        isFirstLoad.current = false;
      });
      import('../../../util/weixinShare')
        .then((module) => {
          const wxShowMenu = module.default;
          wxShowMenu(wxShareInfo);
        }).catch((err) => {
          console.error(err);
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
      HouseViewer.Resources.init('https://vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/customer/wuhanMax/', Resource);
      // eslint-disable-next-line no-undef
      HouseViewer.BaseAPI.initViewer(
        viewerInitConfig,
        onInited,
        onError,
      );
    }
  };

  // eslint-disable-next-line max-len
  return [viewDataModel, currentHotId.current, loadState, isFirstLoad.current, loadPercent];
};

export default useLoadHouse;
