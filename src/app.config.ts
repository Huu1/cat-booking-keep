export default defineAppConfig({
  pages: [
    "pages/index/index",
    "pages/record/index",
    // "pages/account/index",
    // "pages/accountType/index",
    // "pages/addAccount/index",
    "pages/recordDetail/index",
    "pages/accountDetail/index",
    "pages/books/index",
    "pages/addBook/index",
    "pages/my/index",
    "pages/statistics/index",
    "pages/login/index", // 添加登录页面
  ],
  window: {
    backgroundTextStyle: "dark",
    navigationBarTextStyle: "black",
    navigationStyle: "custom",
  },
  tabBar: {
    color: "#999", // 未选中的文字颜色
    selectedColor: "#999", // 选中时的文字颜色
    backgroundColor: "#ffffff", // TabBar 背景色
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
        iconPath: "assets/tabbar/home.png",
        selectedIconPath: "assets/tabbar/home-check.png",
      },
      {
        pagePath: "pages/statistics/index",
        text: "统计",
        iconPath: "assets/tabbar/static.png",
        selectedIconPath: "assets/tabbar/static-check.png",
      },
      {
        pagePath: "pages/my/index",
        text: "我的",
        iconPath: "assets/tabbar/my.png",
        selectedIconPath: "assets/tabbar/my-check.png",
      },
    ],
  },
});
