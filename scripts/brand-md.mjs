/**
 * Turns the brand guidelines source into Markdown.
 *
 * Only LEAF patterns are matched — a row, a swatch, a chip — never a container.
 * Containers nest, and a lazy regex over nested divs picks the wrong closing
 * tag. Consecutive leaves of the same kind are then grouped into one table, so
 * document order survives without the parser having to understand the tree.
 */

const ENT = {
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'",
  '&nbsp;': ' ', '&mdash;': '—', '&ndash;': '–', '&minus;': '−',
  '&times;': '×', '&divide;': '÷', '&ldquo;': '“', '&rdquo;': '”',
  '&hellip;': '…', '&deg;': '°',
};

const txt = (h = '') =>
  h.replace(/<[^>]*>/g, '')
   .replace(/&[a-z#0-9]+;/gi, (m) => ENT[m] ?? m)
   .replace(/\s+/g, ' ')
   .trim();

/** Markdown tables break on a raw pipe. */
const cell = (h) => txt(h).replace(/\|/g, '\\|');

const PATTERNS = [
  ['h1',        /<h1 class="display">([\s\S]*?)<\/h1>/g],
  ['lede',      /<p class="lede">([\s\S]*?)<\/p>/g],
  ['h2',        /<h2 class="section-title">([\s\S]*?)<\/h2>/g],
  ['intro',     /<p class="section-intro">([\s\S]*?)<\/p>/g],
  ['h3',        /<(?:h3|p) class="subsection-title"[^>]*>([\s\S]*?)<\/(?:h3|p)>/g],
  ['note',      /<p class="subsection-note">([\s\S]*?)<\/p>/g],
  ['chipGroup', /<div class="specimen-spec">/g],
  ['chip',      /<span class="spec-chip">([\s\S]*?)<\/span>/g],
  ['rule',      /<div class="rule"><span class="rule-key">([\s\S]*?)<\/span><span class="rule-val">([\s\S]*?)<\/span><\/div>/g],
  ['logo',      /<div class="tile-meta"><p class="tile-name">([\s\S]*?)<\/p><p class="tile-sub">([\s\S]*?)<\/p><\/div>/g],
  ['swatch',    /<div class="swatch-(?:chip|tile-fill)" style="background:\s*(#[0-9A-Fa-f]{6})[^"]*"><\/div>\s*<div class="swatch-(?:info|tile-meta)">\s*<p class="swatch-name">([\s\S]*?)<\/p>\s*(?:<div class="swatch-values">\s*)?<p class="swatch-hex">[\s\S]*?<\/p>\s*<p class="swatch-rgb">([\s\S]*?)<\/p>\s*(?:<\/div>\s*)?<p class="swatch-role">([\s\S]*?)<\/p>/g],
  ['scale',     /<div class="scale-cell" style="[^"]*"><p class="scale-hex">([\s\S]*?)<\/p><p class="scale-role">([\s\S]*?)<\/p><\/div>/g],
  ['gradient',  /<div class="tile-meta"><p class="tile-name">([\s\S]*?)<\/p><p class="tile-sub">((?:[^<]*→[^<]*))<\/p><\/div>/g],
  ['space',     /<p class="space-val">([\s\S]*?)<\/p>\s*<p class="space-use">([\s\S]*?)<\/p>/g],
  ['weight',    /<p class="weight-spec">([\s\S]*?)<\/p>/g],
  ['icon',      /<span class="icon-use">([\s\S]*?)<\/span><span class="icon-name">([\s\S]*?)<\/span>/g],
  ['field',     /<label class="field-label">((?:(?!<\/label>)[\s\S])*)<\/label>((?:(?!<label class="field-label")[\s\S]){0,900})/g],
  ['do',        /<p class="dodont-tag do">[\s\S]*?<\/p>\s*<ul>([\s\S]*?)<\/ul>/g],
  ['skip',      /<p class="dodont-tag skip">[\s\S]*?<\/p>\s*<ul>([\s\S]*?)<\/ul>/g],
  ['caption',   /<p class="caption"[^>]*>([\s\S]*?)<\/p>/g],
];

const HEAD = {
  rule:     ['', ''],
  logo:     ['Item', 'Value'],
  swatch:   ['Color', 'Hex', 'RGB', 'Role'],
  scale:    ['Hex', 'Role'],
  gradient: ['Gradient', 'Stops'],
  space:    ['Token', 'Use'],
  icon:     ['Use', 'Phosphor name'],
  field:    ['Field', 'Type', 'Note'],
};

export function brandMarkdown(html, { title = 'Exatom — Brand guidelines', h1, lede } = {}) {
  const a = html.indexOf('<main class="content"');
  const body = html.slice(html.indexOf('>', a) + 1, html.indexOf('\n  </main>', a));

  // collect every leaf with its position, then walk them in document order
  const hits = [];
  for (const [kind, re] of PATTERNS) {
    for (const m of body.matchAll(re)) hits.push({ kind, at: m.index, m });
  }
  hits.sort((x, y) => x.at - y.at);

  const out = [];
  let last = null;
  let chips = [];

  const flushChips = () => {
    if (!chips.length) return;
    out.push(chips.map((c) => '`' + c + '`').join(' · '), '');
    chips = [];
  };

  const TABLE = new Set(Object.keys(HEAD));

  const row = (kind, cells) => {
    if (last !== kind) {
      flushChips();
      const head = HEAD[kind];
      if (head && head.some(Boolean)) {
        out.push('| ' + head.join(' | ') + ' |');
        out.push('|' + head.map(() => '---').join('|') + '|');
      } else if (head) {
        out.push('| | |', '|---|---|');
      }
    }
    out.push('| ' + cells.join(' | ') + ' |');
  };

  const seen = new Set();

  for (const { kind, m } of hits) {
    // a gradient tile also matches the logo pattern; whichever ran first wins
    const key = kind + ':' + m.index;
    if (seen.has(m.index) && (kind === 'logo' || kind === 'gradient')) continue;
    if (kind === 'logo' || kind === 'gradient') seen.add(m.index);

    if (kind !== 'chip') flushChips();
    if (kind === 'chipGroup') { last = kind; continue; }
    // a table ends where the next kind begins
    if (last && TABLE.has(last) && last !== kind) out.push('');

    switch (kind) {
      case 'h1':      out.push('# ' + (h1 ?? txt(m[1])), ''); break;
      case 'h2':      out.push('', '## ' + txt(m[1]), ''); break;
      case 'h3':      out.push('', '### ' + txt(m[1]), ''); break;
      case 'lede':    out.push(lede ?? txt(m[1]), ''); break;
      case 'intro':
      case 'note':
      case 'caption': out.push(txt(m[1]), ''); break;
      case 'chip':    chips.push(txt(m[1])); break;
      case 'rule':    row('rule', [`**${cell(m[1])}**`, cell(m[2])]); break;
      case 'logo':    row('logo', [`**${cell(m[1])}**`, cell(m[2])]); break;
      case 'gradient':row('gradient', [`**${cell(m[1])}**`, '`' + cell(m[2]) + '`']); break;
      case 'swatch':  row('swatch', [`**${cell(m[2])}**`, '`' + m[1].toUpperCase() + '`', cell(m[3]), cell(m[4])]); break;
      case 'scale':   row('scale', ['`' + cell(m[1]) + '`', cell(m[2])]); break;
      case 'space':   row('space', ['`' + cell(m[1]) + '`', cell(m[2])]); break;
      case 'icon':    row('icon', [cell(m[1]), '`' + cell(m[2]) + '`']); break;
      case 'field': {
        const note = /<p class="(?:field-help[^"]*|form-note)">([\s\S]*?)<\/p>/.exec(m[2]);
        const kindOf = /<textarea/.test(m[2]) ? 'textarea'
          : /<select/.test(m[2]) ? 'select'
          : /choice-box round/.test(m[2]) ? 'radio'
          : /choice-box/.test(m[2]) ? 'checkbox'
          : 'text';
        row('field', [`**${cell(m[1])}**`, '`' + kindOf + '`', note ? cell(note[1]) : '—']);
        break;
      }
      case 'weight':  out.push('- ' + txt(m[1])); break;
      case 'do':
      case 'skip': {
        out.push('', `**${kind === 'do' ? 'Do' : 'Skip'}**`, '');
        for (const li of m[1].matchAll(/<li>([\s\S]*?)<\/li>/g)) out.push('- ' + txt(li[1]));
        out.push('');
        break;
      }
    }
    last = kind;
  }
  flushChips();

  const stamp = new Date().toISOString().slice(0, 10);
  const md = [
    `<!-- ${title} — generated from src/Brand.src.html on ${stamp}. Do not edit by hand. -->`,
    '',
    ...out,
  ].join('\n');

  return md.replace(/\n{3,}/g, '\n\n').replace(/\|\n\|/g, '|\n|') + '\n';
}
