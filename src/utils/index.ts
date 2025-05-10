export * from "./sleep";
export * from "./color";

/**
 * 格式化时间显示
 * @param updateTime ISO格式的时间字符串
 * @returns 格式化后的显示文本
 */
export const formatTime = (updateTime: string): string => {
  // 解析更新时间
  const updateDateTime = new Date(updateTime);
  // 获取当前时间
  const currentDateTime = new Date();

  // 计算时间差（毫秒）
  const timeDiff = currentDateTime.getTime() - updateDateTime.getTime();
  // 转换为小时
  const hoursDiff = timeDiff / (1000 * 60 * 60);

  // 根据规则确定显示文本
  if (hoursDiff < 0) {
    // 处理未来时间的情况
    return "刚刚";
  } else if (hoursDiff < 2) {
    return "一个小时内";
  } else if (hoursDiff < 3) {
    return "两个小时前";
  } else if (hoursDiff < 4) {
    return "三个小时前";
  } else if (hoursDiff < 5) {
    return "四个小时前";
  } else if (hoursDiff < 6) {
    return "五个小时前";
  } else if (hoursDiff < 7) {
    return "六个小时前";
  } else if (hoursDiff < 8) {
    return "七个小时前";
  } else if (hoursDiff < 9) {
    return "八个小时前";
  } else if (hoursDiff < 10) {
    return "九个小时前";
  } else {
    return "最近半天内";
  }
};
