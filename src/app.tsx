import { useEffect } from 'react';

const App: React.FC = ({ children }) => {
  useEffect(() => {
    // 创建 script 标签加载 iconfont 脚本
    const script = document.createElement('script');
    script.src = '//at.alicdn.com/t/c/font_4849211_tx62mw45kir.js'; // 替换成你的 iconfont 项目链接
    document.body.appendChild(script);
  }, []);

  return children;
};

export default App;