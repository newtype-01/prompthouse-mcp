#!/bin/bash

#
# Build script for PromptHouse MCP DXT Extension
#

set -e

echo "🔨 Building PromptHouse MCP DXT Extension..."

# Create temporary build directory
BUILD_DIR="./build"
DXT_NAME="prompthouse-mcp.dxt"

# Clean previous build
rm -rf "$BUILD_DIR"
rm -f "$DXT_NAME"

# Create build directory
mkdir -p "$BUILD_DIR"

# Copy DXT files
echo "📁 Copying DXT files..."
cp manifest.json "$BUILD_DIR/"
cp server.js "$BUILD_DIR/"

# Copy icon if it exists
if [ -f "icon.png" ]; then
    cp icon.png "$BUILD_DIR/"
else
    echo "⚠️  Warning: icon.png not found, creating placeholder"
    # Create a simple placeholder icon (1x1 transparent PNG)
    echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | base64 -d > "$BUILD_DIR/icon.png"
fi

# Create LICENSE file
echo "📄 Creating LICENSE file..."
cat > "$BUILD_DIR/LICENSE" << EOF
MIT License

Copyright (c) 2024 PromptHouse

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF

# Create README for the extension
echo "📖 Creating extension README..."
cat > "$BUILD_DIR/README.md" << 'EOF'
# PromptHouse MCP Extension

This is a DXT extension for PromptHouse MCP integration with Claude Desktop.

## Configuration

After installing this extension, you'll need to configure:

1. **access_link**: Your personal access link from PromptHouse
   - Go to https://prompthouse.app
   - Sign in with Google  
   - Click "Set Up MCP"
   - Copy your access link

2. **mode**: Connection mode (web or local)
   - `web`: Connect to online PromptHouse (default)
   - `local`: Connect to local server on localhost:3001

3. **debug**: Enable debug logging (optional)

## Support

- Website: https://prompthouse.app
- GitHub: https://github.com/newtype-01/prompthouse-mcp
- Issues: https://github.com/newtype-01/prompthouse-mcp/issues
EOF

# Make server.js executable
chmod +x "$BUILD_DIR/server.js"

# Create the DXT package (ZIP file with .dxt extension)
echo "📦 Creating DXT package..."
cd "$BUILD_DIR"
zip -r "../$DXT_NAME" ./*
cd ..

# Clean up build directory
rm -rf "$BUILD_DIR"

# Verify the package
if [ -f "$DXT_NAME" ]; then
    SIZE=$(du -h "$DXT_NAME" | cut -f1)
    echo "✅ Successfully created $DXT_NAME ($SIZE)"
    echo ""
    echo "🎉 DXT extension ready for distribution!"
    echo ""
    echo "To test the extension:"
    echo "1. Install it in Claude Desktop"
    echo "2. Configure your access link" 
    echo "3. Restart Claude Desktop"
    echo ""
    echo "Package contents:"
    unzip -l "$DXT_NAME"
else
    echo "❌ Failed to create DXT package"
    exit 1
fi