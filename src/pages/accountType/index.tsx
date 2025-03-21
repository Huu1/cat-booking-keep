import React from "react";
import { View, Text } from "@tarojs/components";
import NavBar from "@/components/Navbar";
import Layout from "@/components/Layout";
import AccountSection from "./components/AccountSection";
import { useRequest } from "taro-hooks";
import { getAccountTempletes } from "./service";
import styles from "./index.module.less";
import Taro from "@tarojs/taro";

const Index = () => {
  const { data = [] } = useRequest(getAccountTempletes);

  const handleTemplateClick = (template) => {
    Taro.navigateTo({
      url: '/pages/addAccount/index',
      success: function(res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          templateId: template.id,
          icon: template.icon,
          name: template.name
        });
      }
    });
  };

  return (
    <Layout
      navBar={<NavBar title="选择类型" back color="#000" background="white" />}
      bodyClassName={styles.container}
      showTabBar={false}
    >
      {data?.map((item) => (
        <AccountSection
          key={item.type}
          data={item}
          onTemplateClick={handleTemplateClick}
        />
      ))}
    </Layout>
  );
};

export default Index;
