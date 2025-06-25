# Project Title: Electron-Based Code Diff Parser for LLM Integration

## Overview

This project is a cross-platform desktop application built with Electron, designed to help developers generate structured input files from selected codebases. The goal is to extract relevant code portions from two source folders (typically a core product and a customizer layer) and summarize them in a format suitable for submission to a Large Language Model (LLM) for code analysis or transformation.

---

## Features

- Select two root folders: one for the base Product codebase, one for the Customizer.
- Filter and select files by extension (e.g., C#, JavaScript, SQL).
- Export selected files into a single summary document.
- Generate a unified input file in Markdown or plain text format.
- Designed to create LLM-ready prompts for code understanding or code generation tasks.

---

## Tech Stack

- **Frontend**: Electron + React
- **Backend**: Node.js
- **Utilities**:
  - `fs/promises` for file handling
  - `path` for filesystem structure
  - `diff-match-patch` (optional, if needed to show minor differences)

---

## Folder Structure

```
code-diff-assistant/
├── main/                  # Electron main process
├── renderer/              # Frontend (React)
├── extractors/            # Language-agnostic code file processors
├── utils/                 # Helper functions (file IO, filters, etc.)
├── output/                # Exported LLM input files
├── preload.js             # Context bridge
├── main.js                # Electron app entry
├── package.json
```

---

## Step-by-Step Setup Guide

### 1. Prerequisites

- Node.js >= 18
- npm or yarn

### 2. Initialize the App

```bash
npx create-electron-app code-diff-assistant --template=webpack
cd code-diff-assistant
```

### 3. Install Required Dependencies

```bash
npm install diff-match-patch react-router-dom
```

### 4. Update Electron Preload Context Bridge

In `preload.js`, expose APIs to:

- Select folders
- Read and filter files
- Export results

### 5. Implement File Selection in Renderer

Use Electron's `dialog.showOpenDialog()` to select `Product` and `Customizer` root folders.

### 6. File Discovery and Filtering

Recursively list all files and filter by extensions:

- `.cs`, `.js`, `.ts`, `.sql`

Map them into:

```ts
Map<string, string> productFiles;
Map<string, string> customizerFiles;
```

### 7. File Extraction

For each selected file:

- Read the file content
- Optionally extract specific regions (e.g., functions, classes, queries)
- Append to the summary string using the following format:

````md
## File: /relative/path/to/file.js
```js
// file contents here
````

````

### 8. Exporting the Summary
Allow the user to export the assembled text as `.md` or `.txt` in the `/output` directory.

### 9. LLM Input
The exported file can be manually copied or sent into an LLM prompt for analysis.
You may include an optional section at the top like:
```md
### Instructions
These are selected files from Customizer that may override or extend the Product codebase.
Please analyze and generate matching updates for Product files.
````

---

## Usage

1. Launch the app:

```bash
npm start
```

2. Choose Product and Customizer folders.
3. Click "Generate LLM Input".
4. Review and export the result.

---

## Future Enhancements

- Allow manual section highlighting before export
- Add LLM prompt templates
- Add auto-chunking for large files

---

## Example Prompt to LLM

```
System: You are a senior software engineer.
User: Based on the selected files below from the Customizer, generate equivalent or updated files for the Product project.
```


### MVP Quick Start
Run `npm install` then `npm start` to launch the Electron app.

