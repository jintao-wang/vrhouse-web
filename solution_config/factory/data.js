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
      title: '工厂信息',
      params: [
        {
          平均面积: '102000 ㎡',
        },
        {
          交付: '待定',
        },
        {
          开盘: '待定',
        },
        {
          地址: '南昌市工业三路与文化中心南路的交汇处',
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
      title: '视频讲解',
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
    name: '亚洲工厂',
    defaultPackageId: 'shenzhouyouhua_demo',
    defaultDomain: '//vrhouse.oss-cn-shanghai.aliyuncs.com/',
    defaultPanelShow: true,
    tableTextColor: 'rgba(255,255,255,.75)',
    tableFlagColor: 'rgb(206,3,20)',
  },
  {
    name: '欧洲工厂',
    defaultPackageId: 'heyunliang_7b4b33d6-6ad9-4fd4-851d-ebf18e3f2345_solutions',
    defaultDomain: '//vrhouse.oss-cn-shanghai.aliyuncs.com/',
    defaultPanelShow: true,
    tableTextColor: 'rgba(255,255,255,.75)',
    tableFlagColor: 'rgb(206,203,50)',
  },
];

export const GroupMap = new Map()
  .set(GroupInfo[1], [
    {
      packageId: 'heyunliang_7b4b33d6-6ad9-4fd4-851d-ebf18e3f2345_solutions',
      packageName: '爱沙尼亚工厂',
      voice: [
        '//webresource.123kanfang.com/media/12997.mp3',
        '//webresource.123kanfang.com/media/salesOffice.mp3',
      ],
      table: {
        text: '爱沙尼亚',
        position: [58.934242, 24.233548],
        offset: [1, 10],
        rotate: 1.6,
      },
      introduction: {
        index: 13,
        info: [
          '国家: 爱沙尼亚',
          'Estonia Tallinn',
          '建筑面积: 159000平方米',
        ],
      },
    },
    // {
    //   packageId: 'baacb734-774d-4af7-b61b-7c9a777bc409',
    //   packageName: '立陶宛工厂-1',
    //   voice: [
    //     '//webresource.123kanfang.com/media/12997.mp3',
    //     '//webresource.123kanfang.com/media/salesOffice.mp3',
    //   ],
    //   table: {
    //     text: '立陶宛',
    //     position: [56.217551, 22.706468],
    //     offset: [0, 8],
    //     rotate: 1.45,
    //   },
    //   introduction: {
    //     index: 11,
    //     info: [
    //       '国家: 立陶宛',
    //       'Lithuania Kriukai',
    //       '建筑面积: 6000平方米',
    //     ],
    //   },
    // },
    // {
    //   packageId: '70f833e2-8381-4f45-b807-b5d808f064ca',
    //   packageName: '立陶宛工厂-2',
    //   voice: [
    //     '//webresource.123kanfang.com/media/12997.mp3',
    //     '//webresource.123kanfang.com/media/salesOffice.mp3',
    //   ],
    //   table: {
    //     text: '',
    //     position: [54.231018, 24.665954],
    //     offset: [0, 0],
    //     rotate: 0.9,
    //   },
    //   introduction: {
    //     index: 12,
    //     info: [
    //       '国家: 立陶宛',
    //       'Lithuania Kriukai',
    //       '建筑面积: 12500平方米',
    //     ],
    //   },
    // },
    // {
    //   packageId: 'aaccbd5b-c092-4777-a9b5-9df64b8e85ac',
    //   packageName: '波兰工厂',
    //   voice: ['//webresource.123kanfang.com/media/11507.mp3'],
    //   table: {
    //     text: '波兰',
    //     position: [53.134621, 18.005243],
    //     offset: [-1, 0],
    //     rotate: 1.3,
    //   },
    //   introduction: {
    //     index: 10,
    //     info: [
    //       '国家: 波兰',
    //       'Poland Nidzica',
    //       '建筑面积: 19000平方米',
    //     ],
    //   },
    // },
    {
      packageId: 'heyunliang_501f696a-e300-4739-a59e-68a36f4723d0_solutions',
      packageName: '乌克兰工厂',
      voice: [],
      table: {
        text: '乌克兰',
        position: [47.290765, 32.720760],
        offset: [-1, 0],
        rotate: 1.3,
      },
      introduction: {
        index: 9,
        info: [
          '国家: 乌克兰',
          'Ukraine Rivne',
          '建筑面积: 190000平方米',
        ],
      },
    },
  ])
  .set(GroupInfo[0], [
    {
      packageId: 'shenzhouyouhua_demo',
      packageName: '咸阳工厂',
      voice: ['//webresource.123kanfang.com/media/11507.mp3'],
      table: {
        text: '咸阳',
        position: [34.321852, 108.699388],
        offset: [-1, 0],
        rotate: -Math.PI / 2 - 0.55,
      },
      introduction: {
        index: 7,
        info: [
          '咸阳工业区',
          'Xianyang Industrial Park',
          '建筑面积: 865800平方米',
        ],
      },
    },
    // {
    //   packageId: 'e49763c9-e8a8-484d-8bd8-dcd30db6c3e5',
    //   packageName: '重庆工厂',
    //   voice: ['//webresource.123kanfang.com/media/11508.mp3'],
    //   table: {
    //     text: '重庆',
    //     position: [29.429592, 106.912673],
    //     offset: [-1, 0],
    //     rotate: -Math.PI / 2 - 0.5,
    //   },
    //   introduction: {
    //     index: 5,
    //     info: [
    //       '重庆工业区',
    //       'Chongqing Industrial Park',
    //       '建筑面积: 206000平方米',
    //     ],
    //   },
    // },
    // {
    //   packageId: 'shenzhouyinhua',
    //   packageName: '天津工厂',
    //   voice: ['//webresource.123kanfang.com/media/11507.mp3'],
    //   table: {
    //     text: '天津',
    //     position: [39.336896, 117.357230],
    //     offset: [-1, 0],
    //     rotate: -Math.PI / 2 - 0.35,
    //   },
    //   introduction: {
    //     index: 4,
    //     info: [
    //       '天津工业区',
    //       'Tianjin Industrial Park',
    //       '建筑面积: 350000平方米',
    //     ],
    //   },
    // },
    // {
    //   packageId: 'shenzhouyinhuayouhua_demo',
    //   packageName: '泰州工厂',
    //   voice: ['//webresource.123kanfang.com/media/11508.mp3'],
    //   table: {
    //     text: '泰州',
    //     position: [32.464003, 119.924084],
    //     offset: [-1, 0],
    //     rotate: -Math.PI / 2 - 0.1,
    //   },
    //   introduction: {
    //     index: 6,
    //     info: [
    //       '泰州工业区',
    //       'Taizhou Industrial Park',
    //       '建筑面积: 157143平方米',
    //     ],
    //   },
    // },
    // {
    //   packageId: 'shenzhouyinhuayouhuafuben',
    //   packageName: '吴江工厂',
    //   voice: ['//webresource.123kanfang.com/media/11508.mp3'],
    //   table: {
    //     text: '吴江',
    //     position: [29.128612, 120.639589],
    //     offset: [-1, 0],
    //     rotate: -Math.PI / 2 + 0.05,
    //   },
    //   introduction: {
    //     index: 3,
    //     info: [
    //       '吴江工业区',
    //       'Wujiang Industrial Park',
    //       '建筑面积: 280000平方米',
    //     ],
    //   },
    // },
    // {
    //   packageId: 'shenzhouyouhua',
    //   packageName: '惠州工厂',
    //   voice: ['//webresource.123kanfang.com/media/11508.mp3'],
    //   table: {
    //     text: '惠州',
    //     position: [24.108112, 114.449786],
    //     offset: [-3, 0],
    //     rotate: -Math.PI / 2 + 0.1,
    //   },
    //   introduction: {
    //     index: 2,
    //     info: [
    //       '惠州工业区',
    //       'Huizhou Industrial Park',
    //       '建筑面积: 120000平方米',
    //     ],
    //   },
    // },
    {
      packageId: 'shenzhouyinhuayouhua_demo',
      packageName: '大亚湾工业区',
      voice: ['//webresource.123kanfang.com/media/11508.mp3'],
      table: {
        text: '惠州',
        position: [22.770210, 114.479475],
        offset: [0, 0],
        rotate: -Math.PI / 2 + 0.1,
      },
      introduction: {
        index: 1,
        info: [
          '大亚湾工业区',
          'Dayawan Industrial Park',
          '建筑面积: 520000平方米',
        ],
      },
    },
    // {
    //   packageId: 'hongxing_cd62d52d-a56c-40d4-880e-3944c302e578',
    //   packageName: '越南工厂',
    //   voice: ['//webresource.123kanfang.com/media/11508.mp3'],
    //   table: {
    //     text: '越南',
    //     position: [10.895781, 106.402207],
    //     offset: [-2, 0],
    //     rotate: -Math.PI / 2 + 0.55,
    //   },
    //   introduction: {
    //     index: 8,
    //     info: [
    //       '国家: 越南',
    //       'Vietnam',
    //       '建筑面积: 291128平方米',
    //     ],
    //   },
    // },
  ]);

export const HotSpotInfoMap = {
  xL0clts5: {
    name: '针头检测',
    introduction: '针头检测，成品打包和出货区',
  },
  gpZhbj7B: {
    name: '生产线',
    introduction: '培训中心，最佳线和变革线',
  },
  EC001BD4: {
    name: '验片区',
    introduction: '验片区和衣片仓库',
  },
  '8GDOfEYE': {
    name: '裁剪区',
    introduction: '布料仓库，验布/松布，裁剪区',
  },
  mgyuSmO6: {
    name: '自动化区',
    introduction: '预缝制自动化，缝制自动化，后整自动化，MM梦想线，机器人缝制实验室，MC夹具研发实验室',
  },
  oxMd0RFC: {
    name: '展示区',
    introduction: '单层布料裁剪和3D扫描区',
  },
  O4eObNfQ: {
    name: '制版中心',
    introduction: '专业制版中心',
  },
  '54796B5B': {
    name: '生产一区',
    introduction: '这里是生产一区。',
  },
  jw31oN6I: {
    name: '生产二区',
    introduction: '这里是生产二区。',
  },
  cJqVj71C: {
    name: '检验区',
    introduction: '检验区，压烫区和布料存放区',
  },
  CA3C15BF: {
    name: '观察区',
    introduction: '观察区和办公室',
  },
  BWJ2qEWU: {
    name: '中式烹调一体化实训室',
    introduction: '中式烹饪实训室主要可以承担《烹调工艺》、《冷菜工艺》等多门课程的教学和训练，服务于烹饪工艺与营养、食品加工技术等专业。实训室能容纳30-50名学生进行冷、热菜制作实训，同时具有烹调师社会培训和职业技能考评的功能。',
  },
  MbwfQmWq: {
    name: '家庭厨房实训室',
    introduction: '民以食为天。每个家庭主妇都希望能够烹调出适合家人口味的美味佳肴，然而做饭看似简单，其中却大有学问。家庭厨艺培训班从家庭制作菜肴这个角度出发，教会家庭主妇如何运用简单易行的方法，将普通的原料制作成美味佳肴，在家庭厨房中一展身手。',
  },
  C6wuYwB2: {
    name: '烹饪刀工实训室',
    introduction: '烹饪基本功实训室主要是进行基本功训练的场地，主要承担刀工、锅功、雕刻、拼盘等专业基本功的教学和训练，服务于烹饪工艺与营养、食品加工技术等专业。实训室可容纳30-50名学生进行实训，可提供刀工、锅功、雕刻、拼盘等基本功实训之用，同时具有烹调师社会培训和职业技能考评的功能。',
  },
  ADBgQGNu: {
    name: '中西点综合实训室',
    introduction: '“热爱生活 德能立业 服务社会”是曹杨职校的办学理念，本课程从“热爱生活”强化内涵着手，通过设计“中西式点心Diy”系列活动课程为载体，营造自己动手、发现自我才艺的学习氛围，充实教师的课余文化生活。希望通过本课程的开展，能够和区内的一些多才多艺的老师一同探讨创意制作，本课程通过精选4道特色点心进行制作，使学员进一步了解中西式菜肴的特点、原料加工成型、成熟方法、操作步骤、装饰以及装盘做进一步的细化教学模式。以案例欣赏、教师讲授、体验制作为教学手段，通过本课程的学习，可以丰富教师的课余生活，为教师的工作生活增添一份色彩，为自己树立一份美的自信。\n'
    + '\n'
    + '课程的主要特点是培养学员对点心制作的兴趣爱好，与此同时，所学点心方便在家里进行制作，可以直接为生活增光添彩。',
  },
  K9OvhNqX: {
    name: '法式烘焙实训室',
    introduction: '法式面包是法国饮食中最具特色的食品,把法国食物的讲究、色香味体现得淋漓尽致。严格的制作工艺，使法式面包在世界众多的面包品种中独具一格。法式面包中最具特色的是法式长棍, 是世界上独一无二的法国特产的硬式面包，除此之外，还有月牙型面包等一系列品种。',
  },
  '5kOoC7PG': {
    name: '西式面点实训室',
    introduction: '“西点”主要指来源于欧美国家的点心。它是以面、糖、油脂、鸡蛋和乳品为原料，辅以干鲜果品和调味料，经过调制成型、装饰等工艺过程而制成的具有一定色、香、味、形、质的营养食品。面点用料讲究，无论是什么点心品种，其面坯、馅心、装饰、点缀、等用料都有各自选料标准，各种原料之间都有适当的比例，而且大多数原料要求称量准确。西点多以乳品、蛋品、糖类、油脂、面粉、干鲜水果等为常用原料，其中蛋、糖、油脂的比例较大，而且配料中干鲜水果、果仁、巧克力等，这些原料含有丰富的蛋白质、脂肪、糖、维生素等营养成分，它们是人体健康必不可少的营养素，因此西点具有较高的营养价值。本中心聘请资深西点师亲临执教，教授经典时尚的各式西点。',
  },
  lzzKetks: {
    name: '中式面点实训室',
    introduction: '中式点心是源于我国的点心，简称“中点”，它是以各种粮食、畜禽、鱼、虾、蛋、乳、蔬菜、果品等为原料，再配以多种调味品，经过加工而制成的色、香、味、形、质俱佳的各种营养食品。在我们的日常生活中，面点有作为正餐的米面主食，有作为早餐的早点、茶点，有作为筵席配置的席点，有作为旅游和调剂饮食的糕点、小吃，以及作为喜庆或节日礼物的礼品点心等等。',
  },
  nuMrAP6x: {
    name: '生产性综合实训室',
    introduction: '“热爱生活 德能立业 服务社会”是曹杨职校的办学理念，本课程从“热爱生活”强化内涵着手，通过设计“中式经典菜肴”系列活动课程为载体，营造自己动手、发现自我才艺的学习氛围，充实教师的课余文化生活。希望通过本课程的开展，能够和区内的一些多才多艺的老师一同探讨手工布艺创意制作，老师们从中得到乐趣。本课程通过精选八道特色菜肴进行制作，使学员进一步了解中式菜肴的特点、原料加工成型、烹调方法、操作步骤调味以及装盘做进一步的细化教学模式。以案例欣赏、教师讲授、体验制作为教学手段，通过本课程的学习，可以丰富教师的课余生活，为教师的工作生活增添一份色彩，为自己树立一份美的自信。\n'
    + '\n'
    + '课程的主要特点是培养学员对烹饪的兴趣和爱好，以此同时所学菜肴方便在家里进行制作，可以直接为生活所用。',
  },
  Qk5MWUQ9: {
    name: '西式烹调实训室',
    introduction: '西餐是指西方国家的菜式。正规西菜应包括了餐汤、前菜、主菜、餐后甜品及饮品。影响较大的西餐有：法国菜、意大利菜、英国菜、美国菜、俄国菜等，最正式的西餐当属法式西餐。本中心聘请资深西餐师亲临执教，教授正宗的经典西餐菜式。',
  },
  ovkkQnU3: {
    name: '库房',
    introduction: '实训工位： 30   个   实训室面积：  800    \n'
    + '适用于会展服务与管理、会展展示设计与制作专业技能的实训。\n'
    + '主要实训模块：会展技术实务、综合接待实务。\n'
    + '主要设施：地面材质、结构材料、海报材料、美工材料、展览灯具、展柜、各种展架、会谈桌椅等。',
  },
  eVrRt2ka: {
    name: '会展实训中心模拟工厂',
    introduction: '实训工位： 15  个   实训室面积：  70    \n'
    + '适用于会展服务与管理、综合会议技术服务的实训。学生通过实训课熟悉音响技术各类设备、音响设备跨接及调试训练、调音训练，较全面集中使学员实践操作过程中掌握会议现场。\n'
    + '主要实训模块：会展技术实务 、 综合接待实务。\n'
    + '主 要 设 施 ：录音笔、小磁卡机、电脑、电脑数字投影、实物投影、会议主席机、代表机扩音话筒等。',
  },
  F9CK06xO: {
    name: '地下报告厅实训室',
    introduction: '实训工位：  25  个   实训室面积：   406\n'
    + '适用于综合实践会议策划、布置、接待等流程，同时也可作为大型综合会议室使用，可承担社会会议、展示事务的服务中心。\n'
    + '主要实训模块：会展技术实务、综合接待实务。\n'
    + '主 要 设 施： 视频音响系统、综合扩声系统、舞台灯光、会议表决、同声传译系统、中央控制系统等。',
  },
  X5i85yGz: {
    name: '会议实训室',
    introduction: '实训工位： 10  个   实训室面积：  70    \n'
    + '适用于会展服务与管理、会展展示设计与制作专业技能的实训。\n'
    + '主要实训模块：会展衍生服务。\n'
    + '主 要 设 施 ：复印机、传真机、电脑、办公桌椅、沙发、茶机、消毒柜、粉碎机等。',
  },
  '6dLDn7TB': {
    name: '会务操作实训室',
    introduction: '实训工位： 10  个   实训室面积：  104  \n'
    + '适用于会展服务与管理、会展展示设计与制作专业技能的实训。\n'
    + '主要实训模块：会展技术实务、综合接待实务。\n'
    + '主要设施：杯子、托盘、衣帽架、商务会谈桌椅等。',
  },
  TQ3wJRba: {
    name: '会展设计实训室',
    introduction: '实训工位： 15  个   实训室面积：  108    \n'
    + '适用于会展展示设计与制作专业技能的实训。\n'
    + '主要实训模块：2D/3D图形处理、多媒体制作、网络技术、局域网构建、电子阅览、网页制作。\n'
    + '主 要 设 施 ：电脑、电脑数字投影、交换机',
  },
  sKbxHSdz: {
    name: '电话营销中心会议实训室',
    introduction: '实训工位： 20   个   实训室面积：  115    \n'
    + '适用于会展服务与管理、会展展示设计与制作专业技能的实训。\n'
    + '主要实训模块：会展技术实务、网络会议安全训练、远程会议的照明、音响、会议服务。\n'
    + '主要设施有：双向AV会议系统、模拟视频会议设备、视频会议音响、局域双向视频会议网络，闭路视频会议系统设备；照明、音响、摄像设备连接、调试、1000M网络接口等。',
  },
  X5i85yGY: {
    name: '影音实训室',
    introduction: '实训工位： 15  个   实训室面积： 72    M2影音实训室适用于会展服务与管理，综合会议技术服务的实训。影音实训室可直观了解各种音源、调音、功放、电声转换器件结构、性能要求，熟悉音响技术各类设备，音响设备跨接及调试训练，调音训练，对中型音响系统以及部分数码音频设备进行初步的了解和接触。\n'
    + '\n'
    + '主要实训模块：会展技术实务、综合会议技术实务。\n'
    + '\n'
    + '主要设施有：电声转换设备、各类音源设备、电脑数字调音、软件模拟音频信号、频谱显示器等。',
  },
};
