export const BackgroundTheme = (opacity = 0.75) => `rgba(0,0,0, ${opacity})`;
export const ColorTheme = (opacity = 1) => `rgba(242,170,54, ${opacity})`;

export const Customer = null;

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

export const IntroductionInfo = {
  title: 'MAX科技园',
  content: `<p>MAX科技园（武汉·江夏）位于武汉江夏区，自然景观环绕项目四周，北邻汤逊湖自然景观，西侧为江夏区政府所在地及规划1500亩城市公园，南侧为谭鑫培公园及阳光创谷产业园规划的商业区，业态囊括金融、酒店、餐饮、娱乐、健身、商务招待等。</p>
<p>西侧藏龙岛是武汉高尔夫运动的集中地，周边配建高端酒店集中区。项目自身配备金融、商务简餐、员工食堂、健身娱乐、人才公寓、图书、会议等配套设施，满足科技人才工作生活的全面需求。</p>`,
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
      packageId: 'xushivr_53b82704-fb39-44a5-b4a2-668100170d98',
      packageName: 'MAX科技园',
      voice: [
        '//webresource.123kanfang.com/Solution/jiangxia/static/media/music.10fc01c.mp3',
      ],
    },
    {
      packageId: 'xushivr_a13bd461-b5ef-4b81-a099-148e1dcb8682',
      packageName: '园区外景',
      voice: [
        '//webresource.123kanfang.com/Solution/jiangxia/static/media/music.10fc01c.mp3'
      ],
    },
    {
      packageId: 'xushivr_866b3798-fd82-4992-8c45-d03723716512',
      packageName: '庭院独栋',
      voice: ['//webresource.123kanfang.com/Solution/jiangxia/static/media/music.10fc01c.mp3'],
    },
  ])
  .set(GroupInfo[1], [
    {
      packageId: 'xushivr_950afa06-b163-4c8a-892c-870bbb15c374',
      packageName: '科技园内景',
      voice: ['//webresource.123kanfang.com/Solution/jiangxia/static/media/music.10fc01c.mp3'],
    },
  ]);
