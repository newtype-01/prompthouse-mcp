# Troubleshooting Guide

## Common Issues

### "Access link required" Error

**Problem**: Server starts but shows access link error.

**Solutions**:
1. Make sure you've set the `PROMPTHOUSE_ACCESS_LINK` environment variable
2. Check that your access link is correct and hasn't been regenerated
3. Verify the access link doesn't have extra spaces or characters

**Example**:
```json
{
  "mcpServers": {
    "prompt-house": {
      "command": "npx",
      "args": ["prompthouse-mcp"],
      "env": {
        "PROMPTHOUSE_ACCESS_LINK": "f64d48e3_d798dc04c869cd8efda2119ac02c4264"
      }
    }
  }
}
```

### Claude Desktop Not Recognizing Server

**Problem**: Claude Desktop doesn't show the MCP server or tools.

**Solutions**:
1. **Restart Claude Desktop completely** - this is the most common fix
2. Check that Node.js is installed and accessible:
   ```bash
   node --version
   npm --version
   ```
3. Verify your configuration file syntax is valid JSON
4. Check the configuration file location is correct
5. Try the test command to verify the server works:
   ```bash
   echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | PROMPTHOUSE_ACCESS_LINK=your-link npx prompthouse-mcp
   ```

### Connection Timeout

**Problem**: Server times out when connecting to PromptHouse.

**Solutions**:
1. Check your internet connection
2. Try increasing the timeout:
   ```json
   {
     "env": {
       "PROMPTHOUSE_ACCESS_LINK": "your-link",
       "PROMPTHOUSE_TIMEOUT": "30000"
     }
   }
   ```
3. For local mode, ensure your local server is running on port 3001
4. Check if a firewall is blocking the connection

### NPX Download Issues

**Problem**: `npx prompthouse-mcp` fails to download or run.

**Solutions**:
1. Update npm: `npm install -g npm@latest`
2. Clear npm cache: `npm cache clean --force`
3. Try the GitHub method: `npx github:newtype-01/prompthouse-mcp`
4. Install globally instead: `npm install -g prompthouse-mcp`

### Invalid JSON Response

**Problem**: Server returns "Invalid JSON response" error.

**Solutions**:
1. Enable debug mode to see the actual response:
   ```json
   {
     "env": {
       "PROMPTHOUSE_ACCESS_LINK": "your-link",
       "PROMPTHOUSE_DEBUG": "true"
     }
   }
   ```
2. Check if your access link is still valid
3. Try regenerating your access link from PromptHouse settings
4. Verify you're connecting to the right endpoint (web vs local)

### Permission Denied

**Problem**: Permission denied when running the server.

**Solutions**:
1. On macOS/Linux, try: `sudo npx prompthouse-mcp`
2. Or install globally with appropriate permissions
3. Check Node.js installation permissions

## Debug Mode

Enable detailed logging to diagnose issues:

```json
{
  "mcpServers": {
    "prompt-house": {
      "command": "npx",
      "args": ["prompthouse-mcp"],
      "env": {
        "PROMPTHOUSE_ACCESS_LINK": "your-link",
        "PROMPTHOUSE_DEBUG": "true"
      }
    }
  }
}
```

Debug output will show:
- Connection attempts
- Request/response details
- Error messages
- Server state changes

## Manual Testing

### Test Server Directly

```bash
# Test with environment variable
PROMPTHOUSE_ACCESS_LINK=your-link npx prompthouse-mcp

# Then send a test message:
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}' | PROMPTHOUSE_ACCESS_LINK=your-link npx prompthouse-mcp
```

### Test Connection to PromptHouse

```bash
# Test web API directly
curl -X POST "https://prompthouse.app/api/mcp-link?accessLink=your-link" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

## Configuration File Issues

### Finding the File

**macOS**:
```bash
ls -la ~/Library/Application\ Support/Claude/
```

**Windows**:
```cmd
dir "%APPDATA%\Claude\"
```

### Validating JSON

Use a JSON validator to check your configuration:

```bash
# On macOS/Linux with jq
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json | jq .

# Or use an online JSON validator
```

### Backup Configuration

Always backup your working configuration:

```bash
# macOS
cp ~/Library/Application\ Support/Claude/claude_desktop_config.json ~/claude_config_backup.json

# Windows
copy "%APPDATA%\Claude\claude_desktop_config.json" "%USERPROFILE%\claude_config_backup.json"
```

## Platform-Specific Issues

### macOS

1. **Gatekeeper Issues**: If macOS blocks execution, go to System Preferences → Security & Privacy and allow the application
2. **Rosetta**: On Apple Silicon Macs, ensure Node.js runs natively or through Rosetta

### Windows

1. **Execution Policy**: If PowerShell blocks execution:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
2. **Path Issues**: Ensure Node.js and npm are in your PATH

### Linux

1. **Missing Dependencies**: Install Node.js through your package manager
2. **Permissions**: Avoid running as root; use a user-level npm installation

## Reset Configuration

If all else fails, try a minimal configuration:

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

## Getting Help

If you're still having issues:

1. **Check our GitHub Issues**: [https://github.com/newtype-01/prompthouse-mcp/issues](https://github.com/newtype-01/prompthouse-mcp/issues)
2. **Create a new issue** with:
   - Your operating system
   - Node.js version (`node --version`)
   - Complete error messages
   - Your configuration (remove your access link)
   - Debug output if possible

## Logs and Error Messages

### Claude Desktop Logs

**macOS**:
```bash
tail -f ~/Library/Logs/Claude/claude_desktop.log
```

**Windows**: Check Event Viewer or Claude's log directory

### Server Logs

With debug mode enabled, server logs go to stderr:

```bash
# Redirect stderr to a file for analysis
PROMPTHOUSE_DEBUG=true PROMPTHOUSE_ACCESS_LINK=your-link npx prompthouse-mcp 2> mcp_debug.log
```