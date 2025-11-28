import fs from 'fs';
import path from 'path';
import { IconItem } from './types';

export function processCssFile(cssContent: string, fontFamily: string): string {
  // 提取 base64 内容
  const base64Match = cssContent.match(/url\('data:application\/x-font-woff2;charset=utf-8;base64,[^']+'\)/);
  if (base64Match) {
    const fontFaceMatch = cssContent.match(/@font-face\s*{[^}]*}/);
    // 修改正则表达式，匹配任意前缀的图标类名
    const iconStyles = cssContent.match(/\.[a-zA-Z0-9_-]+:[^}]+}/g);
    let newContent = '';
    // 重建 @font-face
    if (fontFaceMatch) {
      newContent += '@font-face {\n';
      newContent += '  font-family: "' + fontFamily + '";\n';
      newContent += '  src: ' + base64Match[0] + ';\n';
      newContent += '}\n\n';
    }
    // 添加所有图标样式
    if (iconStyles) {
      newContent += `.${fontFamily} {
font-family: "${fontFamily}" !important;
font-style: normal;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
}\n\n`;
      newContent += iconStyles.join('\n\n');
    }
    cssContent = newContent;
  }

  return cssContent;
}

export function generateIconsArray(prefix: string, icons: Array<{ font_class: string, name: string }>): IconItem[] {
  return icons.map(icon => ({
    class: `${prefix}${icon.font_class}`,
    name: icon.name
  }));
}

export function generateModelTypes(icons: IconItem[]): string {
  const types = icons.map(icon => `  '${icon.class}'`).join(' |\n');
  const interfaceProps = icons.map(icon => `  '${icon.class}': true`).join(';\n');
  return `export type IconType =\n${types}\n\nexport interface IconTypeMap {\n${interfaceProps}\n}\n`;
}

export function writeFile(outputDir: string, filename: string, content: string): void {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, filename), content);
}

export function writeIconFiles(outputDir: string, cssContent: string, icons: IconItem[], fontFamily: string): void {
  // 写入iconfont.css
  writeFile(outputDir, 'iconfont.css', processCssFile(cssContent, fontFamily));

  // 写入iconfont.ts
  const iconsArrayContent = `export default ${JSON.stringify(icons, null, 2)}\n`;
  writeFile(outputDir, 'iconfont.ts', iconsArrayContent);

  // 写入model.ts
  writeFile(outputDir, 'model.ts', generateModelTypes(icons));
}