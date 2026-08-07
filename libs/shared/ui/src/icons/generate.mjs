import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from '@svgr/core';
import jsxPlugin from '@svgr/plugin-jsx';
import template from './svgr-template.cjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, 'assets');
const outputDir = path.join(__dirname, 'generated');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(assetsDir).filter((f) => f.endsWith('.svg'));

function toPascalCase(str) {
  return str
    .replace(/(^\w|-\w)/g, (m) => m.replace('-', '').toUpperCase());
}

for (const file of files) {
  const name = path.basename(file, '.svg');
  const componentName = toPascalCase(name);
  const svgCode = fs.readFileSync(path.join(assetsDir, file), 'utf8');

  const jsCode = await transform(
    svgCode,
    {
      native: true,
      typescript: true,
      dimensions: false,
      plugins: [jsxPlugin],
      template,
    },
    { componentName }
  );

  let cleanedCode = jsCode;
  if (name === 'brand-mark') {
    cleanedCode = cleanedCode.replace('<Svg ', '<Svg width={size} height={size} accessibilityLabel="FitnessGoal" ');
  } else {
    cleanedCode = cleanedCode
      .replace('<Svg ', '<Svg width={size} height={size} accessibilityElementsHidden ')
      .replace(/stroke="currentColor"/g, 'stroke={color}')
      .replace(/strokeWidth=\{1\.5\}/g, 'strokeWidth={strokeWidth}')
      .replace(/strokeWidth=\{1\.8\}/g, 'strokeWidth={strokeWidth}');
  }

  fs.writeFileSync(path.join(outputDir, `${name}.tsx`), cleanedCode);
}

console.log(`Generated ${files.length} icon components in ${outputDir}`);
