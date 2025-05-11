# XMind MCP 服务

这是一个用于处理 XMind 文件的 Model Context Protocol (MCP) 服务。它支持解析新版和旧版 XMind 文件，并提供了结构化的输出。

## 功能特点

- 支持解析 XMind 8/2020/Zen 格式文件
- 自动识别并解析 document.json/content.json/content.xml
- 提供结构化的主题树输出
- 支持在 Cursor IDE 中集成使用

## 安装

1. 克隆或下载本项目
2. 安装依赖：
   ```bash
   npm install
   ```
3. 构建项目：
   ```bash
   npm run build
   ```

## 使用方法

### 本地运行

```bash
npm start
```

或者直接运行：

```bash
node dist/index.js
```

### 在 Cursor 中配置

1. 打开 Cursor IDE
2. 进入设置（Settings）
3. 找到 Model Context Protocol (MCP) 设置
4. 点击 "Add MCP Service"
5. 选择"本地 MCP 服务"
6. 填写启动命令：
   ```
   node /完整路径/xmind-mcp/dist/index.js
   ```
   或（如果全局安装）：
   ```
   npx xmind-mcp
   ```

## 可用工具

### read_xmind

用于读取和解析 XMind 文件。

参数：
- `filePath`: XMind 文件路径（字符串）

示例：
```json
{
  "name": "read_xmind",
  "params": {
    "filePath": "/path/to/your/file.xmind"
  }
}
```

## 开发

### 项目结构

```
xmind-mcp/
├── dist/                # 构建输出目录
├── src/                 # 源代码
│   └── index.ts        # 主服务代码
├── package.json        # 项目配置
├── tsconfig.json       # TypeScript 配置
└── README.md          # 说明文档
```

### 构建

```bash
npm run build
```

## 许可证

MIT 