/**
 * Builds the static brand-guidelines site into site/.
 *
 * Sources:
 *   src/Brand.src.html          brand guidelines (logo, color, type, foundations, UI)
 *   src/Presentations.src.html  slide system
 *   src/Social.src.html         LinkedIn
 *   assets/**                   anything dropped here becomes a download
 *
 * The same three source files also feed the Claude Design canvas, so they keep
 * the canvas markup (<x-dc>, <helmet>, {{ holes }}); this script strips it.
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, copyFileSync, rmSync } from 'node:fs';
import { join, relative, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { zipDirectory } from './zip.mjs';
import { brandMarkdown } from './brand-md.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT = join(ROOT, 'site');

const read = (p) => readFileSync(join(ROOT, p), 'utf8');

/* ------------------------------------------------------------------ helpers */

const between = (src, start, end) => {
  const a = src.indexOf(start);
  if (a < 0) throw new Error('start not found: ' + start);
  const b = src.indexOf(end, a + start.length);
  if (b < 0) throw new Error('end not found: ' + end);
  return src.slice(a + start.length, b);
};

const guideCss = (src) => src.slice(src.indexOf('/* @guide-css */') + 16, src.indexOf('</style>'));

/** Prefix every selector so a guide's styles cannot leak into another guide. */
const scope = (css, prefix) =>
  css.replace(/\/\*[\s\S]*?\*\//g, '')
     .replace(/([^{}]+)\{([^{}]*)\}/g, (_m, sel, body) => {
       const s = sel.split(',').map((x) => x.trim()).filter(Boolean)
         .map((x) => `${prefix} ${x}`).join(', ');
       return `    ${s} { ${body.trim().replace(/\s+/g, ' ')} }\n`;
     });

const navOf = (src) => between(src, '<nav class="menu">', '</nav>');

const contentOf = (src) => {
  const a = src.indexOf('<main class="content"');
  const open = src.indexOf('>', a) + 1;
  return src.slice(open, src.indexOf('\n  </main>', open));
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const bytes = (n) => {
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return (n / 1024).toFixed(n < 10240 ? 1 : 0) + ' KB';
  return (n / 1048576).toFixed(1) + ' MB';
};

/* -------------------------------------------------------------------- icons */

const I = {
  copy: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"/></svg>',
  download: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,124.69V32a8,8,0,0,0-16,0v92.69L93.66,98.34a8,8,0,0,0-11.32,11.32Z"/></svg>',
  check: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"/></svg>',
  caret: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z"/></svg>',
  brand: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M208,40H48A24,24,0,0,0,24,64V176a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V64A24,24,0,0,0,208,40Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V64a8,8,0,0,1,8-8H208a8,8,0,0,1,8,8Zm-48,48a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,224Z"/></svg>',
  presentations: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176ZM104,120v24a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32-16v40a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32-16v56a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z"/></svg>',
  social: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M176,160a39.89,39.89,0,0,0-28.62,12.09l-46.1-29.63a39.8,39.8,0,0,0,0-28.92l46.1-29.63a40,40,0,1,0-8.66-13.45l-46.1,29.63a40,40,0,1,0,0,55.82l46.1,29.63A40,40,0,1,0,176,160Zm0-128a24,24,0,1,1-24,24A24,24,0,0,1,176,32ZM64,152a24,24,0,1,1,24-24A24,24,0,0,1,64,152Zm112,72a24,24,0,1,1,24-24A24,24,0,0,1,176,224Z"/></svg>',
  downloads: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M216,88H168V40a16,16,0,0,0-16-16H40A16,16,0,0,0,24,40V168a16,16,0,0,0,16,16H88v32a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V104A16,16,0,0,0,216,88ZM40,168V40H152V88H104a16,16,0,0,0-16,16v64Zm176,48H104V104H216V216Z"/></svg>',
  file: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z"/></svg>',
};

const GUIDES = [
  { id: 'brand', name: 'Brand guidelines' },
  { id: 'presentations', name: 'Presentations' },
  { id: 'social', name: 'Social media' },
  { id: 'downloads', name: 'Downloads' },
];

/* ------------------------------------------------------------ asset library */

const walk = (dir, base = dir) => {
  let out = [];
  for (const name of readdirSync(dir).sort()) {
    if (name.startsWith('.') || name.toLowerCase() === 'readme.md') continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) out = out.concat(walk(full, base));
    else out.push({ rel: relative(base, full), size: st.size });
  }
  return out;
};

const assets = walk(join(ROOT, 'assets'));

/* The icon set ships as one archive: 6,000 loose SVGs is not a download, it is a
   chore. Built here so dropping icons into icons/ is all it takes to update it. */
const iconPack = zipDirectory(join(ROOT, 'icons'), { mtime: new Date('2026-01-01T12:00:00Z') });
const ICON_ZIP = 'icons/exatom-icons.zip';
assets.push({ rel: ICON_ZIP, size: iconPack.buffer.length });

const groups = new Map();
for (const a of assets) {
  const parts = a.rel.split('/');
  const group = parts.length > 1 ? parts[0] : 'Loose files';
  if (!groups.has(group)) groups.set(group, []);
  groups.get(group).push(a);
}

const TITLE = { logo: 'Logo', icons: 'Icons', fonts: 'Fonts', decks: 'Deck templates', social: 'Social templates', print: 'Print' };
const label = (g) => TITLE[g] || g.charAt(0).toUpperCase() + g.slice(1).replace(/[-_]/g, ' ');

const assetRow = (a) => {
  const href = 'assets/' + a.rel.split('/').map(encodeURIComponent).join('/');
  return `            <li class="asset-row">
              <span class="asset-icon">${I.file}</span>
              <span class="asset-name">${esc(basename(a.rel))}</span>
              <span class="asset-type">${esc(extname(a.rel).replace('.', '').toUpperCase() || 'file')}</span>
              <span class="asset-size">${bytes(a.size)}</span>
              <a class="asset-get" href="${href}" download>${I.download}<span>Download</span></a>
            </li>`;
};

const downloadsPane = `
      <header class="masthead">
        <p class="eyebrow">Exatom</p>
        <h1 class="display">Downloads</h1>
        <p class="lede">Every brand file in one place. ${assets.length} file${assets.length === 1 ? '' : 's'}, served straight from the repository — what you download here is the source of truth, not a copy someone re-exported.</p>
      </header>
${[...groups.entries()].map(([g, list], i) => `
      <section class="section" id="dl-${g.replace(/[^a-z0-9]/gi, '-').toLowerCase()}"${i === 0 ? ' style="padding-top: 0"' : ''}>
        <div class="section-head">
          <span class="section-icon">${I.downloads}</span>
          <h2 class="section-title">${esc(label(g))}</h2>
        </div>
        <ul class="asset-list">
${list.map(assetRow).join('\n')}
        </ul>
      </section>`).join('\n')}
${assets.length === 0 ? `
      <section class="section" style="padding-top: 0">
        <div class="awaiting">
          <p class="awaiting-tag"><span></span>EMPTY</p>
          <h4>No files yet</h4>
          <ul><li>Drop files into <code>assets/</code> in the repository. They appear here on the next deploy.</li></ul>
        </div>
      </section>` : ''}
`;

const downloadsNav = [...groups.keys()].map((g) => {
  const id = 'dl-' + g.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  return `          <button type="button" class="menu-item" data-scroll="${id}">${I.downloads}<span>${esc(label(g))}</span></button>`;
}).join('\n');

/* --------------------------------------------------------------- the guides */

const brandSrc = read('src/Brand.src.html');
const presSrc = read('src/Presentations.src.html');
const socSrc = read('src/Social.src.html');

/**
 * One stray </div> closes <main> early and the browser reparents everything
 * after it outside the flex row — the content jumps to full width and slides
 * out from under the sidebar. It is invisible in the source and obvious on the
 * page, so the build refuses to ship it.
 */
const assertBalanced = (name, src) => {
  const a = src.indexOf('<main class="content"');
  const body = src.slice(src.indexOf('>', a) + 1, src.indexOf('\n  </main>', a));
  let depth = 0;
  let line = 1;
  for (const m of body.matchAll(/<(\/?)(div|section)\b|\n/g)) {
    if (m[0] === '\n') { line++; continue; }
    depth += m[1] ? -1 : 1;
    if (depth < 0) throw new Error(`${name}: closing tag with nothing open, around line ${line} of <main>`);
  }
  if (depth !== 0) throw new Error(`${name}: ${depth} unclosed div/section in <main>`);
};

assertBalanced('src/Brand.src.html', brandSrc);
assertBalanced('src/Presentations.src.html', presSrc);
assertBalanced('src/Social.src.html', socSrc);

let brandPane = contentOf(brandSrc)
  .replace('<h1 class="display">Web design</h1>', '<h1 class="display">Brand guidelines</h1>')
  .replace(/The working reference for how Exatom looks online:[\s\S]*?on their own pages\./,
    "The working reference for how Exatom looks: logo, color, type, and the interface elements built from them. Every value here is the real brand value — copy it from this page, don't approximate. Presentations and social media build on it, in their own guides.");

/* keep the filename findable next to the rewritten src */
brandPane = brandPane.replace(/<img src="([^"]+\.svg)"/g, '<img data-file="$1" src="logo/$1"');

/* the source points at assets/exatom-icons.zip; the build files it under icons/ */
brandPane = brandPane.replace('href="assets/exatom-icons.zip"', `href="assets/${ICON_ZIP}"`);

const chip = (hex, extra = '') =>
  `<button type="button" class="copy-chip${extra}" data-copy="${hex}" title="Copy ${hex}">${hex}${I.copy}${I.check}</button>`;

brandPane = brandPane
  .replace(/<p class="swatch-hex">(#[0-9A-Fa-f]{6})<\/p>/g, (_m, h) => `<p class="swatch-hex">${chip(h)}</p>`)
  .replace(/<p class="scale-hex">(#[0-9A-Fa-f]{6})<\/p>/g, (_m, h) => `<p class="scale-hex">${chip(h, ' on-fill')}</p>`)
  .replace(
    /<div class="gradient-fill" style="background: (linear-gradient\([^"]+\))"><\/div>\s*(<div class="tile-meta">[\s\S]*?<\/div>)/g,
    (_m, grad, meta) =>
      `<div class="gradient-fill" style="background: ${grad}"></div>\n            ${meta}\n            <div class="tile-actions"><button type="button" class="asset-btn" data-copy="${grad}">${I.copy}<span>Copy CSS</span>${I.check}</button></div>`
  );

/* real download links + copy-source on the six logo variants */
const vs = brandPane.indexOf('<div class="subsection" id="logo-variants">');
const ve = brandPane.indexOf('<div class="subsection" id="logo-backgrounds">');
if (vs < 0 || ve < 0) throw new Error('logo-variants slice not found');
let tiles = 0;
const variants = brandPane.slice(vs, ve).replace(
  /(<img data-file="([^"]+\.svg)"[^>]*><\/div>\s*<div class="tile-meta">[\s\S]*?<\/div>)/g,
  (_m, block, file) => {
    tiles++;
    return `${block}\n              <div class="tile-actions">` +
      `<a class="asset-btn" href="logo/${file}" download>${I.download}<span>SVG</span></a>` +
      `<button type="button" class="asset-btn" data-copy-svg="logo/${file}">${I.copy}<span>Copy code</span>${I.check}</button>` +
      `</div>`;
  }
);
brandPane = brandPane.slice(0, vs) + variants + brandPane.slice(ve);

const fixImgs = (s) => s.replace(/<img src="([^"]+\.svg)"/g, '<img src="logo/$1"');
const presPane = fixImgs(contentOf(presSrc)).replace(/the seven layouts/, 'the eight layouts');
const socPane = fixImgs(contentOf(socSrc));

/* strip the canvas {{ hole }} bindings — this site wires its own handlers */
const cleanNav = (html) => html.replace(/\s*onClick="\{\{\s*(\w+)\s*\}\}"/g, (_m, name) => {
  const id = { goLogo: 'logo', goColor: 'color', goType: 'type', goFoundations: 'foundations', goUi: 'ui', goForms: 'forms', goIcons: 'icons',
    goFormat: 'format', goLayouts: 'layouts', goSlideType: 'slide-type', goData: 'data', goBuilding: 'building',
    goProfile: 'profile', goFormats: 'formats', goCarousel: 'carousel', goCaptions: 'captions' }[name];
  if (!id) throw new Error('unmapped handler: ' + name);
  return ` data-scroll="${id}"`;
});

/* ------------------------------------------------------------------ styling */

const baseCss = between(brandSrc, '<style>', '</style>')
  .replace(/\n    \.guide-index \{[\s\S]*?\.sidebar-rule \{[^}]*\}\n/, '\n');

const siteCss = `
    /* ---------- Guide switcher ---------- */
    .switcher { position: relative; }
    .user-block {
      width: 100%; border: 0; font: inherit; text-align: left; cursor: pointer;
      background: none; color: inherit;
    }
    .user-block[aria-expanded="true"] { background: var(--warm-white); }
    .switch-pop {
      position: absolute; left: 0; right: 0; bottom: calc(100% + 6px);
      background: var(--white); border: 1px solid var(--border); border-radius: 8px;
      box-shadow: 0 12px 32px rgba(24, 18, 45, 0.10), 0 2px 6px rgba(24, 18, 45, 0.05);
      padding: var(--s-1); display: flex; flex-direction: column; gap: 2px; z-index: 20;
    }
    .switch-pop[hidden] { display: none; }
    .switch-opt {
      display: flex; align-items: center; gap: 10px;
      width: 100%; background: none; border: 0; font: inherit; text-align: left; cursor: pointer;
      height: 36px; padding: 0 10px; border-radius: 8px;
      font-size: 14px; letter-spacing: -0.02em; color: var(--dark);
      transition: background 120ms ease;
    }
    .switch-opt:hover { background: var(--warm-white); }
    .switch-opt > svg:first-child { width: 18px; height: 18px; flex: 0 0 18px; color: var(--gray-700); }
    .switch-opt .tick { width: 15px; height: 15px; flex: 0 0 15px; margin-left: auto; color: var(--blue); opacity: 0; display: inline-flex; }
    .switch-opt[aria-current] { color: var(--blue); font-weight: 500; }
    .switch-opt[aria-current] > svg:first-child { color: var(--blue); }
    .switch-opt[aria-current] .tick { opacity: 1; }

    /* ---------- Copy & download ---------- */
    .copy-chip {
      display: inline-flex; align-items: center; gap: 5px;
      font-family: 'Inter', sans-serif; font-size: inherit; color: inherit;
      background: none; border: 0; cursor: pointer;
      padding: 2px 6px; margin-left: -6px; border-radius: 4px;
      transition: background 120ms ease, color 120ms ease;
    }
    .copy-chip svg { width: 12px; height: 12px; flex: 0 0 12px; opacity: 0; transition: opacity 120ms ease; }
    .copy-chip svg + svg { display: none; }
    .copy-chip:hover { background: var(--warm-white); color: var(--dark); }
    .copy-chip:hover svg { opacity: 0.55; }
    .copy-chip.on-fill:hover { background: rgba(127, 127, 127, 0.2); color: inherit; }
    .copy-chip.is-done { color: var(--blue); }
    .copy-chip.on-fill.is-done { color: inherit; }
    .copy-chip.is-done svg { display: none; opacity: 1; }
    .copy-chip.is-done svg + svg { display: block; opacity: 1; }

    .tile-actions { display: flex; gap: var(--s-1); padding: 0 10px var(--s-3); }
    .asset-btn {
      display: inline-flex; align-items: center; gap: 6px;
      font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500; letter-spacing: 0.01em;
      color: var(--gray-700); background: none; border: 0; cursor: pointer; text-decoration: none;
      height: 28px; padding: 0 9px; border-radius: 999px;
      transition: background 120ms ease, color 120ms ease;
    }
    .asset-btn svg { width: 13px; height: 13px; flex: 0 0 13px; }
    .asset-btn svg + span + svg { display: none; }
    .asset-btn:hover { background: var(--warm-white); color: var(--dark); }
    .asset-btn.is-done { color: var(--blue); }
    .asset-btn.is-done > svg:first-child { display: none; }
    .asset-btn.is-done svg + span + svg { display: inline; }

    /* ---------- Download library ---------- */
    .asset-list { list-style: none; margin: 0; padding: 0; border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
    .asset-row { display: flex; align-items: center; gap: var(--s-4); padding: var(--s-3) var(--s-4); border-top: 1px solid var(--border); }
    .asset-row:first-child { border-top: none; }
    .asset-row:hover { background: var(--warm-white); }
    .asset-icon { display: inline-flex; color: var(--gray-300); }
    .asset-icon svg { width: 18px; height: 18px; }
    .asset-name { font-size: 14px; letter-spacing: -0.02em; flex: 1 1 auto; min-width: 0; overflow-wrap: anywhere; }
    .asset-type { font-size: 11px; font-weight: 600; letter-spacing: 0.04em; color: var(--gray-500); background: var(--white); border: 1px solid var(--border); padding: 3px 7px; border-radius: 4px; flex: 0 0 auto; }
    .asset-size { font-size: 12px; color: var(--gray-500); flex: 0 0 68px; text-align: right; }
    .asset-get {
      display: inline-flex; align-items: center; gap: 6px; flex: 0 0 auto;
      font-size: 12px; font-weight: 500; letter-spacing: 0.01em;
      color: var(--blue); text-decoration: none;
      height: 28px; padding: 0 12px; border-radius: 999px; background: var(--blue-light);
      transition: background 120ms ease, color 120ms ease;
    }
    .asset-get svg { width: 13px; height: 13px; flex: 0 0 13px; }
    .asset-get:hover { background: var(--blue); color: var(--white); }

    .awaiting { border: 1px dashed var(--gray-300); border-radius: 8px; background: var(--white); padding: var(--s-5) var(--s-6); max-width: 720px; }
    .awaiting-tag { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; letter-spacing: 0.06em; color: var(--gray-500); margin-bottom: var(--s-3); }
    .awaiting-tag span { width: 6px; height: 6px; border-radius: 999px; background: var(--gray-300); }
    .awaiting h4 { font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 600; letter-spacing: 0.01em; margin-bottom: var(--s-2); }
    .awaiting ul { margin: 0; padding-left: 18px; }
    .awaiting li { font-size: 14px; line-height: 1.65; color: var(--gray-700); }

    .guide-pane[hidden], .guide-nav[hidden] { display: none; }

    /* ---------- Small screens ---------- */
    @media (max-width: 900px) {
      .shell { display: block; }
      .sidebar { width: auto; border-right: 0; border-bottom: 1px solid var(--border); }
      .sidebar-inner { position: static; width: auto; height: auto; }
      .content { padding: var(--s-6) var(--s-5) 96px !important; }
      .display { font-size: 44px; }
      .section-title { font-size: 30px; }
      .asset-row { flex-wrap: wrap; }
      .asset-name { flex-basis: 100%; }
    }
`;


/* --------------------------------------------------------------- assembling */

const PAGES = [
  {
    id: 'brand', file: 'index.html', href: '/', name: 'Brand guidelines',
    nav: cleanNav(navOf(brandSrc)), pane: brandPane, css: '',
    description: "Exatom's brand guidelines: logo, color, typography, spacing and the UI elements built from them.",
  },
  {
    id: 'presentations', file: 'presentations.html', href: '/presentations', name: 'Presentations',
    nav: cleanNav(navOf(presSrc)), pane: presPane, css: scope(guideCss(presSrc), '[data-guide="presentations"]'),
    description: 'How an Exatom deck is built: slide format, margins, eight layouts, type and charts.',
  },
  {
    id: 'social', file: 'social.html', href: '/social', name: 'Social media',
    nav: cleanNav(navOf(socSrc)), pane: socPane, css: scope(guideCss(socSrc), '[data-guide="social"]'),
    description: 'How Exatom shows up on LinkedIn: profile, banner, post formats, carousels and captions.',
  },
  {
    id: 'downloads', file: 'downloads.html', href: '/downloads', name: 'Downloads',
    nav: downloadsNav, pane: downloadsPane, css: '',
    description: 'Every Exatom brand file in one place, straight from the repository.',
  },
];

const switchOpt = (page, current) =>
  `            <a class="switch-opt" href="${page.href}"${page.id === current ? ' aria-current="page"' : ''}>` +
  `${I[page.id]}<span>${page.name}</span><span class="tick">${I.check}</span></a>`;

const page = (p) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Exatom — ${p.name}</title>
<meta name="description" content="${esc(p.description)}">
<meta name="robots" content="noindex">
<link rel="icon" href="logo/exatom-icon-full-color.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&amp;family=Inter+Tight:wght@400;500;600&amp;family=Inter:wght@400;500;600&amp;display=swap">
<style>${baseCss}${siteCss}${p.css}
</style>
</head>
<body>
<div class="shell">
  <aside class="sidebar">
    <div class="sidebar-inner">
${p.nav.trim() ? `      <p class="sidebar-group-label">Sections</p>
      <nav class="menu">
${p.nav}
      </nav>
` : ''}
      <div class="sidebar-footer">
        <div class="switcher">
          <div class="switch-pop" hidden>
${PAGES.map((x) => switchOpt(x, p.id)).join('\n')}
          </div>
          <button type="button" class="user-block" aria-expanded="false" aria-haspopup="true">
            <img src="logo/exatom-icon-full-color.svg" alt="">
            <div class="user-text">
              <span class="user-name">${p.name}</span>
              <span class="user-meta">Exatom</span>
            </div>
            ${I.caret}
          </button>
        </div>
      </div>
    </div>
  </aside>

  <main class="content" style="max-width: 1200px; padding: 32px 64px 96px">
    <div class="guide-pane" data-guide="${p.id}">${p.pane}
    </div>
  </main>
</div>

<script>
(function () {
  var pop = document.querySelector('.switch-pop');
  var trigger = document.querySelector('.user-block');

  function closeSwitcher() {
    pop.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
  }

  trigger.addEventListener('click', function () {
    var open = pop.hidden;
    pop.hidden = !open;
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  function flash(el) {
    el.classList.add('is-done');
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove('is-done'); }, 1400);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; }).catch(fallback);
    }
    return Promise.resolve(fallback());
    function fallback() {
      try {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        var ok = document.execCommand('copy');
        ta.remove();
        return ok;
      } catch (e) { return false; }
    }
  }

  document.addEventListener('click', function (ev) {
    var scroll = ev.target.closest('[data-scroll]');
    if (scroll) {
      var el = document.getElementById(scroll.dataset.scroll);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    var iconGet = ev.target.closest('[data-icon-svg]');
    if (iconGet) {
      var cell = iconGet.closest('.icon-cell');
      var svg = cell && cell.querySelector('.icon-chip svg');
      var nameEl = cell && cell.querySelector('.icon-name');
      if (svg && nameEl) {
        var file = nameEl.textContent.trim().replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase() + '.svg';
        var out = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">' +
                  svg.innerHTML.trim() + '</svg>\\n';
        var url = URL.createObjectURL(new Blob([out], { type: 'image/svg+xml' }));
        var a = document.createElement('a');
        a.href = url; a.download = file; a.rel = 'noopener';
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
        flash(iconGet);
      }
      return;
    }

    var copy = ev.target.closest('[data-copy]');
    if (copy) { copyText(copy.dataset.copy).then(function (ok) { if (ok) flash(copy); }); return; }

    var copySvg = ev.target.closest('[data-copy-svg]');
    if (copySvg) {
      fetch(copySvg.dataset.copySvg)
        .then(function (r) { return r.text(); })
        .then(function (t) { return copyText(t); })
        .then(function (ok) { if (ok) flash(copySvg); })
        .catch(function () {});
      return;
    }

    if (!ev.target.closest('.switcher')) closeSwitcher();
  });

  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') closeSwitcher(); });
})();
</script>
</body>
</html>
`;

/* -------------------------------------------------------------------- write */

rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, 'logo'), { recursive: true });

for (const p of PAGES) writeFileSync(join(OUT, p.file), page(p));

/* the guide as Markdown, for feeding to a tool rather than reading */
const md = brandMarkdown(brandSrc, {
  h1: 'Brand guidelines',
  lede: "The working reference for how Exatom looks: logo, color, type, and the interface elements built from them. "
      + "Every value here is the real brand value \u2014 copy it from this page, don't approximate. Presentations and "
      + 'social media build on it, on their own pages.',
});
writeFileSync(join(OUT, 'brand-guidelines.md'), md);

for (const f of readdirSync(join(ROOT, 'logo'))) {
  if (f.endsWith('.svg')) copyFileSync(join(ROOT, 'logo', f), join(OUT, 'logo', f));
}

for (const a of assets) {
  if (a.rel === ICON_ZIP) continue;
  const dest = join(OUT, 'assets', a.rel);
  mkdirSync(join(dest, '..'), { recursive: true });
  copyFileSync(join(ROOT, 'assets', a.rel), dest);
}

mkdirSync(join(OUT, 'assets', 'icons'), { recursive: true });
writeFileSync(join(OUT, 'assets', ICON_ZIP), iconPack.buffer);

console.log(
  `built site/ — ${PAGES.length} pages (${PAGES.map((p) => p.file).join(', ')}), ` +
  `${tiles} logo tiles, ${(brandPane.match(/copy-chip/g) || []).length} copy chips, ` +
  `${assets.length} downloads in ${groups.size} group${groups.size === 1 ? '' : 's'}, ` +
  `icon pack ${(iconPack.buffer.length / 1048576).toFixed(1)} MB from ${iconPack.count} files`
);
