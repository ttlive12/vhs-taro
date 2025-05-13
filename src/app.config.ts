export default defineAppConfig({
  pages: [
    "pages/rank/index",
    "pages/decks/index",
    "pages/discover/index",
    "pages/archetypes/index",
    "pages/error/index",
    "pages/decks/detail/index",
    "pages/chart/index",
  ],
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
  lazyCodeLoading: "requiredComponents",
});
