const productBtn = document.getElementById('product-btn');
const customizerBtn = document.getElementById('customizer-btn');
const generateBtn = document.getElementById('generate');
const loadFilesBtn = document.getElementById('load-files');
const fileTreeDiv = document.getElementById('file-tree');
const productPathSpan = document.getElementById('product-path');
const customizerPathSpan = document.getElementById('customizer-path');
const statusDiv = document.getElementById('status');
const summaryPre = document.getElementById('summary');

let productDir = null;
let customizerDir = null;
let fileList = [];

function buildTree(paths) {
  const root = {};
  for (const p of paths) {
    const parts = p.split(/[/\\]/);
    let current = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = { children: {}, path: parts.slice(0, i + 1).join('/') };
      }
      current = current[part].children;
    }
  }
  return root;
}

function renderTree(node) {
  const ul = document.createElement('ul');
  for (const [name, info] of Object.entries(node)) {
    const li = document.createElement('li');
    if (Object.keys(info.children).length === 0) {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = info.path;
      checkbox.checked = true;
      li.appendChild(checkbox);
      li.append(' ' + name);
    } else {
      li.textContent = name;
      li.appendChild(renderTree(info.children));
    }
    ul.appendChild(li);
  }
  return ul;
}

productBtn.addEventListener('click', async () => {
  const result = await window.api.selectFolder();
  if (result) {
    productDir = result;
    productPathSpan.textContent = result;
  }
});

customizerBtn.addEventListener('click', async () => {
  const result = await window.api.selectFolder();
  if (result) {
    customizerDir = result;
    customizerPathSpan.textContent = result;
  }
});

loadFilesBtn.addEventListener('click', async () => {
  if (!customizerDir) {
    statusDiv.textContent = 'Select folders first.';
    return;
  }
  const extensions = document.getElementById('extensions').value.split(',').map(e => e.trim()).filter(Boolean);
  fileList = await window.api.listFiles({ dir: customizerDir, extensions });
  const tree = buildTree(fileList);
  fileTreeDiv.innerHTML = '';
  fileTreeDiv.appendChild(renderTree(tree));
});

generateBtn.addEventListener('click', async () => {
  if (!productDir || !customizerDir) {
    statusDiv.textContent = 'Select both folders first.';
    return;
  }
  const extensions = document.getElementById('extensions').value.split(',').map(e => e.trim()).filter(Boolean);
  const output = 'output/summary.md';
  statusDiv.textContent = 'Generating...';
  const selected = Array.from(fileTreeDiv.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
  const summary = await window.api.generateSummary({ productDir, customizerDir, extensions, output, selectedFiles: selected });
  statusDiv.textContent = 'Saved to ' + output;
  summaryPre.textContent = summary;
});
