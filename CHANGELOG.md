# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-06-27

### Added
- Initial release of PromptHouse MCP Server
- Stdio-based MCP protocol implementation
- Support for web and local connection modes
- NPX package distribution
- DXT extension support for Claude Desktop
- Comprehensive documentation and troubleshooting guides

### Features
- **MCP Protocol Support**: Full JSON-RPC 2.0 implementation
- **Multi-platform**: Works with Claude Desktop, Cursor, and other MCP clients
- **Connection Modes**: 
  - Web mode: Connect to https://prompthouse.app
  - Local mode: Connect to localhost:3001
- **Authentication**: Secure access-link based authentication
- **Tools Available**:
  - `get_prompt_list`: List all user prompts
  - `get_prompt`: Retrieve specific prompt content
- **Installation Methods**:
  - NPX: `npx prompthouse-mcp`
  - Global: `npm install -g prompthouse-mcp`
  - GitHub: `npx github:newtype-01/prompthouse-mcp`
  - DXT Extension: One-click install in Claude Desktop

### Configuration
- Environment variable configuration
- Debug mode support
- Configurable timeouts
- Multiple endpoint support

### Documentation
- Complete installation guide
- Troubleshooting documentation
- Development guide
- Configuration examples for multiple clients

### Testing
- Automated test suite
- Manual testing utilities
- Integration test examples

## [Unreleased]

### Planned
- Support for additional MCP clients
- Enhanced error reporting
- Performance optimizations
- Extended prompt metadata support