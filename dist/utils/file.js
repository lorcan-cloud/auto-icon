"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDir = ensureDir;
exports.writeIconList = writeIconList;
exports.writeCssFile = writeCssFile;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function ensureDir(dir) {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
}
function writeIconList(outputDir, icons) {
    const content = `export default ${JSON.stringify(icons, null, 2)}`;
    fs_1.default.writeFileSync(path_1.default.join(outputDir, 'iconfont.ts'), content);
}
function writeCssFile(outputDir, content, onlyBase64 = false) {
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
    }
    else {
        // 如果不是只使用 base64，也需要移除 font-size
        content = content.replace(/\.iconfont\s*{[^}]*}/, match => match.replace(/\s*font-size:\s*16px;/, ''));
    }
    fs_1.default.writeFileSync(path_1.default.join(outputDir, 'iconfont.css'), content);
}
