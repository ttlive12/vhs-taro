import React, { useEffect, useState } from "react";

import { Button, Empty } from "@taroify/core";
import { Text,View } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import { AxiosError } from "axios";

import { AxiosErrorNameMap } from "@/constants/error";

import "./index.scss";

const ErrorPage: React.FC = () => {
  const router = useRouter();
  const [errorInfo, setErrorInfo] = useState({
    code: "",
    message: "",
    status: "",
    description: "",
  });

  useEffect(() => {
    const { code = "", message = "", status = "" } = router.params;
    const decodedMessage = decodeURIComponent(message);
    const description = AxiosErrorNameMap[code] || "未知错误";

    setErrorInfo({
      code,
      message: decodedMessage,
      status,
      description,
    });
  }, [router.params]);

  const handleGoHome = () => {
    Taro.reLaunch({
      url: "/pages/rank/index",
    });
  };

  // 判断是否为网络错误
  const isNetworkError = errorInfo.code === AxiosError.ERR_NETWORK;

  return (
    <View className='error-page'>
      <View className='error-content'>
        <Empty>
          <Empty.Image src={isNetworkError ? "network" : "error"} />
          <Empty.Description>{errorInfo.description}</Empty.Description>
          {errorInfo.message && (
            <Text className='error-message'>{errorInfo.message}</Text>
          )}

          <View className='error-actions'>
            <Button className='home-btn' color='primary' onClick={handleGoHome}>
              重新加载
            </Button>
          </View>
        </Empty>
      </View>
    </View>
  );
};

export default ErrorPage;
