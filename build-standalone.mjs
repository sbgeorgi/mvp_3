import { readFile, writeFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build as bundle } from 'esbuild';
import { build as viteBuild } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';
import generateModule from '@babel/generator';
import * as types from '@babel/types';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const root = path.dirname(fileURLToPath(import.meta.url));
const traverse = traverseModule.default;
const generate = generateModule.default;
const temporaryModule = path.join(root, '.standalone-render.mjs');
const assetBase = 'mvp_3/public/';

// Export actual HTML from the original components, without a React runtime.
const motionShim = `
import React from 'react';
const value = v => v && typeof v.get === 'function' ? v.get() : v;
export const motion = new Proxy({}, { get(_, tag) {
  return function StaticMotion(props) {
    const { initial, animate, whileInView, whileHover, whileTap, exit, transition, viewport,
      layoutId, layout, style, children, ...attributes } = props;
    const css = {};
    for (const [key, val] of Object.entries(style || {})) {
      if (!['x', 'y', 'scale', 'rotate', 'transformPerspective'].includes(key)) css[key] = value(val);
    }
    if (attributes['data-hero-image'] !== undefined) css.opacity = animate.opacity;
    if (whileInView) attributes['data-reveal'] = '';
    return React.createElement(tag, { ...attributes, style: css }, children);
  };
}});
export const AnimatePresence = ({ children }) => children;
export const MotionConfig = ({ children }) => children;
export const useReducedMotion = () => false;
const mv = v => ({ get: () => v, set: () => {} });
export const useMotionValue = mv;
export const useSpring = v => v;
export const useVelocity = () => mv(0);
export const useScroll = () => ({ scrollYProgress: mv(0), scrollY: mv(0) });
export const useInView = () => true;
export const useAnimationFrame = () => {};
export const useMotionValueEvent = () => {};
export const wrap = (min, max, v) => ((v - min) % (max - min) + (max - min)) % (max - min) + min;
export function useTransform(v, input, output) {
  if (typeof input === 'function') return mv(input(value(v)));
  const n = value(v);
  let i = 0;
  while (i < input.length - 2 && n > input[i + 1]) i++;
  const progress = Math.max(0, Math.min(1, (n - input[i]) / (input[i + 1] - input[i])));
  const a = output[i], b = output[i + 1];
  return mv(typeof a === 'number' ? a + (b - a) * progress : a);
}
`;

const result = await bundle({
  absWorkingDir: root, entryPoints: ['src/App.tsx'], bundle: true,
  platform: 'node', format: 'esm', write: false, packages: 'external', jsx: 'automatic',
  plugins: [{
    name: 'export-readable-markup',
    setup(build) {
      build.onResolve({ filter: /^motion\/react$/ }, () => ({ path: 'motion', namespace: 'static' }));
      build.onLoad({ filter: /.*/, namespace: 'static' }, () => ({ contents: motionShim, loader: 'js', resolveDir: root }));
      build.onLoad({ filter: /\.(tsx|ts)$/ }, async ({ path: filename }) => {
        let source = await readFile(filename, 'utf8');
        source = source.replace(/import\s+["'][^"']+\.css["'];?/g, '');
        source = source.replaceAll('import.meta.env.BASE_URL', JSON.stringify(assetBase));
        if (filename.endsWith('App.tsx')) source = source.replace('useState(false)', 'useState(true)');
        // The companion starts playback after checking reduced motion.
        if (filename.endsWith('Hero.tsx')) source = source.replace('autoPlay={reduced === false}', 'autoPlay={false}');
        if (filename.endsWith('i18n.tsx')) source = source.replace('if (typeof window === "undefined") return "en";', 'if (typeof window === "undefined") return (globalThis as any).__STATIC_LANG || "en";');
        if (filename.endsWith('Header.tsx')) source = source.replace('{open && <motion.div', '{true && <motion.div').replace('id="mobile-menu"', 'hidden data-mobile-menu="" id="mobile-menu"');
        if (filename.endsWith('Visit.tsx')) source = source.replace('{open === i && (', '{true && (').replace('initial={{ height: 0, opacity: 0 }}', 'hidden={open !== i} data-faq-answer="" initial={{ height: 0, opacity: 0 }}');
        if (filename.endsWith('GymMap.tsx')) {
          source = source.replace(/import \{ map as createMap[^;]+;/, '');
          source = source.replace(/useEffect\(\(\) => \{[\s\S]*?\}, \[\]\);/, '');
        }
        if (filename.endsWith('.tsx')) {
          const ast = parse(source, { sourceType: 'module', plugins: ['typescript', 'jsx'] });
          traverse(ast, { JSXAttribute(nodePath) {
            const attribute = nodePath.node;
            if (attribute.name.name !== 'onClick') return;
            const fn = attribute.value?.expression;
            if (!types.isArrowFunctionExpression(fn) || !types.isCallExpression(fn.body)) return;
            const call = fn.body;
            let name, expression;
            if (['go', 'scrollToId'].includes(call.callee.name)) { name = 'data-scroll-to'; expression = call.arguments[0]; }
            if (call.callee.name === 'setLang') { name = 'data-language'; expression = call.arguments[0]; }
            if (call.callee.name === 'setI') { name = 'data-slide'; expression = call.arguments[0]; }
            if (call.callee.name === 'setOpen') {
              if (types.isArrowFunctionExpression(call.arguments[0])) { name = 'data-menu-toggle'; expression = types.stringLiteral(''); }
              else { name = 'data-faq-index'; expression = types.identifier('i'); }
            }
            if (name) nodePath.replaceWith(types.jsxAttribute(types.jsxIdentifier(name), types.jsxExpressionContainer(expression)));
          }});
          source = generate(ast).code;
        }
        return { contents: source, loader: filename.endsWith('.tsx') ? 'tsx' : 'ts' };
      });
      build.onLoad({ filter: /\.css$/ }, () => ({ contents: '', loader: 'js' }));
    },
  }],
});
await writeFile(temporaryModule, result.outputFiles[0].text);
let english, spanish;
try {
  const { default: App } = await import(pathToFileURL(temporaryModule));
  globalThis.__STATIC_LANG = 'en';
  english = renderToStaticMarkup(React.createElement(App));
  globalThis.__STATIC_LANG = 'es';
  spanish = renderToStaticMarkup(React.createElement(App));
} finally {
  delete globalThis.__STATIC_LANG;
  await unlink(temporaryModule);
}

// Keep the original CSS utilities, formatted and fully local.
const cssResult = await viteBuild({
  root, configFile: false, plugins: [tailwindcss()],
  build: { write: false, copyPublicDir: false, cssMinify: false,
    rollupOptions: { input: path.join(root, 'src/index.css') } },
});
const css = cssResult.output.find(item => item.fileName.endsWith('.css')).source;
const mapCss = await readFile(path.join(root, 'src/components/GymMap.css'), 'utf8');
const leafletCss = (await readFile(path.join(root, 'node_modules/leaflet/dist/leaflet.css'), 'utf8'))
  .replaceAll('url(images/', 'url(mvp_3/node_modules/leaflet/dist/images/');
const libraries = await bundle({
  absWorkingDir: root,
  stdin: { contents: 'export { default as Lenis } from "lenis"; export * as Leaflet from "leaflet"; export { getHoursState, formatHoursStatus } from "./src/openingHours.ts"; export { bindReviewsCarousel } from "./src/reviewsCarousel.ts";', resolveDir: root },
  bundle: true, write: false, minify: false, format: 'iife', globalName: 'SiteTools',
});
const client = await readFile(path.join(root, 'standalone-client.js'), 'utf8');

function formatMarkup(markup) {
  markup = markup.replace(/<link[^>]*rel="preload"[^>]*>/g, '');
  const tokens = markup.match(/<!--[\s\S]*?-->|<(?:(?:"[^"]*")|(?:'[^']*')|[^'">])*>|[^<]+/g) || [];
  const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
  let depth = 2;
  const lines = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (/^<\//.test(token)) depth--;
    const indent = '  '.repeat(Math.max(0, depth));
    const section = token.match(/^<section id="([^"]+)"/);
    if (section) lines.push('', `${indent}<!-- ${section[1].toUpperCase()} -->`);
    const tag = token.match(/^<([\w-]+)/)?.[1];
    const opens = tag && !voidTags.has(tag) && !token.endsWith('/>');
    if (opens && tokens[i + 1] === `</${tag}>`) {
      lines.push(indent + token + tokens[++i]);
    } else if (opens && tokens[i + 1]?.[0] !== '<' && tokens[i + 2] === `</${tag}>`) {
      lines.push(indent + token + tokens[++i] + tokens[++i]);
    } else {
      lines.push(indent + token);
      if (opens) depth++;
    }
  }
  return lines.join('\n');
}

const originalHead = (await readFile(path.join(root, 'index.html'), 'utf8')).match(/<head>([\s\S]*?)<\/head>/)[1];
const html = `<!doctype html>
<!-- Adrian's Gym MVP 3. Readable HTML export. Media uses existing local paths. -->
<html lang="en">
<head>${originalHead}
  <style id="site-styles">
${css}
${leafletCss}
${mapCss}
${await readFile(path.join(root, 'standalone.css'), 'utf8')}
  </style>
</head>
<body>
  <!-- PAGE CONTENT: edit the English headings, copy, links and image paths here. -->
  <div id="site">
${formatMarkup(english)}
  </div>

  <!-- Spanish version used by the EN / ES language switch. -->
  <template id="site-es">
${formatMarkup(spanish)}
  </template>

  <!-- Bundled Leaflet library. No React or build tool is required to open this file. -->
  <script id="site-libraries">
${libraries.outputFiles[0].text.replaceAll('</script', '<\\/script')}
  </script>

  <!-- SITE BEHAVIOR: navigation, language switch, native FAQ, video controls, and map. -->
  <script id="site-behavior">
${client}
  </script>
</body>
</html>
`;
await writeFile(path.resolve(root, '../index1.html'), html);
console.log(`Created readable index1.html: ${(Buffer.byteLength(html) / 1024).toFixed(0)} KiB, ${html.split('\n').length} lines. Media paths: ${assetBase}`);
