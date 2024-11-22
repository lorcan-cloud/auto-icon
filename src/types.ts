export interface Config {
  cookie: string;
  output?: string;
  name: string;
  onlyBase64?: boolean;
}

export interface ProjectItem {
  id: number;
  name: string;
}

export interface IconItem {
  class: string;
  name: string;
}

export interface ProjectDetail {
  font: {
    css_file: string;
    json_file: string;
  }
}

export interface IconJson {
  glyphs: Array<{
    font_class: string;
    name: string;
  }>
} 