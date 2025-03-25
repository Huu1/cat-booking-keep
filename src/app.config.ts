export default {
  pages: [
    "pages/index/index",
    "pages/record/index",
    "pages/account/index",
    "pages/accountType/index",
    "pages/addAccount/index",
    "pages/recordDetail/index",
    "pages/accountDetail/index",
    "pages/books/index",
    "pages/addBook/index",
  ],
  window: {
    backgroundTextStyle: "dark",
    navigationBarTextStyle: "black",
    navigationStyle: "custom",
  },
  
  // 小程序中需要配置外部样式表
  externalClasses: ['external-class'],
  
  // 配置在线图标库
  externalStyleSheets: [
    '//at.alicdn.com/t/c/font_4866695_uetnhwq310a.css'
  ]
};
