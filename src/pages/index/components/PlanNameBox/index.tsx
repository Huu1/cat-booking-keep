import Popup from "@/components/Popup";
import { Image, Input, View } from "@tarojs/components";
import { useState } from "react";
import SubTitleBox from "../SubTitleBox";
import house from "@/assets/images/房子.png";
import baskketball from "@/assets/images/篮球.png";
import badminton from "@/assets/images/羽毛球.png";
import headset from "@/assets/images/耳机.png";
import "./index.scss";
import { Icon, iconNames } from "@/components/Icon";

const PlanIconBox = ({ src }: { src: string }) => {
  return (
    <View className="planIconBox">
      <Image src={src}></Image>
    </View>
  );
};

const Index = () => {
  const [visible, setVisible] = useState(false);
  const [planIcon, setPlanIcon] = useState("房子");

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
            <Input placeholder="个人小金库" />
          </View>
          <View className="rightbtn">愿望清单</View>
        </View>
      </View>
      <Popup
        visible={visible}
        setVisible={setVisible}
        contentClassName="popup-content-box"
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
    </>
  );
};

export default Index;
