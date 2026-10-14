#!/usr/bin/env node
/**
 * Unused Import Detector for Hesh UI
 *
 * Scans all TypeScript / TSX source files in `src/` and `docs/` using the
 * TypeScript compiler AST. Flags any imported identifier (default, named, or namespace)
 * that is not referenced in the file.
 *
 * Exit code 0: Clean, all imports are used.
 * Exit code 1: Unused imports detected with file, line, and identifier names.
 */

import ts from 'typescript';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

function getAllFiles(dir, exts = ['.ts', '.tsx']) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist' && file !== '.git') {
        results = results.concat(getAllFiles(fullPath, exts));
      }
    } else if (exts.includes(path.extname(file))) {
      results.push(fullPath);
    }
  }
  return results;
}

const targetDirs = [
  path.join(repoRoot, 'src'),
  path.join(repoRoot, 'docs'),
];

const files = targetDirs.flatMap((d) => getAllFiles(d));
const unusedList = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  const sf = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true);

  const imports = [];
  ts.forEachChild(sf, (node) => {
    if (ts.isImportDeclaration(node)) {
      const clause = node.importClause;
      if (!clause) return;

      // Ignore side-effect imports like import './styles.css';
      if (clause.name) {
        imports.push({ name: clause.name.text, pos: clause.name.getStart(sf) });
      }

      if (clause.namedBindings) {
        if (ts.isNamedImports(clause.namedBindings)) {
          clause.namedBindings.elements.forEach((el) => {
            imports.push({ name: el.name.text, pos: el.name.getStart(sf) });
          });
        } else if (ts.isNamespaceImport(clause.namedBindings)) {
          imports.push({ name: clause.namedBindings.name.text, pos: clause.namedBindings.name.getStart(sf) });
        }
      }
    }
  });

  for (const imp of imports) {
    let count = 0;
    function visit(node) {
      if (ts.isImportDeclaration(node)) return;
      if (ts.isIdentifier(node) && node.text === imp.name) {
        count++;
      }
      ts.forEachChild(node, visit);
    }
    ts.forEachChild(sf, visit);

    if (count === 0) {
      const { line, character } = sf.getLineAndCharacterOfPosition(imp.pos);
      unusedList.push({
        file: path.relative(repoRoot, file).replace(/\\/g, '/'),
        line: line + 1,
        col: character + 1,
        name: imp.name,
      });
    }
  }
}

if (unusedList.length > 0) {
  console.error('\n❌ Unused import statements detected:\n');
  for (const u of unusedList) {
    console.error(`  ${u.file}:${u.line}:${u.col} — unused import '${u.name}'`);
  }
  console.error(`\nFound ${unusedList.length} unused import(s). Please remove them before pushing to remote.\n`);
  process.exit(1);
} else {
  console.log(`\n✔ Checked ${files.length} files: 0 unused imports detected. 100% clean!\n`);
  process.exit(0);
}
