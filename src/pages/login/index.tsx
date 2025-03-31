import { View, Text, Image, Checkbox } from "@tarojs/components";
import { useState } from "react";
import Taro from "@tarojs/taro";
import { useAppStore } from "@/store";
import styles from "./index.module.less";
import { request } from "@/utils/request";
import IconFont from "@/components/Iconfont";

const Login = () => {
  const [isAgreed, setIsAgreed] = useState(false);
  const { getUserInfo } = useAppStore();

  const [confirmLoading, setConfirmLoading] = useState(false);

  // 处理登录逻辑
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
          duration: 2000,
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
      // 如果未勾选协议，弹出确认框
      Taro.showModal({
        title: '温馨提示',
        content: '登录即表示您已同意《用户协议》和《隐私协议》',
        confirmText: '同意',
        confirmColor: '#FFB800',
        cancelText: '取消',
        success: function(res) {
          if (res.confirm) {
            // 用户点击确定，自动勾选并登录
            setIsAgreed(true);
            handleLogin();
          }
        }
      });
      return;
    }

    // 已勾选协议，直接登录
    handleLogin();
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
        <Image
          className={styles.logo}
          src='/assets/images/logo.png'
          mode='aspectFit'
        />
        <Text className={styles.appName}>365猫记账</Text>
        <Text className={styles.appSlogan}>轻松记账，智慧生活</Text>
      </View>

      <View className={styles.actionSection}>
        <View className={styles.wechatBtn} onClick={handleWechatLogin}>
          <IconFont type="icon-wechat" size={28} color="#333" style={{ marginRight: '12rpx' }} />
          微信一键登录
        </View>
        <View className={styles.cancelBtn} onClick={handleCancel}>
          暂不登录
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
