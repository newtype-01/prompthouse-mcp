# Prompt House: Supercharge Your AI Workflow

**Your Personal Prompt Library, Intelligently Connected to Your Favorite AI Tools.**

Tired of juggling a messy collection of prompts across notes, files, and spreadsheets? Prompt House is a powerful prompt manager that not only helps you save, tag, and organize your prompts but makes them instantly accessible to your AI clients.

It leverages the MCP (Model Context Protocol), which allows your AI applications to programmatically find and use the perfect prompt from your library. This creates an effortless and seamless workflow, eliminating the need for constant copy-pasting.

Created by huangyihe
- Prompt House: https://prompthouse.app/
- YouTube: https://www.youtube.com/@huanyihe777
- Twitter: https://x.com/huangyihe
- Community: https://t.zsxq.com/19IaNz5wK

## ✨ Key Features

- **Prompt Management**: Effortlessly save, tag, and manage your entire prompt library. Our clean interface allows you to find, view, and edit prompts in seconds. Use tags to instantly filter and locate the exact prompt you need.

- **Prompt Calling**: Transform your workflow from manual to automatic. By setting up the MCP connection, you empower clients like Cursor, ChatWise, and Cherry Studio to intelligently fetch and execute prompts directly from your collection.

- **Prompt Recommendations**: Explore a built-in collection of high-quality prompts for a variety of tasks, including Productivity and Image Generation. It's a great way to discover new techniques and expand your creative toolkit.

- **Privacy-First macOS Client**: Enjoy the speed and security of a native macOS application. All your data is stored locally on your machine. No accounts, no sign-ups, no cloud sync. The client also features native support for major Model Providers and local inference with Ollama.

## 🔗 How to Connect

**For the Web Version:**
- NPM Package
- HTTP Bridge  
- DXT Extension

![Web Version Setup](11.png)

**For the macOS App:**
- Manual Configuration: Set up a connection via HTTP or Stdio
- Auto-Configuration: Enjoy one-click setup for Claude Desktop

![macOS App Setup](22.png)

---

## PromptHouse MCP Server

Connect your [PromptHouse](https://prompthouse.app) prompts directly to Claude Desktop and other AI clients using the Model Context Protocol (MCP).

## 🚀 Quick Start

### Option 1: NPX (Recommended)

The easiest way to get started:

```bash
npx prompthouse-mcp
```

### Option 2: Install Globally

```bash
npm install -g prompthouse-mcp
prompthouse-mcp
```

### Option 3: Run from GitHub

```bash
npx github:newtype-01/prompthouse-mcp
```

## ⚙️ Configuration

### Claude Desktop Setup

Add this to your Claude Desktop configuration file:

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

### Getting Your Access Link

1. Go to [PromptHouse](https://prompthouse.app)
2. Sign in with Google
3. Click "Set Up MCP" in the top right
4. Copy your access link from the configuration

### Configuration File Locations

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

## 🔧 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PROMPTHOUSE_ACCESS_LINK` | Your personal access link from PromptHouse | - | ✅ |
| `PROMPTHOUSE_MODE` | Connection mode: `web` or `local` | `web` | ❌ |
| `PROMPTHOUSE_DEBUG` | Enable debug logging | `false` | ❌ |

## 📖 Available Tools

Once connected, you'll have access to these MCP tools:

### `get_prompt_list`
List all your available prompts with titles and tags.

```javascript
// Example usage in Claude Desktop:
// "Show me all my prompts"
```

### `get_prompt`
Retrieve the complete content of a specific prompt by its ID.

```javascript
// Example usage in Claude Desktop:
// "Get the content of prompt ID abc123"
```

## 🌐 Connection Modes

### Web Mode (Default)
Connects to the online PromptHouse service at `https://prompthouse.app`.

```bash
PROMPTHOUSE_MODE=web npx prompthouse-mcp
```

### Local Mode
Connects to a local PromptHouse server running on `localhost:3001`.

```bash
PROMPTHOUSE_MODE=local npx prompthouse-mcp
```

## 🛠️ Advanced Configuration

### Custom Endpoint
You can specify a custom endpoint using:

```bash
PROMPTHOUSE_CUSTOM_URL=https://your-custom-domain.com/api/mcp-link npx prompthouse-mcp
```

### Debug Mode
Enable detailed logging for troubleshooting:

```bash
PROMPTHOUSE_DEBUG=true npx prompthouse-mcp
```

### Timeout Settings
Adjust request timeout (in milliseconds):

```bash
PROMPTHOUSE_TIMEOUT=15000 npx prompthouse-mcp
```

## 🔍 Troubleshooting

### Common Issues

**"Access link required" error:**
- Make sure you've set the `PROMPTHOUSE_ACCESS_LINK` environment variable
- Verify your access link is correct and hasn't been regenerated

**Connection timeout:**
- Check your internet connection
- Try increasing the timeout: `PROMPTHOUSE_TIMEOUT=30000`
- For local mode, ensure your local server is running

**Claude Desktop not recognizing the server:**
- Restart Claude Desktop after configuration changes
- Check that Node.js is installed and accessible
- Verify the configuration file syntax is valid JSON

### Debug Mode

Enable debug mode to see detailed logs:

```json
{
  "mcpServers": {
    "prompt-house": {
      "command": "npx",
      "args": ["prompthouse-mcp"],
      "env": {
        "PROMPTHOUSE_ACCESS_LINK": "your-access-link-here",
        "PROMPTHOUSE_DEBUG": "true"
      }
    }
  }
}
```

### Testing the Connection

You can test the server manually:

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}' | PROMPTHOUSE_ACCESS_LINK=your-link npx prompthouse-mcp
```

## 🔗 Alternative Connection Methods

### HTTP Bridge (Legacy)
If you prefer the HTTP bridge method:

```json
{
  "mcpServers": {
    "prompt-house": {
      "url": "https://prompthouse.app/api/mcp-link?accessLink=your-access-link-here",
      "transport": "http"
    }
  }
}
```

### DXT Extension
For one-click installation, download the DXT extension from the [releases page](https://github.com/newtype-01/prompthouse-mcp/releases).

## 🛡️ Security

- Your access link is unique and private - don't share it
- The access link can be regenerated at any time from PromptHouse settings
- All communication uses HTTPS encryption
- No sensitive data is logged (unless debug mode is enabled)

## 📦 Supported Clients

- ✅ Claude Desktop
- ✅ Cursor (with MCP support)
- ✅ Other MCP-compatible AI clients

## 🤝 Contributing

This project is open source. Feel free to:

- Report issues on [GitHub](https://github.com/newtype-01/prompthouse-mcp/issues)
- Submit pull requests
- Suggest new features

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Links

- [PromptHouse Website](https://prompthouse.app)
- [GitHub Repository](https://github.com/newtype-01/prompthouse-mcp)
- [MCP Documentation](https://modelcontextprotocol.io/)
- [Claude Desktop](https://claude.ai/download)