const productBtn = document.getElementById('product-btn');
const customizerBtn = document.getElementById('customizer-btn');
const generateBtn = document.getElementById('generate');
const productPathSpan = document.getElementById('product-path');
const customizerPathSpan = document.getElementById('customizer-path');
const statusDiv = document.getElementById('status');
const summaryPre = document.getElementById('summary');

let productDir = null;
let customizerDir = null;

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

generateBtn.addEventListener('click', async () => {
  if (!productDir || !customizerDir) {
    statusDiv.textContent = 'Select both folders first.';
    return;
  }
  const extensions = document.getElementById('extensions').value.split(',').map(e => e.trim()).filter(Boolean);
  const output = 'output/summary.md';
  statusDiv.textContent = 'Generating...';
  const summary = await window.api.generateSummary({ productDir, customizerDir, extensions, output });
  statusDiv.textContent = 'Saved to ' + output;
  summaryPre.textContent = summary;
});
