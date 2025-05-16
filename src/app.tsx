import { PropsWithChildren } from 'react';

import Taro, { getUpdateManager, useLaunch } from '@tarojs/taro';

import useSystemInfoStore from '@/store/systemInfo';

import './app.scss';

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    const updateManager = getUpdateManager();
    useSystemInfoStore.getState().fetchSystemInfo();
    updateManager.onUpdateReady(function () {
      Taro.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            updateManager.applyUpdate();
          }
        },
      });
    });
  });

  return <>{children}</>;
}

export default App;
