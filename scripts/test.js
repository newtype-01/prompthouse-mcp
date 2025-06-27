#!/usr/bin/env node

/**
 * Test script for PromptHouse MCP Server
 */

const { spawn } = require('child_process');
const path = require('path');

// Test configuration
const TEST_ACCESS_LINK = 'test-access-link-123';
const TEST_MESSAGES = [
  {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: { tools: {} },
      clientInfo: { name: 'test-client', version: '1.0.0' }
    }
  },
  {
    jsonrpc: '2.0',
    method: 'notifications/initialized',
    params: {}
  },
  {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list',
    params: {}
  }
];

console.log('🧪 Testing PromptHouse MCP Server...\n');

// Test function
async function runTest() {
  return new Promise((resolve, reject) => {
    const serverPath = path.join(__dirname, '..', 'lib', 'index.js');
    
    const child = spawn('node', [serverPath], {
      env: {
        ...process.env,
        PROMPTHOUSE_ACCESS_LINK: TEST_ACCESS_LINK,
        PROMPTHOUSE_MODE: 'web',
        PROMPTHOUSE_DEBUG: 'true'
      },
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let responseCount = 0;
    let responses = [];

    child.stdout.on('data', (data) => {
      const lines = data.toString().trim().split('\n');
      lines.forEach(line => {
        if (line.trim()) {
          try {
            const response = JSON.parse(line);
            responses.push(response);
            responseCount++;
            
            console.log(`✅ Response ${responseCount}:`, JSON.stringify(response, null, 2));
            
            // Send next message after receiving response
            if (responseCount < TEST_MESSAGES.length) {
              const nextMessage = TEST_MESSAGES[responseCount];
              if (nextMessage.method !== 'notifications/initialized') {
                console.log(`📤 Sending message ${responseCount + 1}:`, nextMessage.method);
                child.stdin.write(JSON.stringify(nextMessage) + '\n');
              }
            } else {
              // All messages sent and responses received
              child.kill('SIGTERM');
              resolve(responses);
            }
          } catch (e) {
            console.error('❌ Failed to parse response:', line);
          }
        }
      });
    });

    child.stderr.on('data', (data) => {
      console.log('🔍 Debug:', data.toString().trim());
    });

    child.on('error', (error) => {
      console.error('❌ Spawn error:', error);
      reject(error);
    });

    child.on('exit', (code) => {
      if (code === 0) {
        console.log('\n✅ Test completed successfully!');
        resolve(responses);
      } else {
        console.error(`\n❌ Process exited with code ${code}`);
        reject(new Error(`Process exited with code ${code}`));
      }
    });

    // Start the test by sending the first message
    console.log('📤 Sending message 1:', TEST_MESSAGES[0].method);
    child.stdin.write(JSON.stringify(TEST_MESSAGES[0]) + '\n');

    // Send initialized notification (no response expected)
    setTimeout(() => {
      console.log('📤 Sending notification:', TEST_MESSAGES[1].method);
      child.stdin.write(JSON.stringify(TEST_MESSAGES[1]) + '\n');
    }, 1000);
  });
}

// Run the test
if (require.main === module) {
  runTest()
    .then(() => {
      console.log('\n🎉 All tests passed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Test failed:', error.message);
      process.exit(1);
    });
}

module.exports = { runTest };