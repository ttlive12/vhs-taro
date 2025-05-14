/**
 * 限制数字范围
 * @param limit 限制范围
 * @returns 限制后的数字
 */
export function limitNumber(limit: number): (num: number) => number {
  return function (num: number): number {
    if (num > limit) {
      return limit;
    } else if (num < -limit) {
      return -limit;
    }
    return num;
  };
}
