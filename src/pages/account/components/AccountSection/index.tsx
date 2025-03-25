import React, { useState } from "react";
import { View, Text } from "@tarojs/components";
import IconFont from "@/components/Iconfont";
import styles from "./index.module.less";

export interface Account {
  id: string | number;
  name: string;
  icon: string;
  balance: string;
  description?: string;
  template?: {
    name: string;
  };
}

export interface AccountGroup {
  type: string;
  title: string;
  totalBalance: string;
  accounts?: Account[];
}

interface AccountSectionProps {
  data: AccountGroup;
  isAmountVisible: boolean;
  formatAmount: (amount: string, t?: boolean) => React.ReactNode;
  onAccountClick?: (account: Account) => void; // 添加点击回调属性
}

const AccountSection: React.FC<AccountSectionProps> = ({
  data,
  isAmountVisible,
  formatAmount,
  onAccountClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <React.Fragment>
      <View className={styles.sectionTitle} onClick={toggleExpand}>
        <Text className={styles.titleText}>{data.title}</Text>
        <View className={styles.titleRight}>
          {isAmountVisible ? (
            <Text className={styles.titleAount}>
              {" "}
              余额：{formatAmount(data.totalBalance)}
            </Text>
          ) : (
            <></>
          )}

          <IconFont
            type={isExpanded ? "icon-xia" : "icon-you"}
            size={18}
            style={{ marginTop: 2 }}
            color="#999"
          />
        </View>
      </View>
      {isExpanded && (
        <View className={styles.section}>
          <View className={styles.accountList}>
            {data.accounts?.map((account) => (
              <View 
                key={account.id} 
                className={styles.accountItem}
                onClick={() => onAccountClick?.(account)} // 添加点击事件
              >
                <View
                  className={styles.accountIcon}
                  style={{ backgroundColor: "#FFF5E6" }}
                >
                  <IconFont type={account.icon} size={24} />
                </View>
                <View className={styles.accountInfo}>
                  <View className={styles.accountName}>{account.name}</View>
                  <View className={styles.accountNote}>
                    {account.description}
                  </View>
                  <View className={styles.accountType}>
                    {account?.template?.name}
                  </View>
                </View>
                <Text className={styles.accountAmount}>
                  {formatAmount(account.balance, false)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </React.Fragment>
  );
};

export default AccountSection;
