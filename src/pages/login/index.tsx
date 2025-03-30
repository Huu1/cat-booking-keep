import { View, Text, Image, Checkbox } from "@tarojs/components";
import { useState } from "react";
import Taro from "@tarojs/taro";
import { useAppStore } from "@/store";
import styles from "./index.module.less";
import { request } from "@/utils/request";

const Login = () => {
  const [isAgreed, setIsAgreed] = useState(false);
  const { getUserInfo } = useAppStore();

  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleLogin = async () => {
    setConfirmLoading(true);
    try {
      // Step 1: 获取 code
      const { code } = await Taro.login();
      // Step 2: 发送 code 到服务端
      const { access_token } = await request.post("/auth/login/wechat", {
        code,
      });

      if (access_token) {
        // Step 4: 存储 token
        Taro.setStorageSync("token", access_token);
        Taro.showToast({
          title: "登录成功",
          duration: 1500,
          success() {
            getUserInfo().then(() => {
              Taro.redirectTo({
                url: "/pages/index/index",
              });
            });
          },
        });
      }
    } catch (error) {
      console.log(error);
      Taro.showToast({ title: "登录失败", icon: "none" });
    }

    setConfirmLoading(false);
  };

  const handleWechatLogin = async () => {
    if (confirmLoading) return;
    if (!isAgreed) {
      Taro.showToast({
        title: "请先同意用户协议和隐私政策",
        icon: "none",
      });
      return;
    }

    handleLogin();

    // try {
    //   await getUserInfo();
    //   Taro.switchTab({
    //     url: '/pages/index/index'
    //   });
    // } catch (error) {
    //   Taro.showToast({
    //     title: '登录失败，请重试',
    //     icon: 'none'
    //   });
    // }
  };

  const handleCancel = () => {
    Taro.navigateBack();
  };

  const handlePrivacyClick = () => {
    Taro.navigateTo({
      url: "/pages/privacy/index",
    });
  };

  const handleUserAgreementClick = () => {
    Taro.navigateTo({
      url: "/pages/agreement/index",
    });
  };

  return (
    <View className={styles.loginContainer}>
      <View className={styles.logoSection}>
        {/* <Image
          className={styles.logo}
          src='/assets/images/勾子.png'
          mode='aspectFit'
        /> */}
        <Text className={styles.appName}>记账</Text>
      </View>

      <View className={styles.actionSection}>
        <View className={styles.wechatBtn} onClick={handleWechatLogin}>
          微信登录
        </View>
        <View className={styles.cancelBtn} onClick={handleCancel}>
          取消登录
        </View>
      </View>

      <View className={styles.agreementSection}>
        <Checkbox
          className={styles.checkbox}
          checked={isAgreed}
          onClick={() => setIsAgreed(!isAgreed)}
        />
        <Text className={styles.agreementText}>
          已阅读并同意
          <Text className={styles.link} onClick={handleUserAgreementClick}>
            《用户协议》
          </Text>
          及
          <Text className={styles.link} onClick={handlePrivacyClick}>
            《隐私协议》
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default Login;
