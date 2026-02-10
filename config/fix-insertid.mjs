#!/usr/bin/env node
/**
 * Fix insertId issues in test files
 * Replace patterns like:
 *   Number(result.insertId) -> result[0]?.id || 0
 *   Number((result as any).insertId) -> result[0]?.id || 0
 *   result.insertId -> result[0]?.id
 * 
 * Also fix patterns where insert doesn't use $returningId()
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

  // Pattern 1: Number((result as any).insertId) or Number((result as any)[0]?.insertId ?? (result as any).insertId)
  const pattern1 = /Number\(\((\w+) as any\)(?:\[0\]\?\.insertId \?\? \(\1 as any\))?\.insertId\)/g;
  if (pattern1.test(content)) {
    content = content.replace(pattern1, '$1[0]?.id || 0');
    fixCount++;
  }

  // Pattern 2: Number(result[0].insertId) or Number(result[0]?.insertId)
  const pattern2 = /Number\((\w+)\[0\]\??\.insertId\)/g;
  if (pattern2.test(content)) {
    content = content.replace(pattern2, '$1[0]?.id || 0');
    fixCount++;
  }

  // Pattern 3: result.insertId (standalone)
  const pattern3 = /(\w+)\.insertId(?!\s*\?\?)/g;
  if (pattern3.test(content)) {
    content = content.replace(pattern3, '$1[0]?.id');
    fixCount++;
  }

  // Pattern 4: (result as any)[0]?.insertId ?? (result as any).insertId
  const pattern4 = /\((\w+) as any\)\[0\]\?\.insertId \?\? \(\1 as any\)\.insertId/g;
  if (pattern4.test(content)) {
    content = content.replace(pattern4, '$1[0]?.id || 0');
    fixCount++;
  }

  if (content !== originalContent) {
    writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed insertId patterns in ${filePath}`);
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

console.log('🔧 Fixing insertId patterns in test files...\n');
walkDirectory(SERVER_DIR);
console.log(`\n✨ Complete! Fixed ${totalFixes} patterns across ${filesFixed} files.`);
