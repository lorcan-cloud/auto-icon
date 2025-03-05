import axios from 'axios';
import { ProjectListResponse, ProjectDetailResponse } from './types';

const BASE_URL = 'https://www.iconfont.cn/api';

export async function getProjectList(cookie: string): Promise<ProjectListResponse> {
  const response = await axios.get(`${BASE_URL}/user/myprojects.json`, {
    params: {
      page: 1,
      isown_create: 1
    },
    headers: {
      Cookie: cookie
    }
  });
  return response.data;
}

export async function getProjectDetail(cookie: string, pid: number): Promise<ProjectDetailResponse> {
  const response = await axios.get(`${BASE_URL}/project/detail.json`, {
    params: { pid },
    headers: {
      Cookie: cookie
    }
  });
  return response.data;
}

export async function getCssFile(url: string): Promise<string> {
  // 如果URL以'//'开头，添加'https:'前缀
  const fullUrl = url.startsWith('//') ? `https:${url}` : url;
  const response = await axios.get(fullUrl);
  return response.data;
}