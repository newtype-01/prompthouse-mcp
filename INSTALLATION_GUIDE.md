# PromptHouse MCP 安装指南

## 🚀 快速开始

### 方法1: GitHub直接安装（推荐，立即可用）
```bash
# 设置访问链接环境变量
export PROMPTHOUSE_ACCESS_LINK=your-access-link-here

# 运行MCP服务器
npx github:newtype-01/prompthouse-mcp
```

### 方法2: NPM安装（待发布）
```bash
# 等待发布到npm registry后可用
npx prompthouse-mcp
```

## 📋 获取Access Link

1. 访问 https://prompthouse.app
2. 使用Google账户登录
3. 点击右上角 "Set Up MCP" 按钮
4. 复制显示的access link

## ⚙️ Claude Desktop配置

将以下配置添加到Claude Desktop的MCP设置文件中：

### 配置文件位置
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

### 配置内容
```json
{
  "mcpServers": {
    "prompthouse": {
      "command": "npx",
      "args": ["github:newtype-01/prompthouse-mcp"],
      "env": {
        "PROMPTHOUSE_ACCESS_LINK": "your-actual-access-link-here"
      }
    }
  }
}
```

## 🔧 测试安装

### 1. 测试MCP服务器
```bash
PROMPTHOUSE_ACCESS_LINK=your-link-here PROMPTHOUSE_DEBUG=true npx github:newtype-01/prompthouse-mcp
```

### 2. 验证输出
应该看到：
```
[PromptHouse MCP] Starting PromptHouse MCP Server
[PromptHouse MCP] Mode: web
[PromptHouse MCP] Access link: provided
[PromptHouse MCP] MCP server ready, waiting for messages...
```

## 🐛 常见问题

### Q: "404 Not Found" 错误
A: 包还未发布到npm，请使用GitHub方式：
```bash
npx github:newtype-01/prompthouse-mcp
```

### Q: "PROMPTHOUSE_ACCESS_LINK environment variable is required"
A: 需要设置访问链接：
```bash
export PROMPTHOUSE_ACCESS_LINK=your-access-link-here
```

### Q: Claude Desktop无法连接
A: 检查配置文件格式和access link是否正确

## 📞 支持

- GitHub: https://github.com/newtype-01/prompthouse-mcp
- 网站: https://prompthouse.app
- 问题报告: GitHub Issues