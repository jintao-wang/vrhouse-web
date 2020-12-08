export const PageInfo = {
  title: '虚拟售楼处',
  pageTitle: '楼盘信息',
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

export const TrafficList = [
  {
    name: '区域交通1',
    src: '//vrhouse-storage.oss-cn-shanghai.aliyuncs.com/customer/midong-wuyue/traffic/1.jpg',
    srcBig: '//vrhouse-storage.oss-cn-shanghai.aliyuncs.com/customer/midong-wuyue/traffic/1.jpg',
  },
  {
    name: '区域交通2',
    src: '//vrhouse-storage.oss-cn-shanghai.aliyuncs.com/customer/midong-wuyue/traffic/3.jpg',
    srcBig: '//vrhouse-storage.oss-cn-shanghai.aliyuncs.com/customer/midong-wuyue/traffic/3.jpg',
  },
  {
    name: '区域交通3',
    src: '//vrhouse-storage.oss-cn-shanghai.aliyuncs.com/customer/midong-wuyue/traffic/5.jpg',
    srcBig: '//vrhouse-storage.oss-cn-shanghai.aliyuncs.com/customer/midong-wuyue/traffic/5.jpg',
  },
];

export const FloorPlanList = [
  {
    name: '户型图1',
    src: '//vrhouse-storage.oss-cn-shanghai.aliyuncs.com/customer/midong-wuyue/floorPlanSmall/87.png',
    srcBig: '//vrhouse-storage.oss-cn-shanghai.aliyuncs.com/customer/midong-wuyue/floorPlan/87.jpg',
  },
  {
    name: '户型图2',
    src: '//vrhouse-storage.oss-cn-shanghai.aliyuncs.com/customer/midong-wuyue/floorPlanSmall/98A.png',
    srcBig: '//vrhouse-storage.oss-cn-shanghai.aliyuncs.com/customer/midong-wuyue/floorPlan/98A.jpg',
  },
  {
    name: '户型图3',
    src: '//vrhouse-storage.oss-cn-shanghai.aliyuncs.com/customer/midong-wuyue/floorPlanSmall/98B.png',
    srcBig: '//vrhouse-storage.oss-cn-shanghai.aliyuncs.com/customer/midong-wuyue/floorPlan/98B.jpg',
  },
  {
    name: '户型图4',
    src: '//vrhouse-storage.oss-cn-shanghai.aliyuncs.com/customer/midong-wuyue/floorPlanSmall/110A.png',
    srcBig: '//vrhouse-storage.oss-cn-shanghai.aliyuncs.com/customer/midong-wuyue/floorPlan/110A.jpg',
  },
  {
    name: '户型图5',
    src: '//vrhouse-storage.oss-cn-shanghai.aliyuncs.com/customer/midong-wuyue/floorPlanSmall/110B.png',
    srcBig: '//vrhouse-storage.oss-cn-shanghai.aliyuncs.com/customer/midong-wuyue/floorPlan/110B.jpg',
  },
  {
    name: '户型图6',
    src: '//vrhouse-storage.oss-cn-shanghai.aliyuncs.com/customer/midong-wuyue/floorPlanSmall/128A.png',
    srcBig: '//vrhouse-storage.oss-cn-shanghai.aliyuncs.com/customer/midong-wuyue/floorPlan/128A.jpg',
  },
  {
    name: '户型图7',
    src: '//vrhouse-storage.oss-cn-shanghai.aliyuncs.com/customer/midong-wuyue/floorPlanSmall/141.png',
    srcBig: '//vrhouse-storage.oss-cn-shanghai.aliyuncs.com/customer/midong-wuyue/floorPlan/141.jpg',
  },
];

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
          '地上建筑面积: ': '96,894.23 平方米',
        },
        {
          '低区建筑面积: ': '26,125.03平方米',
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
    component: 'PictureView',
    content: [
      {
        describe: '',
        url: '//vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/customer/EFC/static/picture-display/1197889998.jpg',
      },
      {
        describe: '',
        url: '//vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/customer/EFC/static/picture-display/T6%E8%A5%BF%E4%BE%A7%E5%85%A5%E5%8F%A3%E5%A4%84.jpg',
      },
      {
        describe: '',
        url: '//vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/customer/EFC/static/picture-display/%E4%B8%9C%E5%8C%97%E7%AB%8B%E9%9D%A2.jpg',
      },
      {
        describe: '',
        url: '//vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/customer/EFC/static/picture-display/%E4%B8%AD%E9%AB%98%E5%8C%BA%E9%98%BF%E9%87%8C%E5%85%A5%E5%8F%A3%E5%8F%8A%E9%80%9A%E5%BE%80%E4%BA%8C%E5%B1%82%E8%B4%AD%E7%89%A9%E4%B8%AD%E5%BF%83%E7%9A%84%E6%A5%BC%E6%A2%AF.jpg',
      },
      {
        describe: '',
        url: '//vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/customer/EFC/static/picture-display/%E5%8D%AB%E7%94%9F%E9%97%B4.jpg',
      },
      {
        describe: '',
        url: '//vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/customer/EFC/static/picture-display/%E5%B1%95%E5%8E%85.jpg',
      },
      {
        describe: '',
        url: '//vrhouse-web.oss-cn-shanghai.aliyuncs.com/next-solution/customer/EFC/static/picture-display/%E9%97%B8%E6%9C%BA2.jpg',
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
];

export const IntroductionInfo = {
  title: '欧美金融城',
  content: '欧美金融城是杭州的一个金融商业区，于2013年10月动工，于2014年8月开盘。欧美金融城位于杭州未来科技城CBD核心区，整体规划建筑面积近百万平方米',
};

export const GroupInfo = [
  {
    name: '外景',
    defaultPackageId: '0c2c2005-d174-4471-a271-ecdb945698d5',
    defaultDomain: '//vrhouse.oss-cn-shanghai.aliyuncs.com/',
    defaultPanelShow: false,
  },
  {
    name: '内景',
    defaultPackageId: '166ababb-c98d-4e58-a2a4-d25e8a632690_deco_Modern_57',
    defaultDomain: '//vrhouse.oss-cn-shanghai.aliyuncs.com/',
    defaultPanelShow: true,
  },
];

export const GroupMap = new Map()
  .set(GroupInfo[0], [
    {
      packageId: 'lyx_46bbc1085e9f4f0485d1e14182a80a9f',
      packageName: '航拍夜景',
      voice: [],
    },
    {
      packageId: 'lyx_4c93415ade5a43348cdcece5885627af',
      packageName: '航拍日景',
      voice: [],
    },
    {
      packageId: 'lyx_912baa7f0c15482caac0b086cf74900d',
      packageName: '网红连廊',
      voice: [],
    },
    {
      packageId: 'lyx_b77d0f9198e94fe9ba07fcdc01222b65',
      packageName: '夜景-1',
      voice: [],
    },
    {
      packageId: 'lyx_90438eb3060b40a19ba7504087fffa9b',
      packageName: '夜景-2',
      voice: [],
    },
  ])
  .set(GroupInfo[1], [
    {
      packageId: 'lyx_a3e8fb5c78e44059939a4b066ae69f29',
      packageName: '大堂',
      voice: [],
    },
    {
      packageId: 'lyx_3e2b533b460048169dbb50eda51f77dc',
      packageName: '车库',
      voice: [],
    },
    {
      packageId: 'lyx_3cf0455e3c6142caa65348d0d9d182a7',
      packageName: '八楼电梯间',
      voice: [],
    },
    {
      packageId: 'lyx_6563d302befd470ea47dab6fc3000e83',
      packageName: '八楼办公区',
      voice: [],
    },
  ]);
