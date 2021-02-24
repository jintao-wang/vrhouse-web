import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const PageInfo = {
  title: '虚拟售楼处',
  pageTitle: '欧美金融城 EFC',
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

export const Slide3DInfo = [
  {
    component: 'Introduction',
    content: {
      title: '基本介绍',
      params: [
        {
          '地上建筑面积: ': '96,894.23 平方米 ',
        },
        {
          '低区建筑面积: ': '26,125.03 平方米',
        },
        {
          '楼层: ': '46层',
          '楼高: ': '220米',
        },
        {
          '车位数: ': '低区独立使用100个',
        },
        {
          '竣工时间: ': '2019年10月，低区交付时间为2020年6月',
        },
      ],
    },
  },
  {
    component: 'IntroductionEn',
    content: {
      title: 'Introduction',
      params: [
        {
          'aboveground: ': '96,894.23 sqm',
        },
        {
          'lower zone: ': '26,125.03 sqm',
        },
        {
          'No. of Floors: ': '46 floors',
          'Tower Height: ': '220m',
        },
        {
          'No. of Carparks: ': '100 for lower zones',
        },
        {
          'Handover date: ': 'Jun.2020 (lower zone)',
        },
      ],
    },
  },
  {
    component: 'PictureView',
    content: [
      {
        describe: '',
        url: `${publicRuntimeConfig.ASSET_PREFIX}/static/picture-display/1197889998.jpg`,
      },
      {
        describe: '',
        url: `${publicRuntimeConfig.ASSET_PREFIX}/static/picture-display/T6%E8%A5%BF%E4%BE%A7%E5%85%A5%E5%8F%A3%E5%A4%84.jpg`,
      },
      {
        describe: '',
        url: `${publicRuntimeConfig.ASSET_PREFIX}/static/picture-display/%E4%B8%9C%E5%8C%97%E7%AB%8B%E9%9D%A2.jpg`,
      },
      {
        describe: '',
        url: `${publicRuntimeConfig.ASSET_PREFIX}/static/picture-display/%E4%B8%AD%E9%AB%98%E5%8C%BA%E9%98%BF%E9%87%8C%E5%85%A5%E5%8F%A3%E5%8F%8A%E9%80%9A%E5%BE%80%E4%BA%8C%E5%B1%82%E8%B4%AD%E7%89%A9%E4%B8%AD%E5%BF%83%E7%9A%84%E6%A5%BC%E6%A2%AF.jpg`,
      },
      {
        describe: '',
        url: `${publicRuntimeConfig.ASSET_PREFIX}/static/picture-display/%E5%8D%AB%E7%94%9F%E9%97%B4.jpg`,
      },
      {
        describe: '',
        url: `${publicRuntimeConfig.ASSET_PREFIX}/static/picture-display/%E5%B1%95%E5%8E%85.jpg`,
      },
      {
        describe: '',
        url: `${publicRuntimeConfig.ASSET_PREFIX}/static/picture-display/%E9%97%B8%E6%9C%BA2.jpg`,
      },
    ],
  },
  // {
  //   component: 'MapInfo',
  //   content: {
  //     title: '南昌市工业三路与文化中心南路交汇处',
  //     addressPoint: {
  //       x: 28.680081,
  //       y: 115.818690,
  //     },
  //   },
  // },
  {
    component: 'Management',
    content: {
      title: '配套及物业管理',
      params: [
        {
          '丽晶物业: ': '',
        },
        {
          '': '十余年甲级写字楼、酒店、商业购物等各类型物业管理经验',
        },
        {
          '周边配套: ': '',
        },
        {
          '': '-万豪行政公寓，万创国际公寓',
        },
        {
          '': '-高品质住宅',
        },
        {
          '': '-1.5万平方米中央艺术公园',
        },
        {
          '': '-欧美购物广场近10万平方米综合购物商场',
        },
      ],
    },
  },
  {
    component: 'ManagementEn',
    content: {
      title: 'Property Management and Commercial Facilities',
      params: [
        {
          'LiJing Property Management: ': '',
        },
        {
          '': '10+ years of experience in the management of Grade A office buildings, hotels, shopping centers, etc.',
        },
        {
          'Commercial facilities:': '',
        },
        {
          '': '-Marriott Executive Apartments, EFC Residence',
        },
        {
          '': '-Central Garden (1,500 sqm)',
        },
        {
          '': '-EFC Live shopping center (100,000 sqm+)',
        },
      ],
    },
  },
];

export const IntroductionInfo = {
  title: '欧美金融城',
  content: '<p>欧美金融城英国中心西楼（EFC T6）是获得美国LEED Gold认证的顶配超甲级写字楼，这座由英国福斯特建筑事务所倾心打造的“皇冠上的明珠”，被称为“东方硅谷当之无愧的新地标”。</p>'
    + '<p>科技、共享、人文的加持，让这座未来感十足的地标建筑，正在为未来科技城乃至整个杭州开创一个崭新的世界。<p>'
  + '<p>The Grade A+ office building ‘EFC UK Center West Building’ has obtained LEED Gold certification. This \'jewel in the crown\' designed by Foster & Partners, also known as a new landmark in the ‘Eastern Silicon Valley’, is creating a new world for the Future Sci-tech City CBD and even Hangzhou as a whole.\n'
    + 'W</p>',
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
      packageName: '航拍夜景',
      voice: [
        `${publicRuntimeConfig.ASSET_PREFIX}/static/voice.mp3`,
      ],
    },
    {
      packageId: 'lyx_0eb5aebc005e4194a54f57c9683f4032',
      packageName: '航拍日景',
      voice: [
        `${publicRuntimeConfig.ASSET_PREFIX}/static/voice.mp3`,
      ],
    },
    {
      packageId: 'lyx_c7c36dce52b34527876684e275238486',
      packageName: '网红连廊',
      voice: [
        `${publicRuntimeConfig.ASSET_PREFIX}/static/voice.mp3`,
      ],
    },
    {
      packageId: 'lyx_136098b5716f4096acaf583422cb8ae2',
      packageName: '夜景-1',
      voice: [
        `${publicRuntimeConfig.ASSET_PREFIX}/static/voice.mp3`,
      ],
    },
    {
      packageId: 'lyx_a905e650f70f4ff4a3a8765827e9fc46',
      packageName: '夜景-2',
      voice: [
        `${publicRuntimeConfig.ASSET_PREFIX}/static/voice.mp3`,
      ],
    },
    {
      packageId: 'lyx_20de9f5f30074bf39d2100852e1b265f',
      packageName: '夜景-2',
      voice: [
        `${publicRuntimeConfig.ASSET_PREFIX}/static/voice.mp3`,
      ],
    },
    {
      packageId: 'lyx_cbbe4a171255440f8f117348a62368ac',
      packageName: '夜景-2',
      voice: [
        `${publicRuntimeConfig.ASSET_PREFIX}/static/voice.mp3`,
      ],
    },
    {
      packageId: 'lyx_b6b799b8fafa4d93b9e2982705a0993d',
      packageName: '夜景-2',
      voice: [
        `${publicRuntimeConfig.ASSET_PREFIX}/static/voice.mp3`,
      ],
    },
  ])
  .set(GroupInfo[1], [
    {
      packageId: 'lyx_4b8a89f6c653418a8cdb24032d93f4d1',
      packageName: '大堂',
      voice: [
        `${publicRuntimeConfig.ASSET_PREFIX}/static/voice.mp3`,
      ],
    },
  ]);
