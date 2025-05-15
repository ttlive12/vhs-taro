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

/**
 * 将两个十六进制颜色按给定权重混合
 * @param color1 第一个颜色，例如 "#ff0000"
 * @param color2 第二个颜色，例如 "#0000ff"
 * @param weight 权重，0~1 之间，0 = 全 color1，1 = 全 color2
 * @returns 混合后的颜色（hex 格式）
 */
export function mix(color1: string, color2: string, weight: number = 0.5): string {
  // 去掉 # 符号并转换成 RGB 数字
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  if (!c1 || !c2) throw new Error('Invalid color format');

  const r = Math.round(c1.r + (c2.r - c1.r) * weight);
  const g = Math.round(c1.g + (c2.g - c1.g) * weight);
  const b = Math.round(c1.b + (c2.b - c1.b) * weight);

  return rgbToHex(r, g, b);
}

// 辅助函数：将 hex 转 RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map(c => c + c)
      .join('');
  }
  if (hex.length !== 6) return null;
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 0xff,
    g: (num >> 8) & 0xff,
    b: num & 0xff,
  };
}

// 辅助函数：将 RGB 转 hex
function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
}
