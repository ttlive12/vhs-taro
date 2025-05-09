import { PropsWithChildren } from "react";
import { useLaunch } from "@tarojs/taro";

import "./app.scss";
import { View } from "@tarojs/components";

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log("App launched.");
  });

  return (
    <>
      <View className="background" />
      {children}
    </>
  );
}

export default App;
