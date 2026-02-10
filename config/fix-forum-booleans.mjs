#!/usr/bin/env node
/**
 * Fix isPinned and isLocked values in test files
 * These are API calls that expect boolean, not number
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const SERVER_DIR = './server';
let totalFixes = 0;
let filesFixed = 0;

function processFile(filePath) {
  let content = readFileSync(filePath, 'utf8');
  let originalContent = content;
  let fixCount = 0;

  // Fix isPinned: 0 -> isPinned: false and isPinned: 1 -> isPinned: true
  // Only in API call contexts (not database inserts)
  const patterns = [
    // API call patterns (togglePinThread, toggleLockThread)
    { find: /isPinned: 1(?!\d)/g, replace: 'isPinned: true' },
    { find: /isPinned: 0(?!\d)/g, replace: 'isPinned: false' },
    { find: /isLocked: 1(?!\d)/g, replace: 'isLocked: true' },
    { find: /isLocked: 0(?!\d)/g, replace: 'isLocked: false' },
  ];

  for (const { find, replace } of patterns) {
    const matches = content.match(find);
    if (matches) {
      content = content.replace(find, replace);
      fixCount += matches.length;
    }
  }

  if (content !== originalContent) {
    writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed ${fixCount} isPinned/isLocked values in ${filePath}`);
    totalFixes += fixCount;
    filesFixed++;
  }
}

function walkDirectory(dir, extensions = ['.test.ts']) {
  try {
    const files = readdirSync(dir);
    
    for (const file of files) {
      const filePath = join(dir, file);
      const stat = statSync(filePath);
      
      if (stat.isDirectory()) {
        if (!['node_modules', 'dist', '.git', 'coverage'].includes(file)) {
          walkDirectory(filePath, extensions);
        }
      } else if (extensions.includes(extname(file)) || file.endsWith('.test.ts')) {
        processFile(filePath);
      }
    }
  } catch (e) {
    // Directory doesn't exist, skip
  }
}

console.log('🔧 Fixing isPinned/isLocked values in test files...\n');
walkDirectory(SERVER_DIR);
console.log(`\n✨ Complete! Fixed ${totalFixes} values across ${filesFixed} files.`);
