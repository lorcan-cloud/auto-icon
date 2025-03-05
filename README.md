# @lorcan-store/auto-icon

一个自动从 iconfont.cn 下载图标文件的命令行工具。

## 功能特点

- 自动获取指定项目的图标文件
- 生成 CSS 文件和 TypeScript 类型文件
- 支持自定义输出目录
- 支持仅保留 base64 格式的字体文件
- 详细的执行日志

## 安装

```bash
npm install @lorcan-store/auto-icon -D
```

## 使用方法

1. 在项目根目录创建配置文件 `auto-icon.json`：

```json
{
  "cookie": "你的iconfont.cn cookie",
  "name": "你的项目名称",
  "output": "src/assets/fonts/",  // 可选，默认为 src/assets/fonts/
}
```

2. 在 `package.json` 中添加命令：

```json
{
  "scripts": {
    "icon": "auto-icon"
  }
}
```

3. 运行命令：

```bash
npm run icon
```

## 配置说明

### cookie

- 类型：`string`
- 必填：是
- 说明：iconfont.cn 的登录凭证

获取方法：
1. 登录 [iconfont.cn](https://www.iconfont.cn/)
2. 打开浏览器开发者工具（F12）
3. 切换到 Network 标签页
4. 刷新页面
5. 在请求列表中找到任意请求
6. 在请求头中找到 Cookie 字段，复制其值

### name

- 类型：`string`
- 必填：是
- 说明：iconfont.cn 上的项目名称

### output

- 类型：`string`
- 必填：否
- 默认值：`"src/assets/fonts/"`
- 说明：文件的输出目录


## 输出文件

运行成功后会在输出目录生成以下文件：

- `iconfont.css`：图标的样式文件，包含字体定义和图标样式，已移除默认的 font-size 设置
- `iconfont.ts`：图标的 TypeScript 类型定义文件，包含所有图标的类名和中文名称
- `model.ts`：图标类型定义文件，提供类型定义，方便在代码中使用


### iconfont.ts 内容示例

```typescript
export default [
  {
    "class": "icon-zengjia",
    "name": "增加"
  },
  {
    "class": "icon-gouxuan",
    "name": "勾选"
  }
]
```

### model.ts 内容示例

```typescript
// 此文件由 auto-icon 自动生成，请勿手动修改
export type IconType = 'icon-zengjia' | 'icon-gouxuan';
export default IconType;
```

## 使用示例

1. 安装依赖：

```bash
npm install @lorcan-store/auto-icon -D
```

2. 创建配置文件 `auto-icon.json`：

```json
{
  "cookie": "your-cookie-here",
  "name": "我的项目",
  "output": "src/assets/fonts/"
}
```

3. 添加命令到 `package.json`：

```json
{
  "scripts": {
    "icon": "auto-icon"
  }
}
```

4. 运行命令：

```bash
npm run icon
```

## 常见问题

### 找不到项目

确保配置文件中的 `name` 与 iconfont.cn 上的项目名称完全一致。运行命令时会输出所有可用的项目名称供参考。

### cookie 失效

如果遇到请求失败，可能是 cookie 已过期，请重新获取 cookie。

### 执行错误

如果执行过程中出现错误，程序会输出详细的错误信息和执行日志，帮助定位问题。

## 注意事项

- cookie 包含敏感信息，请不要将其提交到代码仓库
- 建议将 `auto-icon.json` 添加到 `.gitignore` 文件中
- 定期更新 cookie 以确保其有效性
- 确保项目名称与 iconfont.cn 上的完全一致，包括空格和特殊字符

## License

MIT
