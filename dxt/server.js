#!/usr/bin/env node

/**
 * PromptHouse MCP Server for DXT Extension
 * 
 * This is a standalone server bundled with the DXT extension.
 * It includes all dependencies and can run without external npm packages.
 */

const readline = require('readline');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

/**
 * Enhanced configuration loading for DXT
 * Tries multiple sources to find configuration
 */
function loadConfiguration() {
  const config = {
    accessLink: null,
    mode: 'web',
    debug: false
  };

  // Method 1: Environment variables (standard DXT way)
  config.accessLink = process.env.access_link || process.env.PROMPTHOUSE_ACCESS_LINK;
  config.mode = process.env.mode || process.env.PROMPTHOUSE_MODE || 'web';
  config.debug = (process.env.debug === 'true') || (process.env.PROMPTHOUSE_DEBUG === 'true');

  // Method 2: Command line arguments
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--access-link=')) {
      config.accessLink = args[i].split('=')[1];
    } else if (args[i].startsWith('--mode=')) {
      config.mode = args[i].split('=')[1];
    } else if (args[i] === '--debug') {
      config.debug = true;
    }
  }

  // Method 3: Try to read from DXT config file
  try {
    const configPaths = [
      path.join(process.cwd(), 'config.json'),
      path.join(__dirname, 'config.json'),
      path.join(process.env.HOME || '', '.claude', 'extensions', 'prompthouse-mcp', 'config.json')
    ];
    
    for (const configPath of configPaths) {
      if (fs.existsSync(configPath)) {
        const fileConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        config.accessLink = config.accessLink || fileConfig.access_link || fileConfig.accessLink;
        config.mode = config.mode || fileConfig.mode || 'web';
        config.debug = config.debug || fileConfig.debug || false;
        console.error('[PromptHouse MCP DXT] Loaded config from:', configPath);
        break;
      }
    }
  } catch (error) {
    console.error('[PromptHouse MCP DXT] Config file read error:', error.message);
  }

  // Debug output
  if (config.debug) {
    console.error('[PromptHouse MCP DXT] Configuration loaded:');
    console.error('  Access Link:', config.accessLink ? 'PROVIDED' : 'MISSING');
    console.error('  Mode:', config.mode);
    console.error('  Debug:', config.debug);
    console.error('  Environment variables:');
    console.error('    access_link:', process.env.access_link ? 'SET' : 'NOT_SET');
    console.error('    PROMPTHOUSE_ACCESS_LINK:', process.env.PROMPTHOUSE_ACCESS_LINK ? 'SET' : 'NOT_SET');
    console.error('    mode:', process.env.mode || 'NOT_SET');
    console.error('    debug:', process.env.debug || 'NOT_SET');
  }

  return config;
}

// Load configuration
const CONFIG = loadConfiguration();
const ACCESS_LINK = CONFIG.accessLink;
const MODE = CONFIG.mode;
const DEBUG = CONFIG.debug;

// Server endpoints
const ENDPOINTS = {
  web: {
    hostname: 'prompthouse.app',
    path: '/api/mcp-link',
    protocol: 'https:',
    port: 443
  },
  local: {
    hostname: 'localhost',
    path: '/mcp-link',
    protocol: 'http:',
    port: 3001
  }
};

/**
 * Debug logging
 */
function debug(...args) {
  if (DEBUG) {
    console.error('[PromptHouse MCP DXT]', ...args);
  }
}

/**
 * Make API request with enhanced error handling
 */
function makeApiRequest(message) {
  return new Promise((resolve, reject) => {
    const endpoint = ENDPOINTS[MODE];
    const postData = JSON.stringify(message);
    
    const options = {
      hostname: endpoint.hostname,
      port: endpoint.port,
      path: `${endpoint.path}?accessLink=${ACCESS_LINK}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'PromptHouse-MCP-DXT/1.0.0'
      }
    };

    debug('API Request:', options.path);

    const client = endpoint.protocol === 'https:' ? https : http;
    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        debug('API Response received, length:', data.length, 'status:', res.statusCode);
        
        // Handle empty responses
        if (!data || data.trim() === '') {
          debug('Empty response received');
          reject(new Error('Empty response from API'));
          return;
        }

        // Handle non-200 status codes
        if (res.statusCode < 200 || res.statusCode >= 300) {
          debug('HTTP error status:', res.statusCode, 'response:', data.substring(0, 200));
          reject(new Error(`HTTP ${res.statusCode}: ${data.substring(0, 100)}`));
          return;
        }

        try {
          const parsed = JSON.parse(data);
          debug('Successfully parsed JSON response');
          resolve(parsed);
        } catch (error) {
          debug('JSON parse error:', error.message, 'Raw data length:', data.length);
          debug('Raw data preview:', data.substring(0, 200));
          reject(new Error(`Invalid JSON response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      debug('Request error:', error.message);
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      debug('Request timeout');
      req.destroy();
      reject(new Error('Request timeout after 10 seconds'));
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Handle MCP messages with robust error handling
 */
async function handleMessage(message) {
  try {
    debug('Handling message:', message.method, 'id:', message.id);

    // Validate input message
    if (!message || typeof message !== 'object') {
      throw new Error('Invalid message format');
    }

    if (!message.method) {
      throw new Error('Missing method in message');
    }

    // Handle notifications (no response expected)
    if (message.method === 'notifications/initialized') {
      try {
        await makeApiRequest(message);
      } catch (error) {
        debug('Notification failed (ignoring):', error.message);
      }
      return null;
    }

    // Forward to API and return response
    const response = await makeApiRequest(message);
    
    // Validate the response structure
    if (!response || typeof response !== 'object') {
      throw new Error('Invalid API response format');
    }

    // Ensure response has required fields
    if (!response.jsonrpc) {
      response.jsonrpc = '2.0';
    }

    if (response.id === undefined && message.id !== undefined) {
      response.id = message.id;
    }

    debug('Response ready for message:', message.method);
    return response;

  } catch (error) {
    debug('Error handling message:', error.message);
    
    // Create proper JSON-RPC error response
    const errorResponse = {
      jsonrpc: '2.0',
      id: (message && message.id !== undefined) ? message.id : null,
      error: {
        code: -32603,
        message: 'Internal error'
      }
    };

    // Add error details in debug mode
    if (DEBUG) {
      errorResponse.error.data = {
        originalError: error.message,
        method: message ? message.method : 'unknown',
        timestamp: new Date().toISOString()
      };
    }

    return errorResponse;
  }
}

/**
 * Main function
 */
function main() {
  // Enhanced error reporting
  if (!ACCESS_LINK) {
    console.error('\n=== PromptHouse MCP DXT Configuration Error ===');
    console.error('Error: access_link configuration is required');
    console.error('\nDebugging information:');
    console.error('  Working directory:', process.cwd());
    console.error('  Script directory:', __dirname);
    console.error('  Command line args:', process.argv);
    console.error('\nEnvironment variables:');
    Object.keys(process.env).filter(key => 
      key.includes('access') || key.includes('mode') || key.includes('debug') || key.includes('PROMPT')
    ).forEach(key => {
      console.error(`  ${key}:`, process.env[key] || 'NOT_SET');
    });
    console.error('\nPlease configure your PromptHouse access link in the DXT extension settings.');
    console.error('If the problem persists, try the NPM method: npx prompthouse-mcp\n');
    process.exit(1);
  }

  console.error('[PromptHouse MCP DXT] Starting with configuration:');
  console.error('  Access Link: PROVIDED');
  console.error('  Mode:', MODE);
  console.error('  Debug:', DEBUG);
  
  debug('Starting DXT MCP Server');
  debug('Mode:', MODE);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  rl.on('line', async (line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      return; // Skip empty lines
    }

    let message = null;
    
    try {
      // Parse the incoming JSON-RPC message
      message = JSON.parse(trimmedLine);
      debug('Received message:', message.method, 'id:', message.id);
      
      // Handle the message
      const response = await handleMessage(message);
      
      // Send response if one is expected
      if (response !== null) {
        const responseStr = JSON.stringify(response);
        debug('Sending response:', responseStr.substring(0, 100) + (responseStr.length > 100 ? '...' : ''));
        console.log(responseStr);
      }
      
    } catch (parseError) {
      debug('Parse error for line:', trimmedLine.substring(0, 100));
      debug('Parse error details:', parseError.message);
      
      // Create parse error response
      const errorResponse = {
        jsonrpc: '2.0',
        id: null, // Can't get ID from malformed JSON
        error: {
          code: -32700,
          message: 'Parse error'
        }
      };

      if (DEBUG) {
        errorResponse.error.data = {
          originalError: parseError.message,
          receivedData: trimmedLine.substring(0, 200)
        };
      }

      console.log(JSON.stringify(errorResponse));
    }
  });

  rl.on('close', () => {
    debug('Server shutting down');
    process.exit(0);
  });

  process.on('SIGINT', () => rl.close());
  process.on('SIGTERM', () => rl.close());

  debug('DXT MCP Server ready');
}

// Start server
main();