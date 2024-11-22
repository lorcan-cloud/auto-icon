import fs from 'fs';
import path from 'path';
import { IconItem } from '../types';

export function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function writeIconList(outputDir: string, icons: IconItem[]) {
  const content = `export default ${JSON.stringify(icons, null, 2)}`;
  fs.writeFileSync(path.join(outputDir, 'iconfont.ts'), content);
}

export function writeCssFile(outputDir: string, content: string, onlyBase64: boolean = false) {
  if (onlyBase64) {
    // 提取 base64 内容
    const base64Match = content.match(/url\('data:application\/x-font-woff2;charset=utf-8;base64,[^']+'\)/);
    if (base64Match) {
      const fontFaceMatch = content.match(/@font-face\s*{[^}]*}/);
      const iconStyles = content.match(/\.icon-[^}]+}/g);
      
      let newContent = '';
      
      // 重建 @font-face
      if (fontFaceMatch) {
        newContent += '@font-face {\n';
        newContent += '  font-family: "iconfont";\n';
        newContent += '  src: ' + base64Match[0] + ';\n';
        newContent += '}\n\n';
      }

      // 添加所有图标样式
      if (iconStyles) {
        newContent += `.iconfont {
  font-family: "iconfont" !important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}\n\n`;
        newContent += iconStyles.join('\n\n');
      }

      content = newContent;
    }
  } else {
    // 如果不是只使用 base64，也需要移除 font-size
    content = content.replace(
      /\.iconfont\s*{[^}]*}/,
      match => match.replace(/\s*font-size:\s*16px;/, '')
    );
  }

  fs.writeFileSync(path.join(outputDir, 'iconfont.css'), content);
} 