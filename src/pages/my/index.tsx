import { View, Text, Image, ScrollView, Button, Input } from "@tarojs/components";
import Taro from "@tarojs/taro";
import IconFont from "@/components/Iconfont";
import Layout from "@/components/Layout";
import styles from "./index.module.less";
import { useAppStore } from "@/store";
import { updateUser } from "./service";

const Index = () => {
  const { user, logout, updateUserInfo } = useAppStore();

  const handleLogin = () => {
    Taro.navigateTo({
      url: "/pages/login/index",
    });
  };

  const handleLogout = () => {
    Taro.showModal({
      title: "提示",
      content: "确定要退出登录吗？",
      success: function (res) {
        if (res.confirm) {
          logout();
        }
      },
    });
  };

  const handleMenuClick = (type) => {
    switch (type) {
      case "about":
        Taro.navigateTo({ url: "/pages/about/index" });
        break;
      case "feedback":
        Taro.navigateTo({ url: "/pages/feedback/index" });
        break;
      default:
        break;
    }
  };

  const onChooseAvatar = (e) => {
    const { avatarUrl } = e.detail;
    if(!user) return;
    if (avatarUrl) {
      updateUser({
        avatar: avatarUrl,
      });
    }
    updateUserInfo({
      ...user,
      avatar: avatarUrl,
    });
  };

  const handleNicknameChange = (e) => {
    const { value } = e.detail;
    if(!user) return;
    if (value) {
      updateUser({
        nickname: value
      });
      updateUserInfo({
        ...user,
        nickname: value
      });
    }
  };

  return (
    <Layout
      currentTab="my"
      // navBar={<NavBar title="个人中心" background="transparent" color="#fff" />}
      bodyClassName={styles.myPageContainer}
    >
      <View className={styles.headerBg} />

      <ScrollView className={styles.scrollView} scrollY>
        <View className={styles.container}>
          {/* 用户信息卡片 */}
          <View className={styles.profileCard}>
            {user ? (
              <View className={styles.userInfo}>
                <View className={styles.avatarContainer}>
                  <Button
                    open-type="chooseAvatar"
                    onChooseAvatar={onChooseAvatar}
                    className={styles.avatarButton}
                  >
                    <Image
                      className={styles.avatar}
                      src={user.avatar || "https://img.yzcdn.cn/vant/cat.jpeg"}
                      mode="aspectFill"
                    />
                    <View className={styles.avatarEditIcon}>
                      <IconFont type="icon-edit" size={16} color="#fff" />
                    </View>
                  </Button>
                </View>

                <View className={styles.userMeta}>
                  <View className={styles.nameContainer}>
                    <Input
                      className={styles.usernameInput}
                      value={user.nickname || ""}
                      type="nickname"
                      placeholder="点击设置名称"
                      onBlur={handleNicknameChange}
                      maxlength={20}
                    />
                    <IconFont type="icon-edit" size={14} color="#999" />
                  </View>

                  <View className={styles.userStats}>
                    <View className={styles.statItem}>
                      <Text className={styles.statValue}>30</Text>
                      <Text className={styles.statLabel}>记账天数</Text>
                    </View>
                    <View className={styles.statItem}>
                      <Text className={styles.statValue}>128</Text>
                      <Text className={styles.statLabel}>记账笔数</Text>
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              <View className={styles.notLoginContainer}>
                <View className={styles.defaultAvatarContainer}>
                  <Image
                    className={styles.defaultAvatar}
                    src="https://img.yzcdn.cn/vant/cat.jpeg"
                    mode="aspectFill"
                  />
                  <View className={styles.defaultAvatarOverlay}>
                    <IconFont type="icon-user" size={24} color="#fff" />
                  </View>
                </View>
                <View className={styles.loginTips}>
                  <Text className={styles.loginTipsText}>
                    登录后体验更多功能
                  </Text>
                  <View className={styles.loginBtn} onClick={handleLogin}>
                    <Text>立即登录</Text>
                    <IconFont type="icon-you" size={14} color="#fff" style={{ marginLeft: '8px' }} />
                  </View>
                </View>
              </View>
            )}
          </View>

          <View className={styles.menuGroup}>
            <View className={styles.menuHeader}>
              <IconFont type="icon-setting" size={18} color="#3f51b5" />
              <Text className={styles.menuTitle}>设置</Text>
            </View>
            <View className={styles.menuSection}>
              <View
                className={styles.menuItem}
                onClick={() => handleMenuClick("about")}
              >
                <View className={styles.menuLeft}>
                  <View
                    className={styles.iconWrapper}
                    style={{ backgroundColor: '#E8EAF6' }}
                  >
                    <IconFont type="icon-info" size={22} color="#3f51b5" />
                  </View>
                  <Text className={styles.menuText}>关于我们</Text>
                </View>
                <IconFont type="icon-you" size={16} color="#BDBDBD" />
              </View>
              <View
                className={styles.menuItem}
                onClick={() => handleMenuClick("feedback")}
              >
                <View className={styles.menuLeft}>
                  <View
                    className={styles.iconWrapper}
                    style={{ backgroundColor: '#E8F5E9' }}
                  >
                    <IconFont type="icon-message" size={22} color="#4CAF50" />
                  </View>
                  <Text className={styles.menuText}>意见反馈</Text>
                </View>
                <View className={styles.badge}>
                  <Text>新</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 退出登录按钮 */}
          {user && (
            <View className={styles.logoutBtnWrap}>
              <View className={styles.logoutBtn} onClick={handleLogout}>
                退出登录
              </View>
            </View>
          )}

          <View className={styles.footer}>
            <Text className={styles.version}>365猫记账 v1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};

export default Index;
