/**
 * MCP Protocol Message Handlers
 */

/**
 * Handle initialize method
 */
function handleInitialize(params, id) {
  const clientCapabilities = params?.capabilities || {};
  const clientInfo = params?.clientInfo || {};
  const protocolVersion = params?.protocolVersion || '2024-11-05';
  
  // Build server capabilities
  const serverCapabilities = {
    tools: {
      listChanged: true
    },
    logging: {},
    prompts: {},
    resources: {}
  };
  
  // Add roots capability if client supports it
  if (clientCapabilities.roots) {
    serverCapabilities.roots = {
      listChanged: true
    };
  }
  
  return {
    jsonrpc: '2.0',
    id: id,
    result: {
      protocolVersion: protocolVersion,
      capabilities: serverCapabilities,
      serverInfo: {
        name: 'prompthouse-mcp',
        version: '1.0.0'
      }
    }
  };
}

/**
 * Handle tools/list method
 */
function handleToolsList(params, id) {
  const tools = [
    {
      name: 'get_prompt_list',
      description: 'List all available prompts with their titles, descriptions, and tags. Use this to discover what prompts are available before retrieving specific ones.',
      inputSchema: {
        type: 'object',
        properties: {},
        required: []
      }
    },
    {
      name: 'get_prompt',
      description: 'Retrieve the complete content of a specific prompt by its ID, including all messages, arguments, and metadata.',
      inputSchema: {
        type: 'object',
        properties: {
          prompt_id: {
            type: 'string',
            description: 'The unique identifier of the prompt to retrieve'
          }
        },
        required: ['prompt_id']
      }
    }
  ];
  
  return {
    jsonrpc: '2.0',
    id: id,
    result: {
      tools: tools
    }
  };
}

/**
 * Handle ping method
 */
function handlePing(params, id) {
  return {
    jsonrpc: '2.0',
    id: id,
    result: {}
  };
}

/**
 * Handle roots/list method
 */
function handleRootsList(params, id) {
  return {
    jsonrpc: '2.0',
    id: id,
    result: {
      roots: [
        {
          uri: 'file:///prompts',
          name: 'Prompts'
        }
      ]
    }
  };
}

/**
 * Handle resources/list method
 */
function handleResourcesList(params, id) {
  return {
    jsonrpc: '2.0',
    id: id,
    result: {
      resources: []
    }
  };
}

/**
 * Handle prompts/list method
 */
function handlePromptsList(params, id) {
  return {
    jsonrpc: '2.0',
    id: id,
    result: {
      prompts: []
    }
  };
}

/**
 * Handle completion/complete method
 */
function handleCompletion(params, id) {
  return {
    jsonrpc: '2.0',
    id: id,
    result: {
      completion: {
        values: [],
        total: 0,
        hasMore: false
      }
    }
  };
}

/**
 * Create error response
 */
function createError(id, code, message, data = undefined) {
  return {
    jsonrpc: '2.0',
    id: id,
    error: {
      code: code,
      message: message,
      data: data
    }
  };
}

/**
 * Common JSON-RPC error codes
 */
const ERROR_CODES = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603
};

module.exports = {
  handleInitialize,
  handleToolsList,
  handlePing,
  handleRootsList,
  handleResourcesList,
  handlePromptsList,
  handleCompletion,
  createError,
  ERROR_CODES
};