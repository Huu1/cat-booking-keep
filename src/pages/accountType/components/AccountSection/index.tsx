import React, { useState } from "react";
import { View, Text } from "@tarojs/components";
import IconFont from "@/components/Iconfont";
import styles from "./index.module.less";
import { Template } from "../../types";

interface AccountSectionProps {
  data: {
    title: string;
    type: string;
    templates: Template[];
  };
  onTemplateClick?: (template: Template) => void;
}

const AccountSection: React.FC<AccountSectionProps> = ({ data, onTemplateClick }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <React.Fragment>
      <View className={styles.sectionTitle} onClick={toggleExpand}>
        <Text className={styles.titleText}>{data.title}</Text>
        <View className={styles.titleRight}>
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
            {data.templates?.map((template) => (
              <View 
                key={template.id} 
                className={styles.accountItem}
                onClick={() => onTemplateClick?.(template)}
              >
                <View
                  className={styles.accountIcon}
                  style={{ backgroundColor: "#FFF5E6" }}
                >
                  <IconFont type={template.icon} color="red" size={36} />
                </View>
                <View className={styles.accountInfo}>
                  <View className={styles.accountName}>{template.name}</View>
                </View>
                <IconFont
                  type="icon-you"
                  size={18}
                  style={{ marginTop: 2 }}
                  color="#999"
                />
              </View>
            ))}
          </View>
        </View>
      )}
    </React.Fragment>
  );
};

export default AccountSection;
