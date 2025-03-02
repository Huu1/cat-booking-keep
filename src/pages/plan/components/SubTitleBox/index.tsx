import { Text, View } from "@tarojs/components";
import  './index.scss';

export const Index = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => (
  <View className={`subTitleBox ${className}`}>
    <Text>{title}</Text>
  </View>
);

export default Index;
