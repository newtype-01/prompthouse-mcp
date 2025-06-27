# Installation Guide

This guide covers all the ways to install and configure PromptHouse MCP server.

## Prerequisites

- Node.js 16 or higher
- A PromptHouse account at [prompthouse.app](https://prompthouse.app)
- Your personal access link (see [Getting Your Access Link](#getting-your-access-link))

## Installation Methods

### Method 1: NPX (Recommended)

The easiest way - no installation required:

```bash
npx prompthouse-mcp
```

This will automatically download and run the latest version.

### Method 2: Global Installation

Install once, run anywhere:

```bash
npm install -g prompthouse-mcp
prompthouse-mcp
```

### Method 3: From GitHub

Run directly from the GitHub repository:

```bash
npx github:newtype-01/prompthouse-mcp
```

### Method 4: DXT Extension

For one-click installation in Claude Desktop:

1. Download `prompthouse-mcp.dxt` from [releases](https://github.com/newtype-01/prompthouse-mcp/releases)
2. Open Claude Desktop → Settings → Extensions
3. Click "Install Extension" and select the downloaded file
4. Configure your access link in the extension settings
5. Restart Claude Desktop

## Getting Your Access Link

1. Go to [PromptHouse](https://prompthouse.app)
2. Sign in with Google
3. Click "Set Up MCP" in the top right corner
4. Copy your unique access link from the configuration

⚠️ **Important**: Keep your access link private. Don't share it with others.

## Claude Desktop Configuration

### Finding the Configuration File

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Linux:**
```
~/.config/Claude/claude_desktop_config.json
```

### Configuration Examples

#### NPX Method (Recommended)
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

#### Global Installation
```json
{
  "mcpServers": {
    "prompt-house": {
      "command": "prompthouse-mcp",
      "env": {
        "PROMPTHOUSE_ACCESS_LINK": "your-access-link-here"
      }
    }
  }
}
```

#### GitHub Direct
```json
{
  "mcpServers": {
    "prompt-house": {
      "command": "npx",
      "args": ["github:newtype-01/prompthouse-mcp"],
      "env": {
        "PROMPTHOUSE_ACCESS_LINK": "your-access-link-here"
      }
    }
  }
}
```

#### HTTP Bridge (Legacy)
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

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PROMPTHOUSE_ACCESS_LINK` | Your personal access link | - | ✅ |
| `PROMPTHOUSE_MODE` | `web` or `local` | `web` | ❌ |
| `PROMPTHOUSE_DEBUG` | Enable debug logging | `false` | ❌ |
| `PROMPTHOUSE_TIMEOUT` | Request timeout (ms) | `10000` | ❌ |

### Advanced Configuration

#### Local Server Mode
If you're running a local PromptHouse server:

```json
{
  "mcpServers": {
    "prompt-house": {
      "command": "npx",
      "args": ["prompthouse-mcp"],
      "env": {
        "PROMPTHOUSE_ACCESS_LINK": "your-access-link-here",
        "PROMPTHOUSE_MODE": "local"
      }
    }
  }
}
```

#### Debug Mode
For troubleshooting:

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

#### Custom Timeout
For slower connections:

```json
{
  "mcpServers": {
    "prompt-house": {
      "command": "npx",
      "args": ["prompthouse-mcp"],
      "env": {
        "PROMPTHOUSE_ACCESS_LINK": "your-access-link-here",
        "PROMPTHOUSE_TIMEOUT": "30000"
      }
    }
  }
}
```

## Verification

After configuration:

1. Save the configuration file
2. Restart Claude Desktop completely
3. In a new conversation, try asking: "List my prompts" or "Show me my available prompts"
4. You should see your PromptHouse prompts

## Other MCP Clients

### Cursor

Create or edit your Cursor MCP configuration:

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

### Custom MCP Client

The server follows the standard MCP protocol and should work with any compatible client:

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}' | PROMPTHOUSE_ACCESS_LINK=your-link npx prompthouse-mcp
```

## Next Steps

- [Troubleshooting Guide](troubleshooting.md)
- [Available Tools](../README.md#available-tools)
- [GitHub Repository](https://github.com/newtype-01/prompthouse-mcp)