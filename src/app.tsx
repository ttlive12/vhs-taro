import { PropsWithChildren } from 'react';

import { useLaunch } from '@tarojs/taro';

import useSystemInfoStore from '@/store/systemInfo';

import './app.scss';

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    useSystemInfoStore.getState().fetchSystemInfo();
  });

  return <>{children}</>;
}

export default App;
