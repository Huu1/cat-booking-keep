import { View, Text, Image, Switch } from "@tarojs/components";
import { useState } from "react";
import Taro from "@tarojs/taro";
import IconFont from "@/components/Iconfont";
import Layout from "@/components/Layout";
import NavBar from "@/components/Navbar";
import styles from "./index.module.less";
import { useAppStore } from "@/store";

const Index = () => {
  const { user } = useAppStore();

  // 音效和震动的状态
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  // 处理菜单项点击
  const handleMenuClick = (type: string) => {
    switch (type) {
      case "group":
        Taro.showToast({
          title: "加入微信群",
          icon: "none",
        });
        break;
      case "survey":
        Taro.showToast({
          title: "参与问卷",
          icon: "none",
        });
        break;
      case "about":
        Taro.navigateTo({
          url: "/pages/about/index",
        });
        break;
      case "upgrade":
        Taro.showToast({
          title: "升级到APP",
          icon: "none",
        });
        break;
      default:
        break;
    }
  };

  return (
    <Layout
      currentTab="my"
      navBar={<NavBar title="个人中心" background="transparent" />}
      bodyClassName={styles.myPageContainer}
    >
      <View className={styles.container}>
        {/* 用户信息区域 */}
        <View className={styles.profileCard}>
          {user ? (
            <View className={styles.userInfo}>
              <Image
                className={styles.avatar}
                src="https://img.yzcdn.cn/vant/cat.jpeg"
                mode="aspectFill"
              />
              <View className={styles.userMeta}>
                <Text className={styles.username}>{user?.username}</Text>
                <View className={styles.userStats}>
                  <View className={styles.statItem}>
                    <Text className={styles.statValue}>365</Text>
                    <Text className={styles.statLabel}>记账天数</Text>
                  </View>
                  <View className={styles.statDivider} />
                  <View className={styles.statItem}>
                    <Text className={styles.statValue}>1024</Text>
                    <Text className={styles.statLabel}>记账笔数</Text>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View>请登录</View>
          )}
        </View>

        {/* 功能菜单区域 */}
        <View className={styles.menuGroup}>
          <View className={styles.menuHeader}>
            <IconFont type="icon-community" size={16} color="#666" />
            <Text className={styles.menuTitle}>社区与支持</Text>
          </View>
          <View className={styles.menuSection}>
            <View
              className={styles.menuItem}
              onClick={() => handleMenuClick("group")}
            >
              <View className={styles.menuLeft}>
                <View
                  className={styles.iconContainer}
                  style={{ background: "rgba(95, 184, 120, 0.1)" }}
                >
                  <IconFont type="icon-weixin" size={20} color="#5fb878" />
                </View>
                <Text className={styles.menuText}>加入微信群</Text>
              </View>
              <IconFont type="icon-youbian" size={14} color="#ccc" />
            </View>

            <View
              className={styles.menuItem}
              onClick={() => handleMenuClick("survey")}
            >
              <View className={styles.menuLeft}>
                <View
                  className={styles.iconContainer}
                  style={{ background: "rgba(250, 173, 20, 0.1)" }}
                >
                  <IconFont
                    type="icon-wenjuantoupiao"
                    size={20}
                    color="#faad14"
                  />
                </View>
                <Text className={styles.menuText}>参与问卷</Text>
              </View>
              <IconFont type="icon-youbian" size={14} color="#ccc" />
            </View>

            <View
              className={styles.menuItem}
              onClick={() => handleMenuClick("about")}
            >
              <View className={styles.menuLeft}>
                <View
                  className={styles.iconContainer}
                  style={{ background: "rgba(24, 144, 255, 0.1)" }}
                >
                  <IconFont type="icon-guanyu" size={20} color="#1890ff" />
                </View>
                <Text className={styles.menuText}>关于我们</Text>
              </View>
              <IconFont type="icon-youbian" size={14} color="#ccc" />
            </View>
          </View>
        </View>

        {/* 设置区域 */}
        <View className={styles.menuGroup}>
          <View className={styles.menuHeader}>
            <IconFont type="icon-setting" size={16} color="#666" />
            <Text className={styles.menuTitle}>设置</Text>
          </View>
          <View className={styles.menuSection}>
            <View className={styles.menuItem}>
              <View className={styles.menuLeft}>
                <View
                  className={styles.iconContainer}
                  style={{ background: "rgba(250, 140, 22, 0.1)" }}
                >
                  <IconFont
                    type="icon-yinxiao-dianji"
                    size={20}
                    color="#fa8c16"
                  />
                </View>
                <Text className={styles.menuText}>音效</Text>
              </View>
              <Switch
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.detail.value)}
                color="#1677ff"
                className={styles.switchBtn}
              />
            </View>

            <View className={styles.menuItem}>
              <View className={styles.menuLeft}>
                <View
                  className={styles.iconContainer}
                  style={{ background: "rgba(114, 46, 209, 0.1)" }}
                >
                  <IconFont
                    type="icon-zhendongchuanganqi"
                    size={20}
                    color="#722ed1"
                  />
                </View>
                <Text className={styles.menuText}>震动</Text>
              </View>
              <Switch
                checked={vibrationEnabled}
                onChange={(e) => setVibrationEnabled(e.detail.value)}
                color="#1677ff"
                className={styles.switchBtn}
              />
            </View>
          </View>
        </View>

        <View className={styles.footer}>
          <Text className={styles.version}>记账 v1.0.0</Text>
        </View>
      </View>
    </Layout>
  );
};

export default Index;
