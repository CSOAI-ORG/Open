#!/usr/bin/env node
/**
 * Fix JSX.Element namespace errors
 * Replace JSX.Element with React.ReactNode which is properly typed
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const CLIENT_SRC = './client/src';
let totalFixes = 0;
let filesFixed = 0;

function processFile(filePath) {
  let content = readFileSync(filePath, 'utf8');
  let originalContent = content;
  let fixCount = 0;

  // Replace JSX.Element with React.ReactNode
  const jsxElementPattern = /: JSX\.Element/g;
  const matches = content.match(jsxElementPattern);
  
  if (matches) {
    content = content.replace(jsxElementPattern, ': React.ReactNode');
    fixCount += matches.length;
    
    // Add React import if not present
    if (!content.includes('import React') && !content.includes('import * as React')) {
      // Check if there's already a react import
      if (content.includes("from 'react'") || content.includes('from "react"')) {
        // Add React to existing import
        content = content.replace(
          /import \{([^}]+)\} from ['"]react['"]/,
          "import React, {$1} from 'react'"
        );
      } else {
        // Add new React import at the top
        content = "import React from 'react';\n" + content;
      }
    }
  }

  if (content !== originalContent) {
    writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed ${fixCount} JSX.Element in ${filePath}`);
    totalFixes += fixCount;
    filesFixed++;
  }
}

function walkDirectory(dir, extensions = ['.tsx']) {
  try {
    const files = readdirSync(dir);
    
    for (const file of files) {
      const filePath = join(dir, file);
      const stat = statSync(filePath);
      
      if (stat.isDirectory()) {
        if (!['node_modules', 'dist', '.git', 'coverage'].includes(file)) {
          walkDirectory(filePath, extensions);
        }
      } else if (extensions.includes(extname(file))) {
        processFile(filePath);
      }
    }
  } catch (e) {
    // Directory doesn't exist, skip
  }
}

console.log('🔧 Starting JSX.Element to React.ReactNode fixes...\n');
walkDirectory(CLIENT_SRC);
console.log(`\n✨ Complete! Fixed ${totalFixes} JSX.Element references across ${filesFixed} files.`);
