import { Config } from '../types';
import path from 'path';
import fs from 'fs';

export function getConfig(): Config {
  const configPath = path.join(process.cwd(), 'auto-icon.json');
  
  if (!fs.existsSync(configPath)) {
    throw new Error('找不到配置文件 auto-icon.json');
  }

  const configContent = fs.readFileSync(configPath, 'utf-8');
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