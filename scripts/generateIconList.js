const fs = require('fs');
const path = require('path');

// 图标文件路径
const iconFontDir = path.resolve(__dirname, '../src/components/Iconfont');
const outputPath = path.resolve(__dirname, '../src/components/Iconfont/iconList.ts');

// 从CSS内容中提取图标名称
function extractIconNames(cssContent) {
  const iconRegex = /\.icon-([^:]+):before/g;
  const icons = [];
  let match;

  while ((match = iconRegex.exec(cssContent)) !== null) {
    icons.push(`icon-${match[1]}`);
  }

  return icons;
}

// 读取所有iconfont相关的less文件并按文件名分组
function readIconFontFiles() {
  const files = fs.readdirSync(iconFontDir);
  const lessFiles = files.filter(file => file.includes('Icon') && file.endsWith('.less'));

  // 创建分组对象
  const iconGroups = {};

  lessFiles.forEach(file => {
    const filePath = path.join(iconFontDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const icons = extractIconNames(content);

    // 使用文件名作为分组名（去掉扩展名）
    const groupName = path.basename(file, '.less');
    iconGroups[groupName] = icons;
  });

  // 创建一个包含所有图标的组
  const allIcons = Object.values(iconGroups).flat();
  iconGroups.all = [...new Set(allIcons)]; // 去重

  return iconGroups;
}

// 生成TypeScript文件
function generateIconListFile(iconGroups) {
  const content = `// 此文件由脚本自动生成，请勿手动修改
// 生成时间: ${new Date().toISOString()}

export const iconGroups = ${JSON.stringify(iconGroups, null, 2)};

// 默认导出所有图标
export const iconList = iconGroups.all;

export default iconList;
`;

  fs.writeFileSync(outputPath, content);

  // 输出统计信息
  const groupStats = Object.entries(iconGroups).map(([name, icons]) =>
    `${name}: ${icons.length}个图标`
  ).join(', ');

  console.log(`成功生成图标列表，分组情况: ${groupStats}，文件路径: ${outputPath}`);
}

// 执行
try {
  const iconGroups = readIconFontFiles();
  generateIconListFile(iconGroups);
} catch (error) {
  console.error('生成图标列表失败:', error);
  process.exit(1);
}