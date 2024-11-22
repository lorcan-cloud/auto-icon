"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = getConfig;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function getConfig() {
    const configPath = path_1.default.join(process.cwd(), 'auto-icon.json');
    if (!fs_1.default.existsSync(configPath)) {
        throw new Error('找不到配置文件 auto-icon.json');
    }
    const configContent = fs_1.default.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configContent);
    if (!config.cookie) {
        throw new Error('请在配置文件中设置 cookie');
    }
    if (!config.name) {
        throw new Error('请在配置文件中设置 name');
    }
    return {
        cookie: config.cookie,
        output: config.output || 'src/assets/fonts/',
        name: config.name,
        onlyBase64: config.onlyBase64 || false
    };
}
