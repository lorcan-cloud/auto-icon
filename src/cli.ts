#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { program } from 'commander';
import { Config } from './types';
import { getProjectList, getProjectDetail, getCssFile } from './api';
import { writeIconFiles } from './file';

const CONFIG_FILE = 'auto-icon.json';

function loadConfig(): Config {
  try {
    const configPath = path.join(process.cwd(), CONFIG_FILE);
    if (!fs.existsSync(configPath)) {
      console.error(chalk.red('错误: 未找到配置文件 auto-icon.json'));
      process.exit(1);
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    if (!config.cookie) {
      console.error(chalk.red('错误: 配置文件中缺少 cookie'));
      process.exit(1);
    }
    if (!config.name) {
      console.error(chalk.red('错误: 配置文件中缺少 name'));
      process.exit(1);
    }

    // 标准化输出路径，移除末尾斜杠
    config.output = (config.output || 'src/assets/fonts').replace(/\/$/, '');
    return config;
  } catch (error) {
    console.error(chalk.red('错误: 读取配置文件失败'), error);
    process.exit(1);
  }
}

async function run() {
  try {
    const config = loadConfig();
    console.log(chalk.blue('✨ 开始获取图标资源...'));

    // 处理主项目
    await processProject(config, config.cookie);

    // 处理子项目
    if (config.children && config.children.length > 0) {
      console.log(chalk.blue(`🔄 开始处理 ${config.children.length} 个子项目...`));
      for (const child of config.children) {
        await processProject({
          ...child,
          output: child.output || config.output
        }, child.cookie || config.cookie);
      }
    }

    console.log(chalk.green('✅ 所有图标资源获取完成！'));
  } catch (error) {
    console.error(chalk.red('❌ 执行失败:'), error);
    process.exit(1);
  }
}

async function processProject(projectConfig: { name: string; output: string }, cookie: string) {
  try {
    console.log(chalk.blue(`📋 正在处理项目 ${projectConfig.name}...`));
    const projectList = await getProjectList(cookie);
    const project = projectList.data.ownProjects.find(p => p.name === projectConfig.name);
    if (!project) {
      console.error(chalk.red(`错误: 未找到名为 ${projectConfig.name} 的项目`));
      process.exit(1);
    }
    console.log(chalk.green('✔ 项目列表获取成功'));

    // 获取项目详情
    console.log(chalk.blue('📦 正在获取项目详情...'));
    const projectDetail = await getProjectDetail(cookie, project.id);
    const { prefix, font_family } = projectDetail.data.project;
    const { css_file } = projectDetail.data.font;
    const { icons } = projectDetail.data;
    console.log(chalk.green('✔ 项目详情获取成功'));

    // 获取CSS文件
    console.log(chalk.blue('📥 正在下载CSS文件...'));
    const cssContent = await getCssFile(css_file, cookie);
    console.log(chalk.green('✔ CSS文件下载成功'));

    // 生成文件
    console.log(chalk.blue('📝 正在生成文件...'));
    const outputDir = path.resolve(process.cwd(), projectConfig.output);
    writeIconFiles(outputDir, cssContent, icons.map(icon => ({
      class: `${prefix}${icon.font_class}`,
      name: icon.name
    })), font_family);
    console.log(chalk.green('✔ 文件生成成功'));

    console.log(chalk.green('\n🎉 图标资源获取完成！'));
  } catch (error) {
    console.error(chalk.red('错误: 执行过程中出现错误'), error);
    process.exit(1);
  }
}

program
  .version(require('../package.json').version)
  .description('自动化从iconfont平台获取图标资源的工具')
  .action(run);

program.parse(process.argv);