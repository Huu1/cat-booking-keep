import { useState, useEffect } from "react";
import { View, Text, Input } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Button, SafeArea } from "@nutui/nutui-react-taro";
import Layout from "@/components/Layout";
import NavBar from "@/components/Navbar";
import IconFont from "@/components/Iconfont";
import styles from "./index.module.less";
import { useRequest } from "taro-hooks";
import { addAccount, getAccount, updateAccount } from "./service";

const AddAccount = () => {
  const [accountName, setAccountName] = useState("");
  const [description, setDescription] = useState("");
  const [balance, setBalance] = useState("");
  const [templateInfo, setTemplateInfo] = useState<any>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);

  // 获取路由参数
  useEffect(() => {
    const instance = Taro.getCurrentInstance();
    const params = instance?.router?.params || {};
    // @ts-ignore
    const eventChannel = instance?.page?.getOpenerEventChannel();

    // 判断是否为编辑模式
    if (params.id) {
      setIsEdit(true);
      setAccountId(params.id);
      // 获取账户详情
      fetchAccountDetail(params.id);
    } else {
      // 从路由参数或事件通道获取数据
      eventChannel?.on("acceptDataFromOpenerPage", (data) => {
        setTemplateInfo({
          id: params.templateId || data.templateId,
          icon: params.icon || data.icon,
          name: params.name || data.name,
        });
      });
    }
  }, []);

  // 获取账户详情
  const { run: fetchAccountDetail } = useRequest(getAccount, {
    manual: true,
    onSuccess: (data) => {
      // 填充表单数据
      setAccountName(data.name || "");
      setDescription(data.description || "");
      setBalance(data.balance || "");
      setTemplateInfo({
        id: data.templateId,
        icon: data.icon,
        name: data.templateName,
      });
    },
  });

  const { loading, run: save } = useRequest(
    (params) => (isEdit ? updateAccount(params) : addAccount(params)),
    {
      manual: true,
      onSuccess: () => {
        Taro.eventCenter.trigger("account_index_page");

        if (isEdit) {
          Taro.eventCenter.trigger("account_detail_page");
          Taro.navigateBack({
            delta: 1,
          });
        } else {
          Taro.navigateBack({
            delta: 2,
          });
        }
      },
      onError: () => {
        Taro.showToast({
          title: isEdit ? "更新失败" : "创建失败",
          icon: "error",
        });
      },
    }
  );

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

    const params: any = {
      name: accountName,
      description: description,
      templateId: templateInfo?.id,
      balance,
    };

    if (isEdit && accountId) {
      params.id = accountId;
    }

    save(params);
  };

  return (
    <Layout
      showTabBar={false}
      navBar={
        <NavBar
          title={isEdit ? "编辑账户" : "添加账户"}
          back
          color="#000"
          // background="white"
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
            {isEdit ? "更新" : "保存"}
          </Button>
        </View>

        <SafeArea position="bottom" />
      </>
    </Layout>
  );
};

export default AddAccount;
