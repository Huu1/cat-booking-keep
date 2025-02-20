import Popup from "@/components/Popup";
import { Image, Input, ScrollView, View } from "@tarojs/components";
import { useState } from "react";
import SubTitleBox from "../SubTitleBox";
import "./index.scss";
import { Icon, iconNames } from "@/components/Icon";

const planNameList = [
  "存钱去旅游",
  "存钱买辆车",
  "存钱养可爱猫咪",
  "存钱买一台新手机",
  "存钱看一场演唱会",
  "存钱买包包",
  "个人小金库",
  "零花钱小金库",
  "秘密小金库",
];

const Index = () => {
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [planIcon, setPlanIcon] = useState("房子");
  const [planName, setPlanName] = useState("");

  return (
    <>
      <View className="planNameBox">
        <View
          className="planIcon"
          onClick={() => {
            setVisible(true);
          }}
        >
          <Icon name={planIcon} />
        </View>
        <View className="planNameRightBox">
          <View className="borderGrayLine nameBox">
            <SubTitleBox title="计划名称" className="m-0" />
            <Input
              placeholder="个人小金库"
              value={planName}
              onInput={(e) => {
                setPlanName(e.detail.value);
              }}
            />
          </View>
          <View
            className="rightbtn"
            onClick={() => {
              setVisible2(true);
            }}
          >
            愿望清单
          </View>
        </View>
      </View>
      <Popup
        visible={visible}
        setVisible={setVisible}
        contentClassName="popup-content-box-plan-icon"
      >
        <View>选择计划封面</View>

        <View>
          {iconNames.map((i) => {
            return (
              <View
                className={`planIconBox ${i === planIcon ? "checked" : ""} `}
                key={i}
                onClick={() => {
                  setPlanIcon(i);
                  setVisible(false);
                }}
              >
                <Icon name={i} />
              </View>
            );
          })}
        </View>
      </Popup>

      <Popup
        visible={visible2}
        setVisible={setVisible2}
        contentClassName="popup-content-box-planname"
      >
        <View>选择我的存钱愿望清单</View>

        <ScrollView
          scrollY
          enhanced
          scrollWithAnimation
          lowerThreshold={20}
          upperThreshold={20}
          className="planname-list"
        >
          {planNameList.map((i) => {
            return (
              <View
                key={i}
                className={`${i === planName ? "checked" : ""} planname-item`}
                onClick={() => {
                  setPlanName(i);
                  setVisible2(false);
                }}
              >
                {i}
              </View>
            );
          })}
        </ScrollView>
      </Popup>
    </>
  );
};

export default Index;
