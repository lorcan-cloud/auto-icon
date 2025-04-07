// 配置文件类型定义
export interface Config {
  cookie: string;
  name: string;
  output: string;
  children?: Array<{
    name: string;
    output: string;
    cookie?: string;
  }>;
}

// API响应类型定义
export interface ProjectListResponse {
  data: {
    ownProjects: Array<{
      id: number;
      name: string;
      description: string;
    }>;
  };
}

export interface ProjectDetailResponse {
  data: {
    project: {
      prefix: string;
    };
    font: {
      css_file: string;
    };
    icons: Array<{
      font_class: string;
      name: string;
    }>;
  };
}

// 图标类型定义
export interface IconItem {
  class: string;
  name: string;
}