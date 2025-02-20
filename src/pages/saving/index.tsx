import React, { useState } from "react";
import NavBar from "@/components/Navbar";
import PageContainer from "@/components/PageContainer";
import { View } from "@tarojs/components";
import Calendar from "./Calendar/Calendar";

function Index() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <PageContainer
      navBar={
        <NavBar back title="365天存钱挑战" color="#000" background={"white"} />
      }
      bodyClassName="index-content-box"
    >
      <View>
        <Calendar startDate={ new Date('2025-2-20')} />
      </View>
    </PageContainer>
  );
}

export default Index;
