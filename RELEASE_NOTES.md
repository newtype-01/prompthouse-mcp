# PromptHouse MCP v1.0.0 Release Notes

## 🎉 Major Release: Native NPM Package Available

We're excited to announce the first major release of PromptHouse MCP server with native npm package distribution!

### 🚀 What's New

#### NPM Package Publication ✅
- **Package Name**: `prompthouse-mcp`
- **Registry**: https://www.npmjs.com/package/prompthouse-mcp
- **Installation**: `npx prompthouse-mcp` (no downloads required!)

#### Multiple Installation Methods

1. **NPM Package (Recommended)**:
   ```bash
   npx prompthouse-mcp
   ```

2. **Global Installation**:
   ```bash
   npm install -g prompthouse-mcp
   prompthouse-mcp
   ```

3. **GitHub Direct**:
   ```bash
   npx github:newtype-01/prompthouse-mcp
   ```

4. **DXT Extension**: Download `prompthouse-mcp.dxt` from this release

### 🔧 Claude Desktop Configuration

#### Simple NPM Method
```json
{
  "mcpServers": {
    "prompt-house": {
      "command": "npx",
      "args": ["prompthouse-mcp"],
      "env": {
        "PROMPTHOUSE_ACCESS_LINK": "your-access-link-here"
      }
    }
  }
}
```

#### DXT Extension Method
1. Download `prompthouse-mcp.dxt` from this release
2. Open Claude Desktop → Settings → Extensions
3. Click "Install Extension" and select the DXT file
4. Configure your access link in extension settings
5. Restart Claude Desktop

### 📋 Getting Your Access Link

1. Visit https://prompthouse.app
2. Sign in with Google
3. Click "Set Up MCP" in the top right
4. Copy your personal access link

### 🛠 Technical Features

- **Zero Dependencies**: Pure Node.js implementation
- **Cross-Platform**: Works on macOS, Windows, Linux
- **Debug Mode**: Set `PROMPTHOUSE_DEBUG=true` for troubleshooting
- **Dual Mode**: Supports both web and local PromptHouse servers
- **Secure Authentication**: Access-link based authentication
- **JSON-RPC 2.0**: Full MCP protocol compliance

### 🧰 Available Tools

- **`get_prompt_list`**: List all your saved prompts with metadata
- **`get_prompt`**: Retrieve complete prompt content by ID

### 📖 Documentation

- **Installation Guide**: [INSTALLATION_GUIDE.md](https://github.com/newtype-01/prompthouse-mcp/blob/main/INSTALLATION_GUIDE.md)
- **Troubleshooting**: [docs/troubleshooting.md](https://github.com/newtype-01/prompthouse-mcp/blob/main/docs/troubleshooting.md)
- **Development**: [docs/development.md](https://github.com/newtype-01/prompthouse-mcp/blob/main/docs/development.md)

### 🐛 Bug Fixes

- Fixed stdio communication issues with Claude Desktop
- Improved error handling and graceful failures
- Enhanced debug logging for better troubleshooting
- Resolved authentication edge cases

### 🔮 Future Plans

- Support for additional MCP clients
- Enhanced prompt metadata and search capabilities
- Performance optimizations
- Community prompt sharing features

### 📞 Support

- **GitHub Issues**: Report bugs and feature requests
- **PromptHouse**: https://prompthouse.app for general support
- **Documentation**: Complete guides in the repository

---

**Full Changelog**: https://github.com/newtype-01/prompthouse-mcp/blob/main/CHANGELOG.md

**Download DXT Extension**: `prompthouse-mcp.dxt` (attached to this release)

**NPM Package**: https://www.npmjs.com/package/prompthouse-mcp