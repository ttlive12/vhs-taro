export default defineAppConfig({
  pages: ["pages/rank/index", "pages/deck/index", "pages/discover/index"],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "Taro App",
    navigationBarTextStyle: "black",
  },
  tabBar: {
    custom: true,
    list: [
      {
        text: "排行榜",
        pagePath: "pages/rank/index",
      },
      {
        text: "卡组",
        pagePath: "pages/deck/index",
      },
      {
        text: "发现",
        pagePath: "pages/discover/index",
      },
    ],
  },
});
