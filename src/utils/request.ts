import fetch from 'node-fetch';
import { Config, ProjectItem, ProjectDetail, IconJson } from '../types';

const BASE_URL = 'https://www.iconfont.cn/api';

const defaultHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'Connection': 'keep-alive',
  'Referer': 'https://www.iconfont.cn/manage/index',
  'Origin': 'https://www.iconfont.cn',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
  'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"'
};

export async function getProjects(cookie: string): Promise<ProjectItem[]> {
  console.log('发起获取项目列表请求...');
  
  try {
    const url = new URL(`${BASE_URL}/user/myprojects.json`);
    url.searchParams.set('page', '1');
    url.searchParams.set('isown_create', '1');
    url.searchParams.set('t', Date.now().toString());

    const res = await fetch(url.toString(), {
      headers: {
        ...defaultHeaders,
        'Cookie': cookie
      }
    });

    if (!res.ok) {
      console.error('HTTP错误:', {
        status: res.status,
        statusText: res.statusText
      });
      throw new Error(`HTTP错误: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    
    if (data.code !== 200) {
      console.error('获取项目列表失败:', data);
      throw new Error(`获取项目列表失败: ${JSON.stringify(data)}`);
    }

    return data.data.ownProjects;
  } catch (error: any) {
    console.error('请求失败:', {
      message: error.message,
      type: error.type,
      code: error.code
    });
    throw error;
  }
}

export async function getProjectDetail(pid: number, cookie: string): Promise<ProjectDetail> {
  console.log('发起获取项目详情请求...');

  try {
    const url = new URL(`${BASE_URL}/project/detail.json`);
    url.searchParams.set('pid', pid.toString());
    url.searchParams.set('t', Date.now().toString());

    const res = await fetch(url.toString(), {
      headers: {
        ...defaultHeaders,
        'Cookie': cookie
      }
    });

    if (!res.ok) {
      console.error('HTTP错误:', {
        status: res.status,
        statusText: res.statusText
      });
      throw new Error(`HTTP错误: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    if (data.code !== 200) {
      console.error('获取项目详情失败:', data);
      throw new Error(`获取项目详情失败: ${JSON.stringify(data)}`);
    }

    return data.data;
  } catch (error: any) {
    console.error('请求失败:', {
      message: error.message,
      type: error.type,
      code: error.code
    });
    throw error;
  }
}

export async function getIconJson(jsonUrl: string): Promise<IconJson> {
  console.log('发起获取图标JSON请求:', jsonUrl);
  const fullUrl = jsonUrl.startsWith('//') ? `https:${jsonUrl}` : jsonUrl;
  console.log('完整URL:', fullUrl);
  
  try {
    const res = await fetch(fullUrl, {
      headers: {
        ...defaultHeaders,
        'Referer': 'https://www.iconfont.cn/'
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP错误: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (error: any) {
    console.error('获取图标JSON失败:', {
      url: fullUrl,
      error: error.message
    });
    throw error;
  }
}

export async function getCssContent(cssUrl: string): Promise<string> {
  console.log('发起获取CSS内容请求:', cssUrl);
  const fullUrl = cssUrl.startsWith('//') ? `https:${cssUrl}` : cssUrl;
  console.log('完整URL:', fullUrl);
  
  try {
    const res = await fetch(fullUrl, {
      headers: {
        ...defaultHeaders,
        'Accept': 'text/css,*/*;q=0.1',
        'Referer': 'https://www.iconfont.cn/'
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP错误: ${res.status} ${res.statusText}`);
    }

    return await res.text();
  } catch (error: any) {
    console.error('获取CSS内容失败:', {
      url: fullUrl,
      error: error.message
    });
    throw error;
  }
} 