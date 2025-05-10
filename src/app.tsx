import { PropsWithChildren } from "react";
import { useLaunch } from "@tarojs/taro";

import "./app.scss";
import Taro from "@tarojs/taro";

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log("App launched.");
  });

  Taro.loadFontFace({
    family: "mode",
    source: `url("https://at.alicdn.com/wf/webfont/G2dyfJYkXZQ2/HGpCcupzDbip.woff2") format("woff2"),url("https://at.alicdn.com/wf/webfont/G2dyfJYkXZQ2/Wxf8BEonqx4q.woff") format("woff")`,
  });

  Taro.loadFontFace({
    family: "iconfont",
    source: `url("https://at.alicdn.com/t/c/font_4916986_f0vp70s92zt.woff2?t=1746898544738") format("woff2"),url("https://at.alicdn.com/t/c/font_4916986_f0vp70s92zt.woff?t=1746898544738") format("woff"),url("https://at.alicdn.com/t/c/font_4916986_f0vp70s92zt.ttf?t=1746898544738") format("truetype")`,
  });
  return <>{children}</>;
}

export default App;
