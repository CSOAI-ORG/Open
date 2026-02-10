#!/usr/bin/env node
/**
 * Fix Database Boolean Conversions
 * Converts true/false to 1/0 in database insert/update operations
 * 
 * The database schema uses tinyint (0/1) for boolean fields,
 * but TypeScript code often uses true/false which causes type errors.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const DIRS = ['./server', './client/src'];
let totalFixes = 0;
let filesFixed = 0;

// Boolean fields in database that need 1/0 instead of true/false
const booleanFields = [
  'isActive', 'isLocked', 'isPinned', 'isPublic', 'isRead', 'isArchived',
  'isVerified', 'isCompleted', 'isEnabled', 'isFeatured', 'isDefault',
  'hasAccess', 'canEdit', 'canDelete', 'canView', 'isAdmin', 'isMember',
  'emailVerified', 'phoneVerified', 'twoFactorEnabled', 'notificationsEnabled',
  'marketingEmails', 'productUpdates', 'weeklyDigest', 'optIn',
  'achievementsEnabled', 'streakRemindersEnabled', 'progressReportsEnabled',
  'expirationRemindersEnabled', 'isCorrect', 'passed', 'isSolution',
  'isAnonymous', 'requiresApproval', 'autoApprove', 'isProcessed',
  'isDeleted', 'isHidden', 'isVisible', 'isOpen', 'isClosed'
];

function processFile(filePath) {
  let content = readFileSync(filePath, 'utf8');
  let originalContent = content;
  let fixCount = 0;

  // Pattern 1: field: true -> field: 1 (in object literals for db operations)
  for (const field of booleanFields) {
    // Match field: true (with optional spaces)
    const truePattern = new RegExp(`(${field}):\\s*true(?![a-zA-Z])`, 'g');
    const falsePattern = new RegExp(`(${field}):\\s*false(?![a-zA-Z])`, 'g');
    
    const trueMatches = content.match(truePattern);
    const falseMatches = content.match(falsePattern);
    
    if (trueMatches) {
      content = content.replace(truePattern, '$1: 1');
      fixCount += trueMatches.length;
    }
    if (falseMatches) {
      content = content.replace(falsePattern, '$1: 0');
      fixCount += falseMatches.length;
    }
  }

  // Pattern 2: Fix eq(table.field, true) -> eq(table.field, 1)
  for (const field of booleanFields) {
    const eqTruePattern = new RegExp(`eq\\(([^,]+\\.${field}),\\s*true\\)`, 'g');
    const eqFalsePattern = new RegExp(`eq\\(([^,]+\\.${field}),\\s*false\\)`, 'g');
    
    const eqTrueMatches = content.match(eqTruePattern);
    const eqFalseMatches = content.match(eqFalsePattern);
    
    if (eqTrueMatches) {
      content = content.replace(eqTruePattern, 'eq($1, 1)');
      fixCount += eqTrueMatches.length;
    }
    if (eqFalseMatches) {
      content = content.replace(eqFalsePattern, 'eq($1, 0)');
      fixCount += eqFalseMatches.length;
    }
  }

  // Pattern 3: Fix set({ field: true }) -> set({ field: 1 })
  for (const field of booleanFields) {
    const setTruePattern = new RegExp(`\\.set\\(\\{([^}]*?)${field}:\\s*true([^}]*?)\\}\\)`, 'g');
    const setFalsePattern = new RegExp(`\\.set\\(\\{([^}]*?)${field}:\\s*false([^}]*?)\\}\\)`, 'g');
    
    if (content.match(setTruePattern)) {
      content = content.replace(setTruePattern, '.set({$1' + field + ': 1$2})');
      fixCount++;
    }
    if (content.match(setFalsePattern)) {
      content = content.replace(setFalsePattern, '.set({$1' + field + ': 0$2})');
      fixCount++;
    }
  }

  if (content !== originalContent) {
    writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed ${fixCount} boolean conversions in ${filePath}`);
    totalFixes += fixCount;
    filesFixed++;
  }
}

function walkDirectory(dir, extensions = ['.ts', '.tsx']) {
  try {
    const files = readdirSync(dir);
    
    for (const file of files) {
      const filePath = join(dir, file);
      const stat = statSync(filePath);
      
      if (stat.isDirectory()) {
        if (!['node_modules', 'dist', '.git', 'coverage', '_core'].includes(file)) {
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

console.log('🔧 Starting database boolean conversion fixes...\n');

for (const dir of DIRS) {
  console.log(`📁 Processing ${dir}...`);
  walkDirectory(dir);
}

console.log(`\n✨ Complete! Fixed ${totalFixes} boolean conversions across ${filesFixed} files.`);
