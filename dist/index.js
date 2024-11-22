#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./utils/config");
const request_1 = require("./utils/request");
const file_1 = require("./utils/file");
const path_1 = __importDefault(require("path"));
async function main() {
    var _a;
    try {
        console.log('开始执行...');
        // 获取配置
        console.log('正在读取配置文件...');
        const config = (0, config_1.getConfig)();
        console.log('配置文件读取成功:', {
            name: config.name,
            output: config.output,
            cookieLength: config.cookie.length
        });
        // 获取项目列表
        console.log('正在获取项目列表...');
        const projects = await (0, request_1.getProjects)(config.cookie);
        console.log(`获取到 ${projects.length} 个项目`);
        const project = projects.find(p => p.name === config.name);
        if (!project) {
            console.log('可用的项目列表:', projects.map(p => p.name).join(', '));
            throw new Error(`找不到名为 ${config.name} 的项目`);
        }
        console.log('找到目标项目:', { id: project.id, name: project.name });
        // 获取项目详情
        console.log('正在获取项目详情...');
        const detail = await (0, request_1.getProjectDetail)(project.id, config.cookie);
        console.log('项目详情获取成功:', {
            cssFile: detail.font.css_file,
            jsonFile: detail.font.json_file
        });
        // 创建输出目录
        const outputDir = path_1.default.join(process.cwd(), config.output || 'src/assets/fonts/');
        console.log('正在创建输出目录:', outputDir);
        (0, file_1.ensureDir)(outputDir);
        console.log('输出目录创建成功');
        // 获取并写入CSS文件
        console.log('正在获取CSS文件内容...');
        const cssContent = await (0, request_1.getCssContent)(detail.font.css_file);
        console.log('CSS文件内容获取成功，正在写入文件...');
        (0, file_1.writeCssFile)(outputDir, cssContent, config.onlyBase64);
        console.log('CSS文件写入成功');
        // 获取并处理图标JSON
        console.log('正在获取图标JSON...');
        const iconJson = await (0, request_1.getIconJson)(detail.font.json_file);
        const icons = iconJson.glyphs.map(({ font_class, name }) => ({
            class: font_class,
            name
        }));
        console.log(`处理得到 ${icons.length} 个图标`);
        console.log('正在写入图标列表...');
        (0, file_1.writeIconList)(outputDir, icons);
        console.log('图标列表写入成功');
        console.log('\n✨ 所有文件生成成功！');
        console.log(`输出目录: ${outputDir}`);
        console.log(`生成文件: iconfont.css, iconfont.ts`);
        console.log(`图标数量: ${icons.length}`);
    }
    catch (error) {
        console.error('\n❌ 执行出错');
        if (error.response) {
            // Axios 错误
            console.error('请求错误:', {
                url: (_a = error.config) === null || _a === void 0 ? void 0 : _a.url,
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data
            });
        }
        else {
            console.error('错误信息:', error.message);
            if (error.stack) {
                console.error('错误堆栈:', error.stack);
            }
        }
        process.exit(1);
    }
}
main();
