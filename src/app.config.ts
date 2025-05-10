export default defineAppConfig({
  pages: [
    "pages/rank/index",
    "pages/decks/index",
    "pages/discover/index",
    "pages/archetypes/index",
    "pages/error/index",
  ],
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
        pagePath: "pages/decks/index",
      },
      {
        text: "发现",
        pagePath: "pages/discover/index",
      },
    ],
  },
});
