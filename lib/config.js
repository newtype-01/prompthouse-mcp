/**
 * Configuration Management for PromptHouse MCP Server
 */

const path = require('path');
const fs = require('fs');

/**
 * Default configuration
 */
const DEFAULT_CONFIG = {
  // Server endpoints
  endpoints: {
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
  },
  
  // Request settings
  timeout: 10000, // 10 seconds
  retries: 3,
  
  // Debug settings
  debug: false
};

/**
 * Load configuration from environment variables
 */
function loadConfig() {
  const config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  
  // Override with environment variables
  if (process.env.PROMPTHOUSE_TIMEOUT) {
    config.timeout = parseInt(process.env.PROMPTHOUSE_TIMEOUT, 10);
  }
  
  if (process.env.PROMPTHOUSE_RETRIES) {
    config.retries = parseInt(process.env.PROMPTHOUSE_RETRIES, 10);
  }
  
  if (process.env.PROMPTHOUSE_DEBUG === 'true') {
    config.debug = true;
  }
  
  // Custom endpoint configuration
  if (process.env.PROMPTHOUSE_CUSTOM_URL) {
    const url = new URL(process.env.PROMPTHOUSE_CUSTOM_URL);
    config.endpoints.custom = {
      hostname: url.hostname,
      path: url.pathname,
      protocol: url.protocol,
      port: url.port || (url.protocol === 'https:' ? 443 : 80)
    };
  }
  
  return config;
}

/**
 * Get endpoint configuration for the specified mode
 */
function getEndpoint(mode = 'web') {
  const config = loadConfig();
  return config.endpoints[mode] || config.endpoints.web;
}

/**
 * Validate configuration
 */
function validateConfig() {
  const errors = [];
  
  if (!process.env.PROMPTHOUSE_ACCESS_LINK) {
    errors.push('PROMPTHOUSE_ACCESS_LINK is required');
  }
  
  const mode = process.env.PROMPTHOUSE_MODE || 'web';
  const endpoint = getEndpoint(mode);
  
  if (!endpoint) {
    errors.push(`Invalid mode: ${mode}`);
  }
  
  return errors;
}

module.exports = {
  loadConfig,
  getEndpoint,
  validateConfig,
  DEFAULT_CONFIG
};