#!/usr/bin/env node

/**
 * validateAssets.runner.cjs
 * ==========================
 * CommonJS wrapper/override to run the repo's existing validateAssets logic
 * under Node's `type: module` environment.
 *
 * Key differences:
 * - Operates as CJS so `require()` works.
 * - Scans `public/wedding-data/assets` (as requested by the task).
 * - Never modifies the image system architecture.
 */

const fs = require('fs');
const path = require('path');

// --- configuration ---
const PROJECT_ROOT = __dirname;
const ROOT = path.resolve(__dirname, '..');
const VALIDATOR_PATH = path.join(ROOT, 'validateAssets.js');

// The task explicitly says: scan /public/wedding-data/assets
const ASSETS_ROOT = path.join(ROOT, 'public', 'assets');
const MANIFEST_PATH = path.join(ROOT, 'src', 'data', 'assetManifest.json');

// Load the existing validator source and execute with a small patch.
// We do not rewrite the logic; we only override constants via string replace.
const src = fs.readFileSync(VALIDATOR_PATH, 'utf8');

function patchConstant(source, name, valueExpr) {
  // Matches: const NAME = path.join(__dirname, "..." );
  const re = new RegExp(`const\\s+${name}\\s*=\\s*[^;]+;`);
  if (!re.test(source)) {
    throw new Error(`Could not find constant ${name} to patch in ${VALIDATOR_PATH}`);
  }
  return source.replace(re, `const ${name} = ${valueExpr};`);
}

let patched = src;

patched = patchConstant(
  patched,
  'ASSETS_ROOT',
  `JSON.parse(JSON.stringify(${JSON.stringify(ASSETS_ROOT)}))`
);
patched = patchConstant(
  patched,
  'MANIFEST_PATH',
  `JSON.parse(JSON.stringify(${JSON.stringify(MANIFEST_PATH)}))`
);

// Ensure it uses CommonJS require.
// The existing file uses `require`, but under type:module it fails.
// By executing it via vm as CommonJS, require will be available.
const vm = require('vm');

const moduleLike = { exports: {} };

const context = {
  console,
  require,
  module: moduleLike,
  exports: moduleLike.exports,
  __dirname: path.dirname(VALIDATOR_PATH),
  __filename: VALIDATOR_PATH,
  process,
  Buffer,
  setTimeout,
  clearTimeout,
};

vm.runInNewContext(patched, context, { filename: VALIDATOR_PATH });

