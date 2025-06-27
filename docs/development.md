# Development Guide

This guide is for developers who want to contribute to or extend the PromptHouse MCP server.

## Project Structure

```
prompthouse-mcp/
├── package.json              # NPM package configuration
├── bin/
│   └── prompthouse-mcp      # CLI entry point
├── lib/
│   ├── index.js             # Main server logic
│   ├── config.js            # Configuration management
│   └── handlers.js          # MCP protocol handlers
├── examples/
│   ├── claude-desktop-config.json
│   ├── cursor-config.json
│   └── ...
├── dxt/
│   ├── manifest.json        # DXT extension manifest
│   ├── server.js           # Standalone DXT server
│   └── build.sh            # DXT build script
├── docs/
│   ├── installation.md
│   ├── troubleshooting.md
│   └── development.md
└── scripts/
    └── test.js             # Test utilities
```

## Architecture

### Core Components

1. **CLI Entry Point** (`bin/prompthouse-mcp`)
   - Executable script that starts the server
   - Minimal wrapper around the main logic

2. **Main Server** (`lib/index.js`)
   - Stdio-based MCP server implementation
   - Handles JSON-RPC communication
   - Forwards requests to PromptHouse API

3. **Configuration** (`lib/config.js`)
   - Environment variable management
   - Endpoint configuration for web/local modes
   - Validation utilities

4. **Protocol Handlers** (`lib/handlers.js`)
   - MCP protocol method implementations
   - Error handling utilities
   - Response formatting

### Communication Flow

```
Claude Desktop ←→ stdio ←→ MCP Server ←→ HTTPS ←→ PromptHouse API
```

1. Claude Desktop sends JSON-RPC messages via stdin
2. MCP Server parses and validates messages
3. Server forwards requests to PromptHouse API
4. API responses are formatted and sent back via stdout

## Development Setup

### Prerequisites

- Node.js 16+
- Access to PromptHouse API (access link)
- Git

### Local Development

```bash
# Clone the repository
git clone https://github.com/newtype-01/prompthouse-mcp.git
cd prompthouse-mcp

# Test the server
PROMPTHOUSE_ACCESS_LINK=your-link node lib/index.js

# Run tests
npm test
```

### Testing

#### Manual Testing

```bash
# Test initialization
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}' | PROMPTHOUSE_ACCESS_LINK=your-link node lib/index.js

# Test tools list
echo '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' | PROMPTHOUSE_ACCESS_LINK=your-link node lib/index.js
```

#### Automated Testing

```bash
# Run the test suite
node scripts/test.js

# Test with debug output
PROMPTHOUSE_DEBUG=true node scripts/test.js
```

#### Integration Testing

Test with real MCP clients:

```bash
# Test with Claude Desktop
# 1. Configure claude_desktop_config.json
# 2. Restart Claude Desktop
# 3. Try "List my prompts" in a conversation

# Test with custom client
node your-mcp-client.js
```

## Code Style

### JavaScript Standards

- Use modern JavaScript (ES2020+)
- Prefer `const` over `let` when possible
- Use descriptive variable names
- Add comments for complex logic

### Error Handling

- Always wrap async operations in try-catch
- Return proper JSON-RPC error responses
- Log errors with context for debugging

Example:
```javascript
try {
  const response = await makeApiRequest(message);
  return response;
} catch (error) {
  debug('API request failed:', error.message);
  return {
    jsonrpc: '2.0',
    id: message.id,
    error: {
      code: -32603,
      message: 'Internal error',
      data: DEBUG ? error.message : undefined
    }
  };
}
```

### Logging

- Use the `debug()` function for development logs
- Log to stderr to avoid interfering with JSON-RPC
- Include context in log messages

## Adding New Features

### New MCP Methods

1. Add handler to `lib/handlers.js`:
```javascript
function handleNewMethod(params, id) {
  return {
    jsonrpc: '2.0',
    id: id,
    result: {
      // your result here
    }
  };
}
```

2. Update `lib/index.js` to route the method:
```javascript
case 'new/method':
  return await handleNewMethod(message.params, message.id);
```

3. Add tests in `scripts/test.js`

### New Environment Variables

1. Update `lib/config.js`:
```javascript
if (process.env.NEW_VARIABLE) {
  config.newOption = process.env.NEW_VARIABLE;
}
```

2. Update documentation in README.md
3. Add validation if needed

### New Connection Modes

1. Add endpoint to `lib/config.js`:
```javascript
endpoints: {
  // existing endpoints...
  newMode: {
    hostname: 'example.com',
    path: '/api/mcp',
    protocol: 'https:',
    port: 443
  }
}
```

2. Update validation and documentation

## Building and Distribution

### NPM Package

```bash
# Build and test locally
npm pack

# Publish to npm
npm publish
```

### DXT Extension

```bash
# Build DXT package
cd dxt/
./build.sh

# Test the package
# Install prompthouse-mcp.dxt in Claude Desktop
```

## API Integration

### PromptHouse API

The server communicates with these endpoints:

- **Web**: `https://prompthouse.app/api/mcp-link`
- **Local**: `http://localhost:3001/mcp-link`

#### Request Format

All requests are JSON-RPC 2.0 over HTTPS POST:

```javascript
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {}
}
```

#### Authentication

Access link is passed as query parameter:
```
https://prompthouse.app/api/mcp-link?accessLink=your-link-here
```

#### Response Format

Standard JSON-RPC responses:

```javascript
// Success
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [...]
  }
}

// Error
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32603,
    "message": "Internal error"
  }
}
```

## Debugging

### Debug Mode

Enable detailed logging:

```bash
PROMPTHOUSE_DEBUG=true node lib/index.js
```

Debug output includes:
- Incoming messages
- API requests/responses
- Error details
- Server state changes

### Common Issues

1. **No response from server**
   - Check that access link is valid
   - Verify API endpoint is reachable
   - Enable debug mode to see requests

2. **JSON parsing errors**
   - Validate message format
   - Check for extra whitespace or characters

3. **Connection timeouts**
   - Increase timeout with `PROMPTHOUSE_TIMEOUT`
   - Check network connectivity

## Contributing

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Update documentation
6. Submit a pull request

### Issue Reporting

When reporting issues, include:
- Operating system
- Node.js version
- Complete error messages
- Debug output if possible
- Steps to reproduce

### Code Review

All changes are reviewed for:
- Functionality
- Code quality
- Documentation
- Backward compatibility
- Security considerations

## Release Process

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create git tag
4. Publish to npm
5. Build and upload DXT package
6. Update documentation

## Security Considerations

- Never log access links in production
- Validate all input parameters
- Use HTTPS for API communication
- Handle errors gracefully without exposing internals
- Keep dependencies updated