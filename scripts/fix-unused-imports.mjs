#!/usr/bin/env node
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

export function cleanImportsInSource(content, filePath) {
  const sf = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);

  const importDecls = [];
  ts.forEachChild(sf, (node) => {
    if (ts.isImportDeclaration(node)) {
      importDecls.push(node);
    }
  });

  if (importDecls.length === 0) return { content, removedCount: 0 };

  const idCounts = new Map();
  function countIdentifiers(node) {
    if (ts.isImportDeclaration(node)) return;
    if (ts.isIdentifier(node)) {
      idCounts.set(node.text, (idCounts.get(node.text) || 0) + 1);
    }
    ts.forEachChild(node, countIdentifiers);
  }
  ts.forEachChild(sf, countIdentifiers);

  const replacements = [];
  let totalRemoved = 0;

  for (const decl of importDecls) {
    const clause = decl.importClause;
    if (!clause) continue; // Skip side-effect imports like import './styles.css'

    const hasDefault = Boolean(clause.name);
    const defaultUsed = hasDefault && (idCounts.get(clause.name.text) || 0) > 0;

    let namedElements = [];
    let isNamespace = false;
    let namespaceUsed = false;
    const isTypeOnly = clause.isTypeOnly;

    if (clause.namedBindings) {
      if (ts.isNamedImports(clause.namedBindings)) {
        namedElements = clause.namedBindings.elements.map((el) => ({
          name: el.name.text,
          used: (idCounts.get(el.name.text) || 0) > 0,
          rawText: el.getText(sf),
        }));
      } else if (ts.isNamespaceImport(clause.namedBindings)) {
        isNamespace = true;
        namespaceUsed = (idCounts.get(clause.namedBindings.name.text) || 0) > 0;
      }
    }

    const anyNamedUsed = namedElements.some((e) => e.used);
    const anyUsed = defaultUsed || namespaceUsed || anyNamedUsed;

    const start = decl.getStart(sf);
    let end = decl.getEnd();

    if (content[end] === '\r' && content[end + 1] === '\n') {
      end += 2;
    } else if (content[end] === '\n') {
      end += 1;
    }

    if (!anyUsed) {
      const removedInThisDecl = (hasDefault ? 1 : 0) + (isNamespace ? 1 : 0) + namedElements.length;
      totalRemoved += removedInThisDecl;
      replacements.push({ start, end, text: '' });
    } else {
      const hasUnusedNamed = namedElements.some((e) => !e.used);
      const hasUnusedDefault = hasDefault && !defaultUsed;

      if (hasUnusedNamed || hasUnusedDefault) {
        const removedInThisDecl = (hasUnusedDefault ? 1 : 0) + namedElements.filter((e) => !e.used).length;
        totalRemoved += removedInThisDecl;

        const moduleSpecifier = decl.moduleSpecifier.getText(sf);
        const keptNamed = namedElements.filter((e) => e.used).map((e) => e.rawText);

        let newClause = '';
        if (isTypeOnly) {
          newClause += 'type ';
        }

        if (defaultUsed) {
          newClause += clause.name.text;
          if (keptNamed.length > 0) {
            newClause += ', ';
          }
        }

        if (keptNamed.length > 0) {
          if (keptNamed.length <= 4) {
            newClause += `{ ${keptNamed.join(', ')} }`;
          } else {
            newClause += `{\n  ${keptNamed.join(',\n  ')},\n}`;
          }
        }

        const newImportText = `import ${newClause} from ${moduleSpecifier};\n`;
        replacements.push({ start, end, text: newImportText });
      }
    }
  }

  if (replacements.length === 0) return { content, removedCount: 0 };

  replacements.sort((a, b) => b.start - a.start);
  let newContent = content;
  for (const r of replacements) {
    newContent = newContent.slice(0, r.start) + r.text + newContent.slice(r.end);
  }

  return { content: newContent, removedCount: totalRemoved };
}

function run() {
  const targetDirs = [
    path.join(repoRoot, 'src'),
    path.join(repoRoot, 'docs'),
  ];

  const files = targetDirs.flatMap((d) => getAllFiles(d));
  let modifiedFilesCount = 0;
  let totalImportsRemoved = 0;

  console.log(`\n🔍 Scanning ${files.length} files for unused imports...\n`);

  for (const file of files) {
    const original = fs.readFileSync(file, 'utf-8');
    const { content: cleaned, removedCount } = cleanImportsInSource(original, file);

    if (removedCount > 0 && cleaned !== original) {
      fs.writeFileSync(file, cleaned, 'utf-8');
      const relPath = path.relative(repoRoot, file).replace(/\\/g, '/');
      console.log(`  ✔ Cleaned ${relPath} (${removedCount} unused import${removedCount > 1 ? 's' : ''} removed)`);
      modifiedFilesCount++;
      totalImportsRemoved += removedCount;
    }
  }

  if (totalImportsRemoved > 0) {
    console.log(`\n✨ Successfully removed ${totalImportsRemoved} unused imports across ${modifiedFilesCount} files!\n`);
  } else {
    console.log(`\n✔ All imports are already clean! No changes needed.\n`);
  }
}

run();
