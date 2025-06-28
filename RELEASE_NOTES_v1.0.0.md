# PromptHouse MCP DXT Extension v1.0.0

## 🎉 What's New

### 🎨 **Official PromptHouse Icon**
- **Professional Branding**: Now featuring the official PromptHouse app icon from the Desktop version
- **Enhanced Visual Identity**: Improved recognition and consistency across platforms
- **Better User Experience**: Easily identify the extension in Claude Desktop's interface

### 🔧 **Complete JSON-RPC Validation Fix**
- **Resolved ZodError Issues**: Eliminated complex validation error messages in Claude Desktop
- **Protocol Compliance**: Full JSON-RPC 2.0 specification compliance
- **Stable Connections**: No more "Stream closed unexpectedly" errors

## 🚀 Technical Improvements

### **Enhanced API Error Handling**
- **Empty Response Detection**: Gracefully handles incomplete API responses
- **HTTP Status Validation**: Proper validation of response status codes before JSON parsing
- **Timeout Optimization**: Extended timeout to 10 seconds for better reliability
- **Comprehensive Logging**: Detailed debug information for troubleshooting

### **Robust Message Processing**
- **Input Validation**: Validates incoming messages before processing
- **Parse Error Recovery**: Better handling of malformed JSON input
- **Error Response Standardization**: Creates proper JSON-RPC error responses
- **Message ID Preservation**: Maintains request/response correlation for protocol compliance

### **Connection Stability**
- **Graceful Failure Handling**: API failures converted to proper error responses instead of crashes
- **Network Resilience**: Improved handling of network interruptions
- **Debug Mode Support**: Enhanced debugging output for development and troubleshooting

## 🎯 User Benefits

- ✅ **No More Validation Errors**: Clean, error-free experience in Claude Desktop
- ✅ **Professional Appearance**: Official PromptHouse branding and icon
- ✅ **Reliable Connections**: Stable MCP protocol communication
- ✅ **Better Diagnostics**: Clear error messages when issues occur
- ✅ **Improved Performance**: Optimized API request handling

## 📦 Installation

1. **Download** the `prompthouse-mcp.dxt` file from this release
2. **Drag & Drop** the file into Claude Desktop
3. **Configure** your PromptHouse access link in the extension settings
4. **Enjoy** seamless access to your PromptHouse prompt library!

## 🔧 Configuration

The extension supports multiple configuration methods:

### **Environment Variables**
```bash
PROMPTHOUSE_ACCESS_LINK=your_access_link_here
PROMPTHOUSE_MODE=web  # or 'local'
PROMPTHOUSE_DEBUG=true  # for debugging
```

### **DXT Settings UI**
Configure directly through Claude Desktop's extension settings interface.

### **Configuration File**
Supports JSON configuration files in multiple locations for advanced users.

## 🌐 Connection Modes

- **Web Mode** (default): Connects to https://prompthouse.app/api/mcp-link
- **Local Mode**: Connects to localhost:3001/mcp-link for local development

## 🛠 Troubleshooting

### **Common Issues**
- **Access Link Required**: Ensure your PromptHouse access link is properly configured
- **Network Issues**: Check internet connection for web mode
- **Debug Mode**: Enable debug logging for detailed troubleshooting information

### **Debug Logging**
Enable debug mode to see detailed connection information:
- API request/response details
- Error handling flow
- Configuration loading process

## 🔗 Related Links

- **PromptHouse Web App**: https://prompthouse.app
- **NPM Package**: `npm install prompthouse-mcp` or `npx prompthouse-mcp`
- **GitHub Repository**: https://github.com/newtype-01/prompthouse-mcp
- **Documentation**: Complete setup guides and API documentation available in the repository

## 📋 What's Included

- `prompthouse-mcp.dxt` - Complete DXT extension package
- Official PromptHouse icon and branding
- Enhanced server with robust error handling
- Comprehensive configuration options
- Debug and troubleshooting tools

## 🎖 Technical Details

- **Protocol**: JSON-RPC 2.0 over stdio transport
- **Compatibility**: Claude Desktop Extensions (DXT) format
- **Authentication**: Access link-based authentication
- **Error Handling**: Graceful failure recovery with proper error responses
- **Logging**: Configurable debug output for development and troubleshooting

---

**🤖 Generated with [Claude Code](https://claude.ai/code)**

**Co-Authored-By: Claude <noreply@anthropic.com>**