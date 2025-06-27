#!/usr/bin/env node

/**
 * PromptHouse MCP Server
 * 
 * A stdio-based MCP server that connects AI clients to PromptHouse prompts.
 * Supports both web (https://prompthouse.app) and local server modes.
 */

const { createReadStream, createWriteStream } = require('fs');
const readline = require('readline');
const https = require('https');
const http = require('http');

// Configuration
const CONFIG = {
  web: {
    hostname: 'prompthouse.app',
    path: '/api/mcp-link',
    protocol: 'https:'
  },
  local: {
    hostname: 'localhost',
    port: 3001,
    path: '/mcp-link', 
    protocol: 'http:'
  }
};

// Environment variables
const ACCESS_LINK = process.env.PROMPTHOUSE_ACCESS_LINK;
const MODE = process.env.PROMPTHOUSE_MODE || 'web';
const DEBUG = process.env.PROMPTHOUSE_DEBUG === 'true';

/**
 * Log debug messages to stderr
 */
function debug(...args) {
  if (DEBUG) {
    console.error('[PromptHouse MCP]', ...args);
  }
}

/**
 * Make HTTP request to MCP API
 */
function makeApiRequest(message) {
  return new Promise((resolve, reject) => {
    const config = CONFIG[MODE];
    const postData = JSON.stringify(message);
    
    const options = {
      hostname: config.hostname,
      port: config.port || (config.protocol === 'https:' ? 443 : 80),
      path: `${config.path}?accessLink=${ACCESS_LINK}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'PromptHouse-MCP/1.0.0'
      }
    };

    debug('Making request to:', `${config.protocol}//${config.hostname}${config.port ? ':' + config.port : ''}${options.path}`);
    debug('Request data:', message);

    const client = config.protocol === 'https:' ? https : http;
    const req = client.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          debug('Response received:', response);
          resolve(response);
        } catch (error) {
          debug('JSON parse error:', error.message);
          reject(new Error(`Invalid JSON response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      debug('Request error:', error.message);
      reject(error);
    });

    req.on('timeout', () => {
      debug('Request timeout');
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.setTimeout(10000); // 10 second timeout
    req.write(postData);
    req.end();
  });
}

/**
 * Handle MCP protocol messages
 */
async function handleMessage(message) {
  try {
    // Validate JSON-RPC format
    if (!message.jsonrpc || message.jsonrpc !== '2.0') {
      throw new Error('Invalid JSON-RPC version');
    }

    // Special handling for notifications (no response expected)
    if (message.method === 'notifications/initialized') {
      debug('Received initialized notification, forwarding to API');
      await makeApiRequest(message);
      return; // No response for notifications
    }

    // Forward all other messages to the API
    const response = await makeApiRequest(message);
    return response;

  } catch (error) {
    debug('Error handling message:', error.message);
    
    // Return JSON-RPC error response
    return {
      jsonrpc: '2.0',
      id: message.id || null,
      error: {
        code: -32603,
        message: 'Internal error',
        data: DEBUG ? error.message : undefined
      }
    };
  }
}

/**
 * Main server function
 */
function main() {
  // Validate required environment variables
  if (!ACCESS_LINK) {
    console.error('Error: PROMPTHOUSE_ACCESS_LINK environment variable is required');
    console.error('');
    console.error('To get your access link:');
    console.error('1. Go to https://prompthouse.app');
    console.error('2. Sign in with Google');
    console.error('3. Click "Set Up MCP" in the top right');
    console.error('4. Copy your access link');
    console.error('');
    console.error('Example usage:');
    console.error('  PROMPTHOUSE_ACCESS_LINK=your-link-here npx prompthouse-mcp');
    process.exit(1);
  }

  debug('Starting PromptHouse MCP Server');
  debug('Mode:', MODE);
  debug('Access link:', ACCESS_LINK ? 'provided' : 'missing');

  // Set up stdio interface
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  // Handle incoming messages
  rl.on('line', async (line) => {
    try {
      const message = JSON.parse(line.trim());
      debug('Received message:', message.method || 'unknown');
      
      const response = await handleMessage(message);
      
      // Only send response if it exists (not for notifications)
      if (response) {
        const responseText = JSON.stringify(response);
        console.log(responseText);
        debug('Sent response for:', message.method);
      }
      
    } catch (error) {
      debug('Line processing error:', error.message);
      
      // Send error response
      const errorResponse = {
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32700,
          message: 'Parse error',
          data: DEBUG ? error.message : undefined
        }
      };
      
      console.log(JSON.stringify(errorResponse));
    }
  });

  // Handle process termination
  rl.on('close', () => {
    debug('MCP server shutting down');
    process.exit(0);
  });

  // Handle signals
  process.on('SIGINT', () => {
    debug('Received SIGINT, shutting down gracefully');
    rl.close();
  });

  process.on('SIGTERM', () => {
    debug('Received SIGTERM, shutting down gracefully');
    rl.close();
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    debug('Uncaught exception:', error.message);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    debug('Unhandled rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });

  debug('MCP server ready, waiting for messages...');
}

// Export for testing
module.exports = main;

// Run if called directly
if (require.main === module) {
  main();
}