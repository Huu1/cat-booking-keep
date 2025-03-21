import { useState, useEffect } from "react";
import { View, Text, Input } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Button, SafeArea } from "@nutui/nutui-react-taro";
import Layout from "@/components/Layout";
import NavBar from "@/components/Navbar";
import IconFont from "@/components/Iconfont";
import styles from "./index.module.less";
import { useRequest } from "taro-hooks";
import { addAccount } from "./service";

const AddAccount = () => {
  const [accountName, setAccountName] = useState("");
  const [description, setDescription] = useState("");
  const [balance, setBalance] = useState("");
  const [templateInfo, setTemplateInfo] = useState<any>(null);

  // 获取路由参数
  useEffect(() => {
    const instance = Taro.getCurrentInstance();
    const params = instance?.router?.params || {};
    // @ts-ignore
    const eventChannel = instance?.page?.getOpenerEventChannel();

    // 从路由参数或事件通道获取数据
    eventChannel?.on("acceptDataFromOpenerPage", (data) => {
      setTemplateInfo({
        id: params.templateId || data.templateId,
        icon: params.icon || data.icon,
        name: params.name || data.name,
      });
    });
  }, []);

  const { loading, run: save } = useRequest(addAccount, {
    manual: true,
    onSuccess: (data) => {
      Taro.showToast({
        title: "创建成功",
        icon: "success",
      });
      Taro.redirectTo({
        url: '/pages/account/index'
      });
    },
    onError: (error) => {
      Taro.showToast({
        title: "创建失败",
        icon: "none",
      });
    },
  });

  // 处理账户名称变更
  const handleNameChange = (e) => {
    setAccountName(e.detail.value);
  };

  // 处理备注变更
  const handleNoteChange = (e) => {
    setDescription(e.detail.value);
  };

  // 处理金额
  const handleBalanceChange = (e) => {
    const value = e.detail.value;
    // 只允许数字和小数点，且小数点后最多两位
    const reg = /^\d*\.?\d{0,2}$/;
    if (reg.test(value) || value === "") {
      setBalance(value);
    }
  };

  // 提交表单
  const handleSubmit = () => {
    if (!accountName.trim()) {
      Taro.showToast({
        title: "请输入账户名称",
        icon: "none",
      });
      return;
    }

    if (balance === "") {
      Taro.showToast({
        title: "请输入账户余额",
        icon: "none",
      });
      return;
    }

    save({
      name: accountName,
      description: description,
      templateId: templateInfo?.id,
      balance,
    });
  };

  return (
    <Layout
      showTabBar={false}
      navBar={
        <NavBar
          title="添加账户"
          back
          color="#000"
          background="white"
          right={
            <Text
              style={{ color: "#1890ff", fontSize: "14px" }}
              onClick={handleSubmit}
            >
              保存
            </Text>
          }
        />
      }
      bodyClassName={styles.container}
    >
      <>
        {/* 账户类型信息和输入表单 */}
        <View className={styles.content}>
          <View className={styles.accountTypeCard}>
            <View className={styles.accountTypeItem}>
              <View className={styles.accountIcon}>
                <IconFont type={templateInfo?.icon} size={38} />
              </View>
              <Text className={styles.accountTypeName}>
                {templateInfo?.name || "现金钱包"}
              </Text>
              {/* <IconFont type="icon-you" size={16} color="#999" /> */}
            </View>
          </View>

          <View className={styles.inputCard}>
            <View className={styles.inputItem}>
              <Text className={styles.inputLabel}>账户名称</Text>
              <Input
                className={styles.inputField}
                value={accountName}
                onInput={handleNameChange}
                placeholder="请输入账户名称"
                placeholderClass={styles.placeholder}
              />
            </View>

            <View className={styles.inputItem}>
              <Text className={styles.inputLabel}>余额</Text>
              <Input
                className={styles.inputField}
                value={balance}
                onInput={handleBalanceChange}
                type="digit"
                placeholder="请输入账户余额"
                placeholderClass={styles.placeholder}
              />
            </View>

            <View className={styles.inputItem}>
              <Text className={styles.inputLabel}>备注</Text>
              <Input
                className={styles.inputField}
                value={description}
                onInput={handleNoteChange}
                placeholder="点击填写备注（可不填）"
                placeholderClass={styles.placeholder}
              />
            </View>
          </View>
        </View>

        {/* 底部确认按钮 */}
        <View className={styles.bottomButton}>
          <Button
            loading={loading}
            block
            type="primary"
            size="large"
            onClick={handleSubmit}
          >
            保存
          </Button>
        </View>

        <SafeArea position="bottom" />
      </>
    </Layout>
  );
};

export default AddAccount;
