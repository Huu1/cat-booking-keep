require('@testing-library/jest-dom');

// 模拟 Taro 环境
jest.mock('@tarojs/taro', () => ({
  // 添加你需要的 Taro API 模拟
  getCurrentInstance: () => ({
    router: {
      params: {}
    }
  })
}));

// 添加全局模拟
global.wx = {};