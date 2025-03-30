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
      <View
        className={`${styles.sectionTitle} ${
          !isExpanded ? styles.roundedFull : ""
        }`}
        onClick={toggleExpand}
      >
        <Text className={styles.titleText}>{data.title}</Text>
        <View className={styles.titleRight}>
          {isAmountVisible ? (
            <Text className={styles.titleAount}>
              余额：{formatAmount(data.totalBalance)}
            </Text>
          ) : (
            <></>
          )}

          <IconFont
            type={isExpanded ? "icon-down" : "icon-right"}
            size={12}
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
                onClick={() => onAccountClick?.(account)}
              >
                <View className={styles.accountLeft}>
                  <View className={styles.accountIcon}>
                    <IconFont type={account.icon} size={24} color="#666" />
                  </View>
                  <View className={styles.accountInfo}>
                    <View className={styles.accountName}>{account.name}</View>
                    {(account.description || account?.template?.name) && (
                      <View className={styles.accountMeta}>
                        {account?.template?.name && (
                          <Text className={styles.accountType}>
                            {account?.template?.name}
                          </Text>
                        )}
                        {account.description && (
                          <Text className={styles.accountNote}>
                            {account.description}
                          </Text>
                        )}
                      </View>
                    )}
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
