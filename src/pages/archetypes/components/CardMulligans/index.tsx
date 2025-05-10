import { View, Text, Image } from "@tarojs/components";
import { useRequest } from "ahooks";
import { useState } from "react";

import { getArchetypeMulligan } from "@/api";
import { CardFrame, TitleBar, Loading } from "@/components";
import { useRankBarStore } from "@/store/rankBar";
import { Mode } from "@/constants";

import "./index.scss";
import { createColorFn } from "@/utils";
import { sort } from "@/assets/svg";
import { Exchange } from "@taroify/icons";

interface CardMulligansProps {
  mode: Mode;
  archetype: string;
}

type SortType = "mulliganImpact" | "drawnImpact" | "keptImpact";

const getColor = createColorFn(30);

const CardMulligans: React.FC<CardMulligansProps> = ({ mode, archetype }) => {
  const { currentType } = useRankBarStore();
  const [sortType, setSortType] = useState<SortType>("mulliganImpact");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // 使用useRequest请求数据
  const { data, loading } = useRequest(
    () => getArchetypeMulligan(mode, archetype),
    {
      refreshDeps: [mode, archetype],
    }
  );

  // 处理排序
  const handleSort = (type: SortType) => {
    if (sortType === type) {
      // 如果是当前排序字段，切换排序顺序
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // 如果是新的排序字段，设置为降序
      setSortType(type);
      setSortOrder("desc");
    }
  };

  // 获取排序后的数据
  const getSortedData = () => {
    if (!data?.[currentType]) return [];

    const getValue = (item, key) => {
      const value = item[key];
      if (typeof value === "string") {
        return parseFloat(value.replace("%", "")) || 0;
      }
      return typeof value === "number" ? value : 0;
    };

    return [...data[currentType]].sort((a, b) => {
      const aValue = getValue(a, sortType);
      const bValue = getValue(b, sortType);
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });
  };

  const sortedData = getSortedData();

  // 渲染卡片内容
  const renderCardContent = () => {
    if (loading) {
      return <Loading size="small" style={{ margin: "100px 0" }} />;
    }

    if (!data?.[currentType] || data[currentType].length === 0) {
      return (
        <View className="no-data">
          <Text>暂无数据</Text>
          {data && Object.values(data).flat().length > 0 ? (
            <View className="tip">您可以选择切换分段查看相关数据</View>
          ) : (
            <View className="tip">当前卡组样本量小，以后再来查看吧</View>
          )}
        </View>
      );
    }

    return (
      <View className="cards">
        <View className="cards-header">
          <View className="sort-header" style={{ gridColumn: 1 }}>
            <Text>卡牌</Text>
          </View>
          <View
            className="sort-header"
            style={{ gridColumn: 2 }}
            onClick={() => handleSort("mulliganImpact")}
          >
            <Text>携带影响</Text>
            <Image
              className={`sort-icon ${
                sortType === "mulliganImpact"
                  ? sortOrder === "asc"
                    ? "asc"
                    : "desc"
                  : ""
              }`}
              src={sort}
            />
          </View>
          <View
            className="sort-header"
            style={{ gridColumn: 3 }}
            onClick={() => handleSort("drawnImpact")}
          >
            <Text>抽到影响</Text>
            <Image
              className={`sort-icon ${
                sortType === "drawnImpact"
                  ? sortOrder === "asc"
                    ? "asc"
                    : "desc"
                  : ""
              }`}
              src={sort}
            />
          </View>
          <View
            className="sort-header"
            style={{ gridColumn: 4 }}
            onClick={() => handleSort("keptImpact")}
          >
            <Text>保留影响</Text>
            <Image
              className={`sort-icon ${
                sortType === "keptImpact"
                  ? sortOrder === "asc"
                    ? "asc"
                    : "desc"
                  : ""
              }`}
              src={sort}
            />
          </View>
        </View>

        {sortedData.map((item) => (
          <View className="cards-item" key={item.id}>
            <View className="cards-item-card" style={{ gridColumn: 1 }}>
              <CardFrame
                cardId={item.id}
                cost={item.cost}
                name={item.name}
                rarity={item.rarity}
              />
            </View>
            <Text
              style={{
                gridColumn: 2,
                color: getColor(item.mulliganImpact),
              }}
            >
              {item.mulliganImpact}
            </Text>
            <Text
              style={{
                gridColumn: 3,
                color: getColor(item.drawnImpact),
              }}
            >
              {item.drawnImpact}
            </Text>
            <Text
              style={{
                gridColumn: 4,
                color: getColor(item.keptImpact),
              }}
            >
              {item.keptImpact}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View className="card-mulligans">
      <TitleBar
        className="card-mulligans-title-bar"
        title="调度建议"
        icon={<Exchange size={18} />}
        tips="各卡牌的携带，抽到，保留对胜率的影响。（仅展示有一定携带数量的卡牌，数据样本小的卡牌数据可信度低）"
      />
      {renderCardContent()}
    </View>
  );
};

export default CardMulligans;
