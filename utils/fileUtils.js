const fs = require('fs/promises');
const path = require('path');

async function listFiles(dir, extensions, result = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await listFiles(fullPath, extensions, result);
    } else if (extensions.length === 0 || extensions.includes(path.extname(entry.name))) {
      result.push(fullPath);
    }
  }
  return result;
}

async function generateSummaryFromFiles(rootDir, files, output) {
  let summary = '';
  for (const relPath of files) {
    const file = path.join(rootDir, relPath);
    const content = await fs.readFile(file, 'utf8');
    summary += `## File: ${relPath}\n`;
    summary += '```\n';
    summary += content;
    summary += '\n```\n\n';
  }
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, summary);
  return summary;
}

async function generateSummary(productDir, customizerDir, extensions, output, selectedFiles = []) {
  let files;
  if (selectedFiles.length > 0) {
    files = selectedFiles;
  } else {
    const all = await listFiles(customizerDir, extensions);
    files = all.map(f => path.relative(customizerDir, f));
  }
  return generateSummaryFromFiles(customizerDir, files, output);
}

module.exports = { generateSummary, listFiles };
