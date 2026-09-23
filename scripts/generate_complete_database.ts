import fs from 'fs';
import path from 'path';
import { Compound } from '../src/types';

// Let's create a script that generates the complete, rich library of 520+ compounds
// and writes it out cleanly to src/data/compounds.ts.

const compounds: Compound[] = [];
const idSet = new Set<string>();

function add(c: Compound) {
  if (idSet.has(c.id)) {
    // Already added
    return;
  }
  idSet.add(c.id);
  compounds.push(c);
}

// First, read existing compounds from src/data/compounds.ts
const existingContent = fs.readFileSync(path.join(process.cwd(), 'src/data/compounds.ts'), 'utf-8');

// We can import existing compounds directly using tsx
import { ALL_COMPOUNDS as OLD_COMPOUNDS } from '../src/data/compounds';
for (const c of OLD_COMPOUNDS) {
  add(c);
}
console.log('Loaded', compounds.length, 'initial compounds.');

// Now import all compounds from the new modules in src/data/compounds/
import { OXIDE_COMPOUNDS } from '../src/data/compounds/oxides';
import { ACID_COMPOUNDS } from '../src/data/compounds/acids';
import { BASE_COMPOUNDS } from '../src/data/compounds/bases';
import { HALIDE_COMPOUNDS } from '../src/data/compounds/salts_halides';
import { POLYATOMIC_SALTS } from '../src/data/compounds/salts_polyatomic';
import { HYDROCARBON_COMPOUNDS } from '../src/data/compounds/hydrocarbons';
import { ORGANIC_COMPOUNDS } from '../src/data/compounds/organics';
import { MATERIAL_COMPOUNDS } from '../src/data/compounds/materials';

for (const c of OXIDE_COMPOUNDS) add(c);
for (const c of ACID_COMPOUNDS) add(c);
for (const c of BASE_COMPOUNDS) add(c);
for (const c of HALIDE_COMPOUNDS) add(c);
for (const c of POLYATOMIC_SALTS) add(c);
for (const c of HYDROCARBON_COMPOUNDS) add(c);
for (const c of ORGANIC_COMPOUNDS) add(c);
for (const c of MATERIAL_COMPOUNDS) add(c);

console.log('After initial modules:', compounds.length, 'compounds.');
