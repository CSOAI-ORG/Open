#!/usr/bin/env node
/**
 * Fix test files to use boolean for API calls
 * Tests should use true/false for isActive when calling tRPC procedures
 * because Zod validates as boolean, then the router converts to 0/1 for DB
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

  // Fix isActive: 0 -> isActive: false in test files (for API calls)
  const pattern0 = /isActive: 0(?!\d)/g;
  const pattern1 = /isActive: 1(?!\d)/g;
  
  const matches0 = content.match(pattern0);
  const matches1 = content.match(pattern1);
  
  if (matches0) {
    content = content.replace(pattern0, 'isActive: false');
    fixCount += matches0.length;
  }
  if (matches1) {
    content = content.replace(pattern1, 'isActive: true');
    fixCount += matches1.length;
  }

  if (content !== originalContent) {
    writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed ${fixCount} isActive values in ${filePath}`);
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

console.log('🔧 Fixing isActive values in test files...\n');
walkDirectory(SERVER_DIR);
console.log(`\n✨ Complete! Fixed ${totalFixes} isActive values across ${filesFixed} files.`);
