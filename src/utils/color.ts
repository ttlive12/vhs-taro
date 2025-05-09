/**
 * 创建一个数值到 HSL 颜色的映射函数。
 *
 * @param rangeLength   区间总长度，例如 100 时，输入值会被限定到 [-50, +50]
 * @param negativeHue   负值时使用的色相（Hue），默认为 0（红色）
 * @param positiveHue   正值时使用的色相（Hue），默认为 120（绿色）
 * @returns             接受一个数值并返回对应 HSL 颜色字符串的函数
 */
export function createColorFn(
  rangeLength: number,
  negativeHue: number = 0,
  positiveHue: number = 120
) {
  const half = rangeLength / 2;

  return (value: number): string => {
    // 1. Clamp 到 [-half, +half]
    const v = Math.max(-half, Math.min(half, value));

    // 2. 根据正负选色相
    const hue = v >= 0 ? positiveHue : negativeHue;

    // 3. 饱和度按绝对值占半区间比例线性映射到 [0%, 100%]
    const saturation = Math.min((Math.abs(v) / half) * 100, 100);

    // 4. 固定亮度
    const lightness = 50;

    // 返回 hsl() 格式的 CSS 颜色字符串
    // hsl() 函数见 MDN 文档 :contentReference[oaicite:0]{index=0}
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };
}
