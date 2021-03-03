window.ASSET_PREFIX = 'https://webresource.123kanfang.com/next-solution/customer/manhattan';
window.appConfig = {
  // AutoWalkWalkSpeed: 1000,
  defaultDomain: '//vrhouse-test.oss-cn-shanghai.aliyuncs.com/', // 默认domain
  is3DViewAtStart: false, // true初始为3D;false或不写默认panorama
  textFontSize2D: '50', // 2D户型图中文字的大小
  textFontFamily2D: 'PingFangSC-Regular',
  texColorIn2D: {
    r: 255, g: 255, b: 255, a: 1,
  }, // 2D户型图中文字的颜色
  panoramaLogoOpacity: 0, // 全景模式下遮挡相机的logo的透明度0-1，0为全透明，1为不透明
  useWeiChat: 0, // 微信分享开关
  useDecoration: 1, // 一键装修开关
  useHouseChange: 1, // 切换户型开关
  useRoomChange: 1, // 切换房间开关
  useRoomArea: 0, // 面积开关(主页中3D模型中面积、模型全屏中的面积)
  useAIIntroduce: 0, // AI讲房开关
  panoramaFovRange: [50, 120],
  panoramaFov: 120,

  useMock: 1, // 目前的作用是，直接读取本地的houseInfo。而不是访问接口。
  kfApiURL: 'https://im-test.123kanfang.com/IM/', // 带看用的云平台服务地址
  hideRoomAreaIn2D: false, // 是否隐藏2D户型图中的面积
  hotSpotHighlightColor: {
    r: 22, g: 212, b: 117, a: 1,
  }, // 3d户型图光柱和文 字热点选中时的高亮色
  lengthStandard: 'metre', // 长度单位，metre: 米; feet: 英尺
  repeatedlyGuidedTour: 1, // 小程序webview中结束vr带看后是否支持多次发起
  hotSpotPosition: 0, // 不写或0为以前展示在空中的箭头，1为展示在地面上
  mediaPrefix: '//webresource.123kanfang.com/media/',
  lang: 'zh-CN', // 语言设置,zh-CN 简体中文 ja日语 en-US 英语 zh-HK 香港繁体中文 zh-TW 台湾繁体中文
  panoramaMouseEnabled: false, // 鼠标悬浮 - 标准端默认开启
  beamBaseEnabled: true, // 光柱底盘 - 标准端默认开启
  animateStereoHotSpot: true, // 3d光柱动画 - 标准端默认开启
  walkingAnimation: true, // 3d当前光柱底部走路小人 - 标准端默认开启
  companyName: '123kanfang', // 底盘公司名称显示

  // 以下为vr带看的相关配置
  useAskPhoneNumber: 0, // 要电话开关
  useGivePhoneNumber: 0, // 留电话开关
  useUserImg: 1, // 看房页中头像开关，vr带看中默认开启
  appKey: '0de33fdc111147b5b1f57f8f32ab6856', // 123看房内部key
  // authServer: "//test.webapi.123kanfang.com/v2/",  // editor模式下审核服务器地址
  useRoamArrow: 1, // 显示热点转向指示器
  showAllHotSpot: 0, // 显示所有热点
  allowRoamThroughWall: true, // 允许穿墙

  rebuildApp: true,
  isOutScene: false,
  display3DUnder2D: false,
};

if (window.appConfig.pageTitleImageUrl) {
  const currentIcon = window.appConfig.pageTitleImageUrl;
  const link = document.querySelector('link[rel*="icon"]');
  link.href = currentIcon;
}

window.RESTFulConfig = {
};

window.VRCallback = {
  onVRLoadCallback() {
    // todo 用户自定义
  },
};
