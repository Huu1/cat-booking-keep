import { View, Image, Icon } from "@tarojs/components";
import Taro from "@tarojs/taro";
import * as React from "react";
import { useState, useEffect } from "react";
import IconFont from "@/components/Iconfont";
import styles from "./index.module.less";
import Popup from "@/components/Popup";
import { FileItem, SafeArea, Uploader } from "@nutui/nutui-react-taro";
import config from "@/config";

interface ChooseImageProps {
  onImageSelected?: (imageUrls: string[]) => void;
  maxCount?: number;
  images?: string[]; // 添加 images 属性用于回显
}

// 初始化时，将已有的图片转换为 FileItem 格式
const initImageList = (images: string[]): FileItem[] => {
  return images.map((url, index) => ({
    // name: `已上传图片${index + 1}`,
    url,
    status: "success",
    message: "已上传",
    type: "image",
    uid: `existing-${index}`,
  }));
};

const Index: React.FC<ChooseImageProps> = ({
  onImageSelected,
  maxCount = 3,
  images = [],
}) => {
  const [list, setList] = useState<FileItem[]>(() => {
    return initImageList(images);
  });
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    visible && setList(initImageList(images));
  }, [images, visible]);

  // 处理上传完成事件
  const onSuccess = ({ files }) => {
    const list = files.map((i: any) => {
      if (i.responseText && i.responseText?.data) {
        const data = JSON.parse(i.responseText.data);
        return data.data.url;
      } else {
        return i.url;
      }
    });

    setList(initImageList(list));
  };

  const onDelete = (file: FileItem) => {
    const newList = list.filter((item) => item.uid !== file.uid);
    setList(newList);
  };

  const onHandleConfirm = () => {
    try {
      onImageSelected &&
        onImageSelected(list.map((i: FileItem) => i.url) as string[]);
      setVisible(false);
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <View
      className={styles.pictureBox}
      onClick={() => {
        setVisible(true);
      }}
    >
      <IconFont
        type="icon-zhaopian"
        size={16}
        color={images.length > 0 ? "#0b88f6" : "#000"}
      />

      <Popup
        visible={visible}
        position="bottom"
        round
        onClose={() => {
          setVisible(false);
        }}
        style={{ height: "30vh", display: "flex", flexDirection: "column" }}
      >
        <View className={styles.uploaderContainer}>
          <Uploader
            url={`${config.api.baseUrl}/files/upload`}
            name="file"
            headers={{
              Authorization: `Bearer ` + Taro.getStorageSync("token") || "",
            }}
            maxCount={maxCount}
            value={list}
            deleteIcon={<IconFont type="icon-shanchu" size={16} color="rgba(0,0,0,0.4)" />}
            onChange={setList}
            onSuccess={onSuccess}
            onDelete={onDelete}
            fit='fill'
            autoUpload
            multiple

          />
          <View style={{color:"#8f8f8f",fontSize:14 ,display:'flex',alignItems:'center',gap:2}}>
            <IconFont type="icon-guanyu" color="#8f8f8f" size={14} />支持选择三张图片
          </View>
          <View className={styles.uploaderActions}>
            <View
              className={styles.cancelBtn}
              onClick={() => setVisible(false)}
            >
              取消
            </View>
            <View className={styles.confirmBtn} onClick={onHandleConfirm}>
              确定
            </View>
          </View>
          <SafeArea position="bottom" />
        </View>
      </Popup>
    </View>
  );
};

export default Index;
