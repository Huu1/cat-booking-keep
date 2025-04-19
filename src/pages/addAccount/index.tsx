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

export enum AccountType {
  CASH = "cash", // 资金账户（现金、银行卡等）
  CREDIT = "credit", // 信用账户（信用卡、花呗等）
  INVESTMENT = "investment", // 理财账户（基金、股票等）
  RECEIVABLE = "receivable", // 应收款项
  PAYABLE = "payable", // 应付款项
}

const AddAccount = () => {
  const [accountName, setAccountName] = useState("");
  const [description, setDescription] = useState("");
  const [balance, setBalance] = useState("");
  const [templateInfo, setTemplateInfo] = useState<any>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);

  const [accountType, setAccountType] = useState<AccountType>();

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

        setAccountType(data.accountType);
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

      setAccountType(data.type);
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

  const renderFormByAccountType = () => {
    switch (accountType) {
      case AccountType.CREDIT:
        return (
          <>
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
            <View className={styles.inputCard}>
              <View className={styles.inputItem}>
                <Text className={styles.inputLabel}>信用额度</Text>
                <Input
                  className={styles.inputField}
                  value={accountName}
                  onInput={handleNameChange}
                  placeholder="请输入信用额度"
                  placeholderClass={styles.placeholder}
                />
              </View>
              <View className={styles.inputItem}>
                <Text className={styles.inputLabel}>当前欠款</Text>
                <Input
                  className={styles.inputField}
                  value={description}
                  onInput={handleNoteChange}
                  placeholder="点击填写备注（可不填）"
                  placeholderClass={styles.placeholder}
                />
              </View>
              <View className={styles.inputItem}>
                <Text className={styles.inputLabel}>账单日</Text>
                <Input
                  className={styles.inputField}
                  value={description}
                  onInput={handleNoteChange}
                  placeholder="点击填写备注（可不填）"
                  placeholderClass={styles.placeholder}
                />
              </View>
              <View className={styles.inputItem}>
                <Text className={styles.inputLabel}>还款日</Text>
                <Input
                  className={styles.inputField}
                  value={description}
                  onInput={handleNoteChange}
                  placeholder="点击填写备注（可不填）"
                  placeholderClass={styles.placeholder}
                />
              </View>
            </View>
          </>
        );

      default:
        return (
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
        );
    }
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

          {renderFormByAccountType()}

          <Button
            loading={loading}
            block
            size="large"
            onClick={handleSubmit}
            style={{
              backgroundColor: "#FFE300",
              color: "#333",
              border: "none",
            }}
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
