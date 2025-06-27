#!/usr/bin/env node

/**
 * Test script for different configuration methods
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ACCESS_LINK = 'f64d48e3_d798dc04c869cd8efda2119ac02c4264';

// Test configurations
const configurations = [
  {
    name: 'NPX Local Package',
    command: 'node',
    args: ['lib/index.js'],
    env: {
      PROMPTHOUSE_ACCESS_LINK: ACCESS_LINK,
      PROMPTHOUSE_MODE: 'web'
    }
  },
  {
    name: 'Local Mode',
    command: 'node', 
    args: ['lib/index.js'],
    env: {
      PROMPTHOUSE_ACCESS_LINK: ACCESS_LINK,
      PROMPTHOUSE_MODE: 'local'
    }
  },
  {
    name: 'Debug Mode',
    command: 'node',
    args: ['lib/index.js'],
    env: {
      PROMPTHOUSE_ACCESS_LINK: ACCESS_LINK,
      PROMPTHOUSE_MODE: 'web',
      PROMPTHOUSE_DEBUG: 'true'
    }
  },
  {
    name: 'Custom Timeout',
    command: 'node',
    args: ['lib/index.js'], 
    env: {
      PROMPTHOUSE_ACCESS_LINK: ACCESS_LINK,
      PROMPTHOUSE_MODE: 'web',
      PROMPTHOUSE_TIMEOUT: '15000'
    }
  }
];

// Test messages
const testMessages = [
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
    id: 2,
    method: 'tools/list',
    params: {}
  }
];

/**
 * Test a single configuration
 */
async function testConfiguration(config) {
  return new Promise((resolve) => {
    console.log(`\n🧪 Testing: ${config.name}`);
    console.log(`   Command: ${config.command} ${config.args.join(' ')}`);
    console.log(`   Environment:`, Object.keys(config.env).map(k => `${k}=${config.env[k]}`).join(', '));
    
    const child = spawn(config.command, config.args, {
      env: { ...process.env, ...config.env },
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let errorOutput = '';
    let responses = [];
    let currentMessageIndex = 0;

    child.stdout.on('data', (data) => {
      output += data.toString();
      const lines = output.trim().split('\n');
      
      // Process each complete line
      while (lines.length > 1) {
        const line = lines.shift();
        if (line.trim()) {
          try {
            const response = JSON.parse(line);
            responses.push(response);
            console.log(`   ✅ Response ${responses.length}:`, response.result ? 'Success' : 'Error');
            
            // Send next message if available
            if (currentMessageIndex < testMessages.length - 1) {
              currentMessageIndex++;
              const nextMessage = testMessages[currentMessageIndex];
              child.stdin.write(JSON.stringify(nextMessage) + '\n');
            } else {
              // All messages sent, close
              child.kill('SIGTERM');
            }
          } catch (e) {
            console.log(`   ⚠️  Parse error:`, line.substring(0, 100));
          }
        }
      }
      output = lines[0] || '';
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    child.on('error', (error) => {
      console.log(`   ❌ Spawn error:`, error.message);
      resolve({ success: false, error: error.message, responses });
    });

    child.on('exit', (code) => {
      const success = responses.length > 0 && responses.some(r => r.result);
      console.log(`   ${success ? '✅' : '❌'} Test ${success ? 'passed' : 'failed'} (exit code: ${code})`);
      
      if (errorOutput && config.env.PROMPTHOUSE_DEBUG === 'true') {
        console.log(`   📝 Debug output: ${errorOutput.split('\n').length} lines`);
      }
      
      resolve({ 
        success, 
        responses, 
        errorOutput: config.env.PROMPTHOUSE_DEBUG === 'true' ? errorOutput : '',
        exitCode: code 
      });
    });

    // Start by sending first message
    child.stdin.write(JSON.stringify(testMessages[0]) + '\n');
    
    // Timeout after 10 seconds
    setTimeout(() => {
      if (!child.killed) {
        console.log(`   ⏰ Test timeout`);
        child.kill('SIGTERM');
      }
    }, 10000);
  });
}

/**
 * Generate test report
 */
function generateReport(results) {
  console.log('\n📊 Test Report');
  console.log('='.repeat(50));
  
  const passed = results.filter(r => r.result.success);
  const failed = results.filter(r => !r.result.success);
  
  console.log(`Total tests: ${results.length}`);
  console.log(`Passed: ${passed.length}`);
  console.log(`Failed: ${failed.length}`);
  console.log(`Success rate: ${Math.round(passed.length / results.length * 100)}%`);
  
  if (failed.length > 0) {
    console.log('\n❌ Failed tests:');
    failed.forEach(f => {
      console.log(`  - ${f.config.name}: ${f.result.error || 'No response'}`);
    });
  }
  
  console.log('\n✅ Passed tests:');
  passed.forEach(p => {
    console.log(`  - ${p.config.name}: ${p.result.responses.length} responses`);
  });
}

/**
 * Main test runner
 */
async function runAllTests() {
  console.log('🚀 Starting PromptHouse MCP Configuration Tests');
  console.log('=' .repeat(60));
  
  const results = [];
  
  for (const config of configurations) {
    try {
      const result = await testConfiguration(config);
      results.push({ config, result });
    } catch (error) {
      console.log(`   💥 Test crashed:`, error.message);
      results.push({ config, result: { success: false, error: error.message } });
    }
  }
  
  generateReport(results);
  
  // Overall result
  const overallSuccess = results.every(r => r.result.success);
  console.log(`\n${overallSuccess ? '🎉' : '💥'} Overall: ${overallSuccess ? 'All tests passed!' : 'Some tests failed'}`);
  
  process.exit(overallSuccess ? 0 : 1);
}

// Run tests
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { testConfiguration, runAllTests };