export default {
  pages: [
    'pages/home/index',
    // 'pages/home/friendList/index',
    'pages/paper/index',
    'pages/paper/question/index',
    'pages/mine/index',
    'pages/mine/paperlist/index',
    'pages/mine/userlist/index',
    'pages/mine/paperDetail/index',
    'pages/mine/paperEdit/index',
    'pages/mine/categorylist/index',
    'pages/mine/category/index',
    'pages/mine/question/index',
    'pages/mine/questionlist/index',
    'pages/mine/answerlist/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    list: [
      {
        pagePath: 'pages/home/index',
        text: '主页',
        iconPath: './assets/tabs/home.png',
        selectedIconPath: './assets/tabs/home-active.png',
      },
      {
        pagePath: 'pages/paper/index',
        text: '试题',
        iconPath: './assets/tabs/cart.png',
        selectedIconPath: './assets/tabs/cart-active.png',
      },
      {
        pagePath: 'pages/mine/index',
        text: '个人中心',
        iconPath: './assets/tabs/user.png',
        selectedIconPath: './assets/tabs/user-active.png',
      },
    ],
    color: '#888792',
    selectedColor: '#6197D2',
    backgroundColor: '#fff',
    borderStyle: 'black',
  },
  cloud: true
}
