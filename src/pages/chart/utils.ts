import { Class, classColorMap, classNameMap } from "@/constants";
import { Archetypes } from "@/models";
import { mix } from "@/utils";

export interface PieChartData {
  type: string;
  value: string;
  color: string;
  labelColor: string;
}

/**
 * 计算职业分布数据
 * @param archetypesData 卡组数据数组
 * @returns 按职业分类的流行度总和
 */
export const calcClassData = (archetypesData: Archetypes[]): PieChartData[] => {
  // 创建一个Map来存储每个职业的流行度总和
  const classMap = new Map<Class, number>();

  // 遍历所有卡组数据，按职业累加流行度
  archetypesData.forEach((archetype) => {
    const currentValue = classMap.get(archetype.class) || 0;
    classMap.set(archetype.class, currentValue + archetype.popularityPercent);
  });

  // 将Map转换为ClassData数组
  const result: PieChartData[] = Array.from(classMap.entries())
    .filter(([type]) => type !== Class.UNKNOWN)
    .map(([type, value]) => ({
      type: classNameMap[type],
      value: value.toString(),
      color: classColorMap[type] || "#000000",
      labelColor: mix(classColorMap[type], "#000000", 0.3),
    }));

  // 根据流行度降序排序
  return result.sort((a, b) => Number(b.value) - Number(a.value));
};

/**
 * 卡组分布数据
 * @param archetypesData 卡组数据数组
 * @returns 按职业分类的流行度总和
 */
export const calcArchetypeData = (
  archetypesData: Archetypes[]
): PieChartData[] => {
  // 计算所有卡组比例总和
  const total = archetypesData.reduce(
    (acc, curr) => acc + curr.popularityPercent,
    0
  );

  // 计算未知卡组比例
  const unknown = 100 - total;

  const result = archetypesData.map((archetype) => ({
    type: archetype.zhName,
    value: archetype.popularityPercent.toString(),
    color: classColorMap[archetype.class],
    labelColor: mix(classColorMap[archetype.class], "#000000", 0.3),
  }));

  return [
    ...result,
    {
      type: "其他",
      value: unknown.toString(),
      color: "#000000",
      labelColor: "#000000",
    },
  ].sort((a, b) => Number(b.value) - Number(a.value));
};
