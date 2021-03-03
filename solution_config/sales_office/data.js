import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const PageInfo = {
  title: '天安·曼哈顿',
  pageTitle: '天安·曼哈顿',
  shareMessage: '已复制该房源链接！',
  viewing: '正在看',
  thumbnailTitle: '全部空间',
  menu_1: '项目总览',
  menu_2: '项目沙盘',
  menu_3: '样板间',
  menu_4: '更多',
  second_menu_1: '项目介绍',
  second_menu_2: '户型鉴赏',
  second_menu_3: '区域交通',
  second_menu_4: '预约看房',
  second_menu_5: '电话',
  floorPlanViewTitle: '户型鉴赏',
  trafficTitle: '区域交通',
  bookingTitle: '预约看房',
  bookingSecondTitle: '想了解更多信息？ 请留下您的联系方式，我们将安排专业顾问为您服务。',
  bookingFormName: '*姓名',
  bookingFormContact: '*联系方式',
  bookingFormTime: '看房时间',
  bookingFormSubmit: '确认预约',
  floorPlan: '户型图',
  model3D: '3D模型',
};

export const TrafficList = [];

export const FloorPlanList = [];

export const BuildList = [
  {
    left: {
      value: 350,
      offset: 13,
    },
    bottom: {
      value: 190,
      offset: 0,
    },
    rotate: 0,
    info: 1,
    floorPlan: [
      FloorPlanList[0],
      FloorPlanList[4],
      FloorPlanList[6],
    ],
  },
  {
    left: {
      value: 650,
      offset: 13,
    },
    bottom: {
      value: 195,
      offset: 0,
    },
    rotate: 0,
    info: 2,
    floorPlan: [
      FloorPlanList[0],
      FloorPlanList[3],
    ],
  },
  {
    left: {
      value: 450,
      offset: 13,
    },
    bottom: {
      value: 225,
      offset: 0,
    },
    rotate: 0,
    info: 3,
    floorPlan: [
      FloorPlanList[1],
      FloorPlanList[2],
    ],
  },
  {
    left: {
      value: 750,
      offset: 13,
    },
    bottom: {
      value: 235,
      offset: 0,
    },
    rotate: 0,
    info: 4,
    floorPlan: [
      FloorPlanList[4],
      FloorPlanList[5],
      FloorPlanList[6],
    ],
  },
  {
    left: {
      value: 530,
      offset: 13,
    },
    bottom: {
      value: 255,
      offset: 0,
    },
    rotate: 0,
    info: 5,
    floorPlan: [
      FloorPlanList[2],
      FloorPlanList[5],
    ],
  },
];

export const RecommendList = [
  FloorPlanList[0],
  FloorPlanList[1],
  FloorPlanList[3],
  FloorPlanList[5],
];

export const WxShareInfo = {
  title: '无锡·天安曼哈顿',
  desc: '',
  imgUrl: `${publicRuntimeConfig.ASSET_PREFIX}/static/weixinshare.png`,
};

export const Slide3DInfo = [
  {
    component: 'Introduction',
    content: {
      title: '基本介绍',
      params: [
        {
          '项目位置: ': '湖滨路809号(太湖大道与湖滨路交叉口东南侧)',
        },
        {
          '建筑面积: ': '135930.59㎡',
        },
        {
          '建筑类型: ': '高层28-30层',
        },
        {
          '车位数: ': '950个左右',
        },
      ],
    },
  },
  {
    component: 'PictureView',
    content: [
      {
        describe: '',
        url: `${publicRuntimeConfig.ASSET_PREFIX}/static/picture-display/1.jpg`,
      },
      {
        describe: '',
        url: `${publicRuntimeConfig.ASSET_PREFIX}/static/picture-display/2.jpg`,
      },
      {
        describe: '',
        url: `${publicRuntimeConfig.ASSET_PREFIX}/static/picture-display/3.jpg`,
      },
      {
        describe: '',
        url: `${publicRuntimeConfig.ASSET_PREFIX}/static/picture-display/4.jpg`,
      },
      {
        describe: '',
        url: `${publicRuntimeConfig.ASSET_PREFIX}/static/picture-display/5.jpg`,
      },
      {
        describe: '',
        url: `${publicRuntimeConfig.ASSET_PREFIX}/static/picture-display/6.jpg`,
      },
      {
        describe: '',
        url: `${publicRuntimeConfig.ASSET_PREFIX}/static/picture-display/7.jpg`,
      },
      {
        describe: '',
        url: `${publicRuntimeConfig.ASSET_PREFIX}/static/picture-display/9.jpg`,
      },
      {
        describe: '',
        url: `${publicRuntimeConfig.ASSET_PREFIX}/static/picture-display/10.jpg`,
      },
      {
        describe: '',
        url: `${publicRuntimeConfig.ASSET_PREFIX}/static/picture-display/11.jpg`,
      },
      {
        describe: '',
        url: `${publicRuntimeConfig.ASSET_PREFIX}/static/picture-display/12.jpg`,
      },
      {
        describe: '',
        url: `${publicRuntimeConfig.ASSET_PREFIX}/static/picture-display/13.jpg`,
      },
      {
        describe: '',
        url: `${publicRuntimeConfig.ASSET_PREFIX}/static/picture-display/14.jpg`,
      },
      {
        describe: '',
        url: `${publicRuntimeConfig.ASSET_PREFIX}/static/picture-display/15.jpg`,
      },
      {
        describe: '',
        url: `${publicRuntimeConfig.ASSET_PREFIX}/static/picture-display/16.jpg`,
      },
      {
        describe: '',
        url: `${publicRuntimeConfig.ASSET_PREFIX}/static/picture-display/8.jpg`,
      },
    ],
  },
  {
    component: 'MapInfo',
    content: {
      title: '江苏省无锡市滨湖区湖滨路809',
      addressPoint: {
        x: 31.539950,
        y: 120.285450,
      },
    },
  },
];

export const IntroductionInfo = {
  title: '天安·曼哈顿',
  content: '<p>天安曼哈顿位于无锡市中心城西部，城市东西主干道—太湖大道与湖滨路交叉口的东南侧，向西连接太湖风景区及蠡湖新城，向东连接中心城区及太湖广场，向北连接老市区，向南连接中桥芦庄和太湖新城。</p>'
      + '<p>项目总用地5.99万平方米，容积率2.4，绿化率70%，规划总户数800户左右。小区规划以高层为主做半围合式布局，留出较大楼距空间，布置超大面积的中庭景观<p>',
};

export const GroupInfo = [
  {
    name: '小区介绍',
    defaultPackageId: 'lyx_8235af79be344eec9c01b5a7441af59a',
    defaultDomain: '//vrhouse.oss-cn-shanghai.aliyuncs.com/',
    defaultPanelShow: false,
  },
  {
    name: '样板间',
    defaultPackageId: 'lyx_4b8a89f6c653418a8cdb24032d93f4d1',
    defaultDomain: '//vrhouse.oss-cn-shanghai.aliyuncs.com/',
    defaultPanelShow: true,
  },
];

export const GroupMap = new Map()
  .set(GroupInfo[0], [
    {
      packageId: 'lyx_8235af79be344eec9c01b5a7441af59a',
      packageName: '高空航拍',
      voice: [
        `${publicRuntimeConfig.ASSET_PREFIX}/static/voice.mp3`,
      ],
    },
    {
      packageId: 'lyx_0eb5aebc005e4194a54f57c9683f4032',
      packageName: '低空航拍',
      voice: [
        `${publicRuntimeConfig.ASSET_PREFIX}/static/voice.mp3`,
      ],
    },
    {
      packageId: 'lyx_c7c36dce52b34527876684e275238486',
      packageName: '楼宇正门',
      voice: [
        `${publicRuntimeConfig.ASSET_PREFIX}/static/voice.mp3`,
      ],
    },
    {
      packageId: 'lyx_a905e650f70f4ff4a3a8765827e9fc46',
      packageName: '售楼中心',
      voice: [
        `${publicRuntimeConfig.ASSET_PREFIX}/static/voice.mp3`,
      ],
    },
    {
      packageId: 'lyx_136098b5716f4096acaf583422cb8ae2',
      packageName: '小区环境',
      voice: [
        `${publicRuntimeConfig.ASSET_PREFIX}/static/voice.mp3`,
      ],
    },
    {
      packageId: 'lyx_20de9f5f30074bf39d2100852e1b265f',
      packageName: '迎宾水景',
      voice: [
        `${publicRuntimeConfig.ASSET_PREFIX}/static/voice.mp3`,
      ],
    },
    {
      packageId: 'lyx_b6b799b8fafa4d93b9e2982705a0993d',
      packageName: '迎宾大堂',
      voice: [
        `${publicRuntimeConfig.ASSET_PREFIX}/static/voice.mp3`,
      ],
    },
    {
      packageId: 'lyx_cbbe4a171255440f8f117348a62368ac',
      packageName: '电梯间',
      voice: [
        `${publicRuntimeConfig.ASSET_PREFIX}/static/voice.mp3`,
      ],
    },
  ])
  .set(GroupInfo[1], [
    {
      packageId: 'lyx_4b8a89f6c653418a8cdb24032d93f4d1',
      packageName: '样板间',
      voice: [
        `${publicRuntimeConfig.ASSET_PREFIX}/static/voice.mp3`,
      ],
    },
  ]);
