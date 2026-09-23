import fs from 'fs';
import path from 'path';
import { Compound } from '../src/types';

// Let's create an exhaustive database of real chemical compounds
// covering:
// 1. Oxides, Peroxides, Superoxides & Suboxides (60+)
// 2. Binary Hydracids & Oxyacids & Superacids (50+)
// 3. Hydroxides, Alkalis, Ammines & Metal Bases (40+)
// 4. Halides across all 25 elements: Fluorides, Chlorides, Bromides, Iodides, Interhalogens (120+)
// 5. Chalcogenides, Sulfides & Polyatomic Salts (110+)
// 6. Hydrocarbons: Alkanes C1-C10, Alkenes, Alkynes, Cycloalkanes, Aromatics (45+)
// 7. Functional Organics & Biomolecules: Alcohols, Ethers, Carbonyls, Carboxylic Acids, Esters, Nitrogen organics, Sugars, Amino Acids (75+)
// 8. Advanced Materials, Carbides, Nitrides, Hydrides, Polymers, Alloys, Energetics (50+)

export const DATABASE_500: Compound[] = [];

// Helper to add compounds safely
const seenIds = new Set<string>();

export function addCompound(c: Compound) {
  if (seenIds.has(c.id)) {
    // If seen, update or skip
    return;
  }
  seenIds.add(c.id);
  DATABASE_500.push(c);
}
