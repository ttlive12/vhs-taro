# VHS-Taro

### 技术栈

- 框架：Taro4
- 组件库：Taroify
- 状态管理： zustand
- 图表库：taro-vchart
- 通用hooks/utils库
  - ahooks
- Taro包
  - components-advanced现代组件库包-使用虚拟瀑布流组件
- Taro插件
  - plugin-http,提供axios请求适配器

#### 包体积优化

- 分包
  - 所有tabbar页在主包，非首屏加载页放到子包
    - 依赖自动分包插件：https://docs.taro.zone/docs/mini-split-chunks-plugin
- 静态资源优化
  - 首屏Icon&非svg/字体图片使用png
  - 单色Icon使用字体图标
  - 复杂颜色Icon使用svg

#### 性能优化

- 虚拟列表/双列瀑布流
- React.memo, useMemo和useCallback缓存
- 复杂逻辑使用useRef代替useState - useMemo - useCallBack链，减少重新渲染
- 搜索框防抖，触底加载节流
- 分页 + 数据缓存
- 预请求
- 代码懒加载

#### 业务逻辑

- 自定义局部下拉菜单组件 CustomDropDown
- rankBar拖拽排序 - scrollView小程序原生API
- 全局store
  - 模式，排行榜选中，顺序，使用persist插件持久化储存
  - 访问记录 + 广告配置
- webpack全局注入scss
- 埋点: 基础信息自动上报，响应拦截器封装请求埋点
- rpx-px转换

TODO：

1. 分享
2. 卡组页段位切换下拉框自动关闭
3. 卡牌preview返回再进重新显示
4. 广告秒退逻辑
5. 排序动画

提示词
代码注意事项：
这是一个Taro React的小程序项目。代码符合项目整体代码风格和规范，使用ahooks的useRequest等
组件拆分清晰，分工明确，性能高效，TS类型安全，尽量不造成不必要的重新渲染，尽量避免linter错误。
