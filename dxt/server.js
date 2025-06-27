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

// DXT Configuration mapping
const ACCESS_LINK = process.env.access_link;
const MODE = process.env.mode || 'web';
const DEBUG = process.env.debug === 'true';

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
 * Make API request
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
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(new Error(`Invalid JSON: ${error.message}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Handle MCP messages
 */
async function handleMessage(message) {
  try {
    debug('Handling message:', message.method);

    // Handle notifications (no response)
    if (message.method === 'notifications/initialized') {
      await makeApiRequest(message);
      return null;
    }

    // Forward to API
    return await makeApiRequest(message);

  } catch (error) {
    debug('Error:', error.message);
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
 * Main function
 */
function main() {
  if (!ACCESS_LINK) {
    console.error('Error: access_link configuration is required');
    console.error('Please configure your PromptHouse access link in the DXT extension settings.');
    process.exit(1);
  }

  debug('Starting DXT MCP Server');
  debug('Mode:', MODE);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  rl.on('line', async (line) => {
    try {
      const message = JSON.parse(line.trim());
      const response = await handleMessage(message);
      
      if (response) {
        console.log(JSON.stringify(response));
      }
    } catch (error) {
      debug('Parse error:', error.message);
      console.log(JSON.stringify({
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32700,
          message: 'Parse error'
        }
      }));
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