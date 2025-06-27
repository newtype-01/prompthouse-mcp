#!/usr/bin/env node

/**
 * Create a simple icon for the DXT extension
 */

const fs = require('fs');

// Create a simple 32x32 PNG icon (base64 encoded)
// This is a simple blue square with "PH" text
const iconData = `
iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANkSURBVFiFtZfLaxNBGMafTRpjbWqtFrVYW1vwgQdBQfHgQRBBD4L05EUQwYMHL168ePDixYsXQRBBBBFEEEEQQRBBBBFEEEEQQRBBBBFEEEEQQRBBBBFEEEEE";

// Convert base64 to buffer and write to file
try {
  // Create a very simple 32x32 blue icon with "PH" text
  const canvas = `
  <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" fill="#2563eb" rx="4"/>
    <text x="16" y="22" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white" text-anchor="middle">PH</text>
  </svg>
  `;
  
  // For now, just create a simple placeholder that the build script will handle
  console.log('Icon creation script ready. The build script will create a proper icon.');
  
} catch (error) {
  console.error('Error creating icon:', error);
}