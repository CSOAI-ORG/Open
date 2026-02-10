#!/usr/bin/env node
/**
 * Automated TypeScript Error Fix Script
 * Batch-fixes common patterns across all TypeScript files
 * 
 * Patterns fixed:
 * 1. Function return type annotations (void, Promise<void>, string, boolean, JSX.Element)
 * 2. Boolean type conversions (1/0 to true/false)
 * 3. Event handler type annotations
 * 4. Null/undefined handling with optional chaining
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const CLIENT_SRC = './client/src';
const SERVER_DIR = './server';

let totalFixes = 0;
let filesFixed = 0;

// Pattern definitions for fixes
const patterns = [
  // Arrow functions without return types (void handlers)
  {
    name: 'void-return-handlers',
    regex: /const (handle\w+|on\w+|toggle\w+|reset\w+|confirm\w+|close\w+|open\w+|clear\w+|submit\w+|save\w+|delete\w+|update\w+|create\w+|remove\w+|add\w+|set\w+) = \(([^)]*)\) => \{/g,
    replacement: 'const $1 = ($2): void => {',
    skip: (match) => match.includes(': void') || match.includes(': Promise')
  },
  // Async arrow functions without return types
  {
    name: 'async-void-handlers',
    regex: /const (handle\w+|on\w+|submit\w+|save\w+|fetch\w+|load\w+) = async \(([^)]*)\) => \{/g,
    replacement: 'const $1 = async ($2): Promise<void> => {',
    skip: (match) => match.includes(': Promise')
  },
  // Boolean conversions: isRead: 1 -> isRead: true
  {
    name: 'boolean-1-to-true',
    regex: /(is\w+|has\w+|can\w+|should\w+|enabled|disabled|active|locked|public|private|pinned|archived|verified|completed|read|unread):\s*1(?!\d)/gi,
    replacement: '$1: true',
    skip: () => false
  },
  // Boolean conversions: isRead: 0 -> isRead: false
  {
    name: 'boolean-0-to-false',
    regex: /(is\w+|has\w+|can\w+|should\w+|enabled|disabled|active|locked|public|private|pinned|archived|verified|completed|read|unread):\s*0(?!\d)/gi,
    replacement: '$1: false',
    skip: () => false
  },
  // Get functions returning strings
  {
    name: 'get-string-functions',
    regex: /const (get\w*Color|get\w*Class|get\w*Style|get\w*Label|get\w*Text|get\w*Name|get\w*Title) = \(([^)]*)\) => \{/g,
    replacement: 'const $1 = ($2): string => {',
    skip: (match) => match.includes(': string')
  },
  // Get functions returning JSX
  {
    name: 'get-jsx-functions',
    regex: /const (get\w*Icon|get\w*Badge|get\w*Button|render\w+) = \(([^)]*)\) => \{/g,
    replacement: 'const $1 = ($2): JSX.Element => {',
    skip: (match) => match.includes(': JSX.Element') || match.includes(': React.ReactNode')
  },
  // Is/has functions returning boolean
  {
    name: 'is-boolean-functions',
    regex: /const (is\w+|has\w+|can\w+|should\w+|check\w+) = \(([^)]*)\) => \{/g,
    replacement: 'const $1 = ($2): boolean => {',
    skip: (match) => match.includes(': boolean')
  },
  // Copy to clipboard handlers
  {
    name: 'copy-handlers',
    regex: /const (copy\w+|copyToClipboard) = \(([^)]*)\) => \{/g,
    replacement: 'const $1 = ($2): void => {',
    skip: (match) => match.includes(': void')
  },
  // Filter/sort functions
  {
    name: 'filter-sort-functions',
    regex: /const (filter\w+|sort\w+) = \(([^)]*)\) => \{/g,
    replacement: 'const $1 = ($2): void => {',
    skip: (match) => match.includes(': void') || match.includes(': boolean')
  }
];

function processFile(filePath) {
  let content = readFileSync(filePath, 'utf8');
  let originalContent = content;
  let fixCount = 0;

  for (const pattern of patterns) {
    const matches = content.match(pattern.regex);
    if (matches) {
      for (const match of matches) {
        if (!pattern.skip(match)) {
          const newContent = content.replace(pattern.regex, pattern.replacement);
          if (newContent !== content) {
            content = newContent;
            fixCount++;
          }
        }
      }
    }
  }

  if (content !== originalContent) {
    writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed ${fixCount} patterns in ${filePath}`);
    totalFixes += fixCount;
    filesFixed++;
  }
}

function walkDirectory(dir, extensions = ['.ts', '.tsx']) {
  const files = readdirSync(dir);
  
  for (const file of files) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and other non-source directories
      if (!['node_modules', 'dist', '.git', 'coverage'].includes(file)) {
        walkDirectory(filePath, extensions);
      }
    } else if (extensions.includes(extname(file))) {
      processFile(filePath);
    }
  }
}

console.log('🔧 Starting automated TypeScript error fixes...\n');

// Process client source files
console.log('📁 Processing client/src...');
walkDirectory(CLIENT_SRC);

// Process server files
console.log('\n📁 Processing server...');
walkDirectory(SERVER_DIR);

console.log(`\n✨ Complete! Fixed ${totalFixes} patterns across ${filesFixed} files.`);
