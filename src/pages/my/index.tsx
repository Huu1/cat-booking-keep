import { View, Text, Image, Switch, ScrollView } from "@tarojs/components";
import { useState, useRef, useEffect } from "react";
import Taro from "@tarojs/taro";
import IconFont from "@/components/Iconfont";
import Layout from "@/components/Layout";
import NavBar from "@/components/Navbar";
import styles from "./index.module.less";
import { useAppStore } from "@/store";

const Index = () => {
  const { user } = useAppStore();
  const [scrollTop, setScrollTop] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(200);

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

  const handleScroll = (e) => {
    setScrollTop(e.detail.scrollTop);
  };

  return (
    <Layout
      bodyClassName={styles.myPageContainer}
    >
      <View className={styles.headerBg} style={{
        transform: `scale(${1 + scrollTop * 0.001})`,
        opacity: 1 - scrollTop * 0.005
      }} />

      <ScrollView
        className={styles.scrollView}
        scrollY
        enhanced
        showScrollbar={false}
        onScroll={handleScroll}
      >
        <View className={styles.container}>
          {/* 用户信息卡片 */}
          <View className={styles.profileCard}>
            <View className={styles.userInfo}>
              <Image
                className={styles.avatar}
                src={user?.avatar || 'https://img.yzcdn.cn/vant/cat.jpeg'}
                mode="aspectFill"
              />
              <View className={styles.userMeta}>
                <Text className={styles.username}>{user?.nickname || '未登录'}</Text>
                {!user ? (
                  <View className={styles.loginBtn} onClick={() => Taro.navigateTo({ url: '/pages/login/index' })}>
                    点击登录
                  </View>
                ) : (
                  <View className={styles.userStats}>
                    <View className={styles.statItem}>
                      <Text className={styles.statValue}>0</Text>
                      <Text className={styles.statLabel}>记账天数</Text>
                    </View>
                    <View className={styles.statDivider} />
                    <View className={styles.statItem}>
                      <Text className={styles.statValue}>0</Text>
                      <Text className={styles.statLabel}>记账笔数</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* 功能菜单 */}
          <View className={styles.menuGroup}>
            <View className={styles.menuHeader}>
              <IconFont type="icon-setting" size={16} color="#666" />
              <Text className={styles.menuTitle}>账户管理</Text>
            </View>
            <View className={styles.menuSection}>
              <View className={styles.menuItem} onClick={() => Taro.navigateTo({ url: '/pages/accounts/index' })}>
                <View className={styles.menuLeft}>
                  <View className={styles.iconContainer} style={{ backgroundColor: '#E6F7FF' }}>
                    <IconFont type="icon-wallet" size={20} color="#1890FF" />
                  </View>
                  <Text className={styles.menuText}>我的账户</Text>
                </View>
                <IconFont type="icon-you" size={16} color="#CCCCCC" />
              </View>
              <View className={styles.menuItem} onClick={() => Taro.navigateTo({ url: '/pages/books/index' })}>
                <View className={styles.menuLeft}>
                  <View className={styles.iconContainer} style={{ backgroundColor: '#FFF7E6' }}>
                    <IconFont type="icon-book" size={20} color="#FA8C16" />
                  </View>
                  <Text className={styles.menuText}>我的账本</Text>
                </View>
                <IconFont type="icon-you" size={16} color="#CCCCCC" />
              </View>
            </View>
          </View>

          <View className={styles.menuGroup}>
            <View className={styles.menuHeader}>
              <IconFont type="icon-app" size={16} color="#666" />
              <Text className={styles.menuTitle}>应用设置</Text>
            </View>
            <View className={styles.menuSection}>
              <View className={styles.menuItem} onClick={() => handleMenuClick('about')}>
                <View className={styles.menuLeft}>
                  <View className={styles.iconContainer} style={{ backgroundColor: '#E6FFFB' }}>
                    <IconFont type="icon-info" size={20} color="#13C2C2" />
                  </View>
                  <Text className={styles.menuText}>关于我们</Text>
                </View>
                <IconFont type="icon-you" size={16} color="#CCCCCC" />
              </View>
              <View className={styles.menuItem} onClick={() => handleMenuClick('group')}>
                <View className={styles.menuLeft}>
                  <View className={styles.iconContainer} style={{ backgroundColor: '#F6FFED' }}>
                    <IconFont type="icon-weixin" size={20} color="#52C41A" />
                  </View>
                  <Text className={styles.menuText}>加入微信群</Text>
                </View>
                <View className={styles.newBadge}>
                  <Text>新</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 页脚 */}
          <View className={styles.footer}>
            <Text className={styles.version}>365猫记账 v1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};

export default Index;
