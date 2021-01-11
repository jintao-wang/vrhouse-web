export const BackgroundTheme = (opacity = 0.75) => `rgba(0,0,0, ${opacity})`;
export const ColorTheme = (opacity = 1) => `rgba(242,170,54, ${opacity})`;

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
      title: '楼盘信息',
      params: [
        {
          均价: '10200元/平',
        },
        {
          交付: '待定',
        },
        {
          开盘: '待定',
        },
        {
          楼盘地址: '南昌市工业三路与文化中心南路的交汇处',
        },
        {
          开发商: '南昌金祥房地产开发有限公司',
        },
      ],
    },
  },
  {
    component: 'VideoIntroduction',
    content: {
      title: '视频讲盘',
      poster: 'https://vrhouse-storage.oss-cn-shanghai.aliyuncs.com/title/video/ai.mp4?x-oss-process=video/snapshot,t_7000,f_jpg,m_fast',
      url: 'https://vrhouse-storage.oss-cn-shanghai.aliyuncs.com/title/video/ai.mp4',
    },
  },
  {
    component: 'PictureView',
    content: [
      {
        describe: '',
        url: '//vrhouse-storage.oss-cn-shanghai.aliyuncs.com/title/picture/de1.jpg',
      },
      {
        describe: '',
        url: '//vrhouse-storage.oss-cn-shanghai.aliyuncs.com/title/picture/de2.jpg',
      },
      {
        describe: '',
        url: '//vrhouse-storage.oss-cn-shanghai.aliyuncs.com/title/picture/de3.jpg',
      },
      {
        describe: '',
        url: '//vrhouse-storage.oss-cn-shanghai.aliyuncs.com/title/picture/de4.jpg',
      },
      {
        describe: '',
        url: '//vrhouse-storage.oss-cn-shanghai.aliyuncs.com/title/picture/de1.jpg',
      },
      {
        describe: '',
        url: '//vrhouse-storage.oss-cn-shanghai.aliyuncs.com/title/picture/de2.jpg',
      },
      {
        describe: '',
        url: '//vrhouse-storage.oss-cn-shanghai.aliyuncs.com/title/picture/de3.jpg',
      },
      {
        describe: '',
        url: '//vrhouse-storage.oss-cn-shanghai.aliyuncs.com/title/picture/de4.jpg',
      },
      {
        describe: '',
        url: '//vrhouse-storage.oss-cn-shanghai.aliyuncs.com/title/picture/de1.jpg',
      },
      {
        describe: '',
        url: '//vrhouse-storage.oss-cn-shanghai.aliyuncs.com/title/picture/de2.jpg',
      },
      {
        describe: '',
        url: '//vrhouse-storage.oss-cn-shanghai.aliyuncs.com/title/picture/de3.jpg',
      },
      {
        describe: '',
        url: '//vrhouse-storage.oss-cn-shanghai.aliyuncs.com/title/picture/de4.jpg',
      },
    ],
  },
];

export const IntroductionInfo = {
  title: '金地中奥九颂-都会之光',
  content: ' 2020年金地约20万平米格林系新作——都会之光，基于格林系特色,通过对园林、户型、建筑、配套等全方位的思考和落实，倡导注重亲情、友邻的居住环境和空间，为业主构建全龄化、更丰盛、更有温度的现代化都会生活场景。',
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
      packageId: '0c2c2005-d174-4471-a271-ecdb945698d5',
      packageName: '馆外航拍图',
      voice: [
        '//webresource.123kanfang.com/media/12997.mp3',
        '//webresource.123kanfang.com/media/salesOffice.mp3',
      ],
    },
    {
      packageId: '6a0a7d6f-8e6d-47fc-9c37-36e1f280e516',
      packageName: '商业配套',
      voice: [
        '//webresource.123kanfang.com/media/12997.mp3',
        '//webresource.123kanfang.com/media/salesOffice.mp3',
      ],
    },
    {
      packageId: 'fe3fed6d-bc90-4f5e-8f4c-cace25586b89',
      packageName: '小区环境',
      voice: ['//webresource.123kanfang.com/media/11507.mp3'],
    },
    {
      packageId: '67164282-9bea-4390-8865-5d7145375292',
      packageName: '小区设施',
      voice: [],
    },
  ])
  .set(GroupInfo[1], [
    {
      packageId: '166ababb-c98d-4e58-a2a4-d25e8a632690_deco_Modern_57',
      packageName: '岱云 三房两厅两卫',
      voice: ['//webresource.123kanfang.com/media/11507.mp3'],
    },
    {
      packageId: 'fafd3129-25ea-4958-9a97-de8715628cab_deco_Japanese_23',
      packageName: '沐阳 三房两厅两卫',
      voice: ['//webresource.123kanfang.com/media/11508.mp3'],
    },
    {
      packageId: 'cd1700c1-9b63-4f5d-ac91-5167928c3165_deco_NewChinese_18',
      packageName: '安泰 四房两厅两卫',
      voice: ['//webresource.123kanfang.com/media/11507.mp3'],
    },
    {
      packageId: 'e1b041d8-9244-4aba-b71d-b68deaf221e8_deco_Modern_17',
      packageName: '朗悦 三房两厅一卫',
      voice: ['//webresource.123kanfang.com/media/11508.mp3'],
    },
  ]);
