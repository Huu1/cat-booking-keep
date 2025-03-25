import { useState, useEffect } from "react";
import { View, Text, Image } from "@tarojs/components";
import { Popup, SafeArea } from "@nutui/nutui-react-taro";
import IconFont from "@/components/Iconfont";
import styles from "./index.module.less";
import { useRequest } from "taro-hooks";
import { getAccountList } from "@/pages/addAccount/service";

interface Account {
  id: number;
  name: string;
  icon: string;
  type: string;
  balance: string;
  description?: string;
  isDefault?: boolean;
}

interface AccountSelectorProps {
  selectedAccountId?: number;
  onSelect: (accountId: number|null) => void;
}

const AccountSelector: React.FC<AccountSelectorProps> = ({
  selectedAccountId,
  onSelect,
}) => {
  const [visible, setVisible] = useState(false);

  // 获取账户列表
  const { data: accountList = [] } = useRequest(getAccountList);

  // 根据ID查找当前选中的账户
  const selectedAccount =
    accountList.find((account) => account.id === selectedAccountId)

  const handleOpen = () => {
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
  };

  const handleSelect = (account: Account) => {
    onSelect(account.id as number);
    handleClose();
  };

  return (
    <>
      <View className={styles.accountSelector} onClick={handleOpen}>
        <View className={styles.accountIcon}>
          <IconFont
            type={selectedAccount?.icon || "icon-wallet"}
            size={20}
            color="#fff"
          />
        </View>
        <Text className={styles.accountName}>
          {selectedAccount?.name || "请选择账户"}
        </Text>
        <View
          className={styles.deleteAccountWrap}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(null)
          }}
        >
          <IconFont type="icon-shanchu" size={10} color="#999" />
        </View>
      </View>

      <Popup
        visible={visible}
        position="bottom"
        round
        onClose={handleClose}
        style={{ height: "50vh" }}
      >
        <View className={styles.popupHeader}>
          <View className={styles.closeBtn}></View>
          <Text className={styles.popupTitle}>选择账户</Text>
          <View className={styles.rightAction}>
            <IconFont
              type="icon-shanchu"
              size={20}
              color="#4285f4"
              onClick={handleClose}
              className={styles.closeIcon}
            />
          </View>
        </View>

        <View className={styles.accountListContainer}>
          <View className={styles.accountList}>
            {accountList.map((account) => (
              <View
                key={account.id}
                className={styles.accountItem}
                onClick={() => handleSelect(account)}
              >
                <View className={styles.accountInfo}>
                  <View
                    className={styles.accountLogo}
                    style={
                      {
                        // backgroundColor: "#f8b64c",
                      }
                    }
                  >
                    <IconFont type={account.icon} size={34} color="#fff" />
                  </View>
                  <View className={styles.accountDetail}>
                    <Text className={styles.accountItemName}>
                      {account.name}
                    </Text>
                    <Text className={styles.accountType}>
                      {account.template?.name}
                    </Text>
                  </View>
                </View>
                <Text className={styles.accountBalance}>
                  {parseFloat(account.balance) < 0 ? "-" : ""}¥
                  {Math.abs(parseFloat(account.balance)).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
          <SafeArea position="bottom" />
        </View>
      </Popup>
    </>
  );
};

export default AccountSelector;
