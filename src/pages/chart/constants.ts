/**
 * 生成饼图配置
 * @param title 标题
 * @param data 数据
 * @returns 饼图配置
 */
export const pieChartConfig = ({ title, data }) => ({
  type: "pie",
  data: [
    {
      id: "rank",
      values: data,
    },
  ],
  background: "transparent",
  outerRadius: 0.8,
  valueField: "value",
  categoryField: "type",
  title: {
    visible: true,
    text: title,
    align: "center",
  },
  label: {
    visible: true,
    position: "outside",
    style: {
      fill: (datum) => {
        return datum.labelColor;
      },
    },
  },
  pie: {
    style: {
      fill: (datum) => {
        return datum.color;
      },
    },
  },
});
