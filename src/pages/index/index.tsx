import React, { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import PageContainer from "@/components/PageContainer";
import NavBar from "@/components/Navbar";
import MonthSwitcher, { formatDate } from "@/components/MonthSwitcher";
import MonthStatic from "./monthStatic";
import styles from "./index.module.less";
import useRequest from "@/hooks/useRequest";
import { getMonthlyStats } from "./service";

const Index = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { loading, data, run } = useRequest(getMonthlyStats, {
    manual: true,
  });

  useEffect(() => {
    run(formatDate(currentDate));
  }, [currentDate]);

  return (
    <PageContainer
      navBar={<NavBar title="首页" color="#000" background={"white"} />}
      bodyClassName={styles.homeWrapBox}
    >
      <View className={styles.wellcomeTitle}>Hi早上好!</View>
      <MonthSwitcher
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
      />

      <MonthStatic {...data} />
    </PageContainer>
  );
};

export default Index;
