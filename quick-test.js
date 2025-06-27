#!/usr/bin/env node

const { spawn } = require('child_process');

// Test the MCP server
const child = spawn('node', ['lib/index.js'], {
  env: {
    ...process.env,
    PROMPTHOUSE_ACCESS_LINK: 'f64d48e3_d798dc04c869cd8efda2119ac02c4264',
    PROMPTHOUSE_DEBUG: 'false'
  }
});

// Send test message
const testMessage = {
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/list',
  params: {}
};

child.stdin.write(JSON.stringify(testMessage) + '\n');

// Collect response
let output = '';
child.stdout.on('data', (data) => {
  output += data.toString();
});

// Handle response
setTimeout(() => {
  child.kill('SIGTERM');
  
  if (output.trim()) {
    try {
      const response = JSON.parse(output.trim());
      console.log('✅ MCP Server Response:');
      console.log(JSON.stringify(response, null, 2));
      
      if (response.result && response.result.tools) {
        console.log(`\n🎉 Success! Found ${response.result.tools.length} tools`);
      }
    } catch (e) {
      console.log('Raw output:', output);
    }
  } else {
    console.log('❌ No response received');
  }
}, 3000);

console.log('🧪 Testing MCP server...');