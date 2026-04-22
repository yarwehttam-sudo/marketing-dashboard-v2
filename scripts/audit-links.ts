/**
 * scripts/audit-links.ts
 *
 * Development-only internal link auditor for the SR Energy location system.
 * Run with:  npx tsx scripts/audit-links.ts
 *
 * Outputs: scripts/link-audit-report.md
 */

import * as fs from 'fs';
import * as path from 'path';
import { STATES, getNearbyStateCities } from '../lib/locations';

// ─────────────────────────────────────────────────────────────────────────────
// 1. URL inventory
// ─────────────────────────────────────────────────────────────────────────────

type PageType = 'hub' | 'state' | 'city' | 'vpp-city';

interface Page {
  url: string;
  type: PageType;
  label: string;
}

const pages: Page[] = [];

// Hub
pages.push({ url: '/locations/', type: 'hub', label: 'Locations Hub' });

for (const state of STATES) {
  // State index
  pages.push({
    url: `/locations/${state.slug}/`,
    type: 'state',
    label: `${state.name} State Index`,
  });

  for (const city of state.cities) {
    // City page
    pages.push({
      url: `/locations/${state.slug}/${city.slug}/`,
      type: 'city',
      label: `${city.name}, ${state.abbr} City Page`,
    });

    // Texas VPP city page (Texas only)
    if (state.isVppEligible) {
      pages.push({
        url: `/locations/texas/${city.slug}/texas-vpp/`,
        type: 'vpp-city',
        label: `${city.name} TX VPP Page`,
      });
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Expected link graph
//    Keys are source URLs; values are the set of URLs they link TO.
// ─────────────────────────────────────────────────────────────────────────────

// Record<sourceUrl, Set<targetUrl>>
const linksFrom: Map<string, Set<string>> = new Map();

function addLink(from: string, to: string) {
  if (from === to) return;
  if (!linksFrom.has(from)) linksFrom.set(from, new Set());
  linksFrom.get(from)!.add(to);
}

// Seed every page with an empty set so pages with no outbound links still appear
for (const p of pages) linksFrom.set(p.url, new Set());

// ── Hub → all state pages ────────────────────────────────────────────────────
const hubUrl = '/locations/';
for (const state of STATES) {
  addLink(hubUrl, `/locations/${state.slug}/`);
}

// ── State page linking rules ──────────────────────────────────────────────────
//   → hub
//   → all its city pages
//   → Texas VPP product page (if VPP eligible)
for (const state of STATES) {
  const stateUrl = `/locations/${state.slug}/`;
  addLink(stateUrl, hubUrl);

  for (const city of state.cities) {
    addLink(stateUrl, `/locations/${state.slug}/${city.slug}/`);
  }

  if (state.isVppEligible) {
    addLink(stateUrl, '/products/texas-vpp');
  }
}

// ── City page linking rules ───────────────────────────────────────────────────
//   → hub
//   → its state page
//   → up to 3 sibling cities in the same state
//   → texas-vpp city page (if VPP eligible state)
for (const state of STATES) {
  for (const city of state.cities) {
    const cityUrl = `/locations/${state.slug}/${city.slug}/`;

    addLink(cityUrl, hubUrl);
    addLink(cityUrl, `/locations/${state.slug}/`);

    // Nearby sibling cities — uses the same rotation as getNearbyStateCities
    // so the modelled graph stays in sync with the actual page template.
    const siblings = getNearbyStateCities(state.slug, city.slug);
    for (const sibling of siblings) {
      addLink(cityUrl, `/locations/${state.slug}/${sibling.slug}/`);
    }

    if (state.isVppEligible) {
      addLink(cityUrl, `/locations/texas/${city.slug}/texas-vpp/`);
    }
  }
}

// ── Texas VPP city page linking rules ────────────────────────────────────────
//   → hub
//   → texas state page
//   → the parent city page
//   → other TX VPP city pages (exclude self)
const texas = STATES.find((s) => s.slug === 'texas')!;
for (const city of texas.cities) {
  const vppUrl = `/locations/texas/${city.slug}/texas-vpp/`;

  addLink(vppUrl, hubUrl);
  addLink(vppUrl, '/locations/texas/');
  addLink(vppUrl, `/locations/texas/${city.slug}/`);

  // Cross-links to all other TX VPP city pages
  for (const other of texas.cities) {
    if (other.slug !== city.slug) {
      addLink(vppUrl, `/locations/texas/${other.slug}/texas-vpp/`);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Inbound link count (only counting links between location pages)
// ─────────────────────────────────────────────────────────────────────────────

const pageUrls = new Set(pages.map((p) => p.url));

// Record<targetUrl, Set<sourceUrl>>
const linksTo: Map<string, Set<string>> = new Map();
for (const p of pages) linksTo.set(p.url, new Set());

for (const [from, targets] of linksFrom) {
  for (const to of targets) {
    if (pageUrls.has(to)) {
      if (!linksTo.has(to)) linksTo.set(to, new Set());
      linksTo.get(to)!.add(from);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Orphan detection (fewer than 2 inbound internal links)
// ─────────────────────────────────────────────────────────────────────────────

const ORPHAN_THRESHOLD = 2;

interface Orphan {
  page: Page;
  inboundCount: number;
  recommendedFix: string;
}

const orphans: Orphan[] = [];

for (const p of pages) {
  const inbound = linksTo.get(p.url)?.size ?? 0;
  if (inbound < ORPHAN_THRESHOLD) {
    let fix = '';
    switch (p.type) {
      case 'hub':
        fix = 'Add /locations/ link to site header navigation and footer.';
        break;
      case 'state': {
        const slug = p.url.replace('/locations/', '').replace('/', '');
        fix = `Ensure /locations/ hub card links here AND at least one city page back-links to /locations/${slug}/.`;
        break;
      }
      case 'city': {
        const parts = p.url.split('/').filter(Boolean); // ['locations','state','city']
        const stateSlug = parts[1];
        fix =
          `State page /locations/${stateSlug}/ must list this city. ` +
          `Add at least one sibling city cross-link pointing here.`;
        break;
      }
      case 'vpp-city': {
        const parts = p.url.split('/').filter(Boolean); // ['locations','texas','city','texas-vpp']
        const citySlug = parts[2];
        fix =
          `Ensure /locations/texas/${citySlug}/ links to this VPP page ` +
          `AND at least one other TX VPP city page cross-links here.`;
        break;
      }
    }
    orphans.push({ page: p, inboundCount: inbound, recommendedFix: fix });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Missing reciprocal links
//    Page A links to Page B but Page B does not link back to Page A.
//    Only checked between location pages (external targets like /products/* excluded).
// ─────────────────────────────────────────────────────────────────────────────

interface MissingReciprocal {
  pageA: string;
  pageB: string;
  note: string;
}

const missingReciprocals: MissingReciprocal[] = [];

for (const [from, targets] of linksFrom) {
  if (!pageUrls.has(from)) continue;
  for (const to of targets) {
    if (!pageUrls.has(to)) continue;
    const toLinks = linksFrom.get(to);
    if (!toLinks?.has(from)) {
      missingReciprocals.push({
        pageA: from,
        pageB: to,
        note: `${to} should add a link back to ${from}`,
      });
    }
  }
}

// De-duplicate (A→B and B→A would each appear once; we only want one entry per pair)
const reciprocalSeen = new Set<string>();
const dedupedReciprocals: MissingReciprocal[] = [];
for (const r of missingReciprocals) {
  const key = [r.pageA, r.pageB].sort().join('||');
  if (!reciprocalSeen.has(key)) {
    reciprocalSeen.add(key);
    dedupedReciprocals.push(r);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Build markdown report
// ─────────────────────────────────────────────────────────────────────────────

const now = new Date().toISOString().slice(0, 10);

const statePages   = pages.filter((p) => p.type === 'state');
const cityPages    = pages.filter((p) => p.type === 'city');
const vppPages     = pages.filter((p) => p.type === 'vpp-city');

let md = `# SR Energy Location System — Internal Link Audit
Generated: ${now}

---

## Section A — Complete URL Inventory

**Total pages: ${pages.length}**
| Count | Type |
|------:|------|
| 1 | Locations hub |
| ${statePages.length} | State index pages |
| ${cityPages.length} | City pages |
| ${vppPages.length} | Texas VPP city pages |

### Locations Hub
| URL |
|-----|
| /locations/ |

### State Index Pages (${statePages.length})
| URL | State |
|-----|-------|
${statePages.map((p) => `| ${p.url} | ${p.label.replace(' State Index', '')} |`).join('\n')}

### City Pages (${cityPages.length})
| URL |
|-----|
${cityPages.map((p) => `| ${p.url} |`).join('\n')}

### Texas VPP City Pages (${vppPages.length})
| URL |
|-----|
${vppPages.map((p) => `| ${p.url} |`).join('\n')}

---

## Section B — Orphan Pages

Orphans = pages with **fewer than ${ORPHAN_THRESHOLD} inbound internal links** from other location pages.

`;

if (orphans.length === 0) {
  md += `**No orphans detected.** Every page receives at least ${ORPHAN_THRESHOLD} inbound links.\n`;
} else {
  md += `**${orphans.length} orphan(s) detected:**\n\n`;
  md += `| URL | Type | Inbound Links | Recommended Fix |\n`;
  md += `|-----|------|:-------------:|-----------------|\n`;
  for (const o of orphans) {
    md += `| ${o.page.url} | ${o.page.type} | ${o.inboundCount} | ${o.recommendedFix} |\n`;
  }
}

md += `
---

## Section C — Missing Reciprocal Links

A missing reciprocal means **Page A links to Page B, but Page B does not link back to Page A**.
Only location-system pages are evaluated (links to /products/*, /get-quote, etc. are excluded).

`;

if (dedupedReciprocals.length === 0) {
  md += `**No missing reciprocal links detected.**\n`;
} else {
  md += `**${dedupedReciprocals.length} missing reciprocal(s):**\n\n`;
  md += `| Page A (links to B) | Page B (missing link back) |\n`;
  md += `|---------------------|----------------------------|\n`;
  for (const r of dedupedReciprocals) {
    md += `| ${r.pageA} | ${r.pageB} |\n`;
  }
}

md += `
---

## Link Graph Summary

| Metric | Value |
|--------|------:|
| Total pages audited | ${pages.length} |
| Total internal links modelled | ${[...linksFrom.values()].reduce((n, s) => n + s.size, 0)} |
| Orphan pages (< ${ORPHAN_THRESHOLD} inbound) | ${orphans.length} |
| Missing reciprocal pairs | ${dedupedReciprocals.length} |
`;

// ─────────────────────────────────────────────────────────────────────────────
// 7. Write report
// ─────────────────────────────────────────────────────────────────────────────

const outPath = path.join(__dirname, 'link-audit-report.md');
fs.writeFileSync(outPath, md, 'utf8');

console.log(`\n✓ Audit complete — ${pages.length} pages analysed`);
console.log(`  Orphans:              ${orphans.length}`);
console.log(`  Missing reciprocals:  ${dedupedReciprocals.length}`);
console.log(`  Report written to:    ${outPath}\n`);
