import {  Text, View } from "@tarojs/components";
import "./index.scss";
import PageContainer from "@/components/PageContainer";
import NavBar from "@/components/Navbar";
import { Calendar } from "@nutui/nutui-react-taro";
import { useState } from "react";
import dayjs from "dayjs";
import Button from "@/components/Button";
import PlanNameBox from "./components/PlanNameBox";
import SubTitleBox from "./components/SubTitleBox";

export const TitleBox = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => <View className={`boxTitle ${className}`}>{title}</View>;

const SaveTypeBox = () => {
  return (
    <View className="saveTypeBox">
      <Text>仅打卡记录</Text>
      <Text className="borderGrayLine">
        自行使用银行卡、存钱罐等方式管理存款，仅在小程序上记录打卡记录
      </Text>
      <Text>其他方式{">"}</Text>
    </View>
  );
};

const StartDateBox = ({
  date,
  setDate,
}: {
  date: string;
  setDate: (d: string) => void;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const openSwitch = () => {
    setIsVisible(true);
  };

  const closeSwitch = () => {
    setIsVisible(false);
  };

  const setChooseValue = (param) => {
    setDate(param[3]);
    setIsVisible(false);
  };

  return (
    <View className="startDateBox">
      <SubTitleBox title="开始时间" />
      <View onClick={openSwitch}>
        {date}
        <Calendar
          // autoBackfill
          visible={isVisible}
          defaultValue={date}
          onClose={closeSwitch}
          onConfirm={setChooseValue}
          showToday
          title="选择开始时间"
          confirmText="确认"
        />
      </View>
    </View>
  );
};

function Index() {
  const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));

  const [confirmLoading, setConfirmLoading] = useState(false);

  return (
    <PageContainer
      navBar={
        <NavBar title="365天存钱挑战" color="#000" background={"white"} />
      }
      bodyClassName="index-content-box"
    >
      <View className="topInfoImgeBox" >
        {/* <View>365天存钱</View>
        <View>将一年分为365天，每天存一笔钱，在起始金额的基础</View>
        <View>上每日递增，第n天需要存入的金额为起始金额*n。</View>
        <View></View> */}
      </View>

      <TitleBox title="设置365天存钱计划" />
      <PlanNameBox />

      <SubTitleBox title="存款方式" />
      <SaveTypeBox />

      <TitleBox title="设置基础信息" className="mb-0" />
      <StartDateBox date={startDate} setDate={setStartDate} />

      <View className="confirmPlanButtonBox">
        <Button
          size="large"
          loading={confirmLoading}
          onClick={() => {
            setConfirmLoading(true);
            setTimeout(function () {
              setConfirmLoading(false);
            }, 2000);
          }}
        >
          立即开始
        </Button>
      </View>
    </PageContainer>
  );
}

export default Index;
