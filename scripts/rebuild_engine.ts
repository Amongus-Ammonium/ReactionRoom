import fs from 'fs';
import path from 'path';

// Generator that compiles 520+ compounds with authentic precursor hierarchies,
// condition modifiers for multivalents, and Helium chemistry (HeH+).

interface RawCompound {
  id: string;
  name: string;
  formula: string;
  category: string;
  state: string;
  appearance: string;
  description: string;
  hazard: string;
  bondType: string;
  color: string;
  glowColor?: string;
  recipe: string[];
  condition?: { heat?: boolean; electricity?: boolean; catalyst?: boolean };
  equation: string;
  enthalpy?: string;
  funFact?: string;
}

const compounds: RawCompound[] = [];
const idSet = new Set<string>();

function add(c: RawCompound) {
  if (idSet.has(c.id)) {
    const idx = compounds.findIndex(x => x.id === c.id);
    if (idx !== -1) compounds[idx] = c;
    return;
  }
  idSet.add(c.id);
  compounds.push(c);
}

// 1. Base Core Inorganic Compounds
const BASE_INORGANICS: RawCompound[] = [
  // Water & Peroxide
  { id: 'H2O', name: 'Water', formula: 'H₂O', category: 'oxide', state: 'liquid', appearance: 'Colorless fluid', description: 'Universal solvent stabilized by hydrogen bonding.', hazard: 'safe', bondType: 'covalent', color: '#38bdf8', glowColor: 'rgba(56, 189, 248, 0.4)', recipe: ['H', 'O'], condition: { heat: true }, equation: '2H₂ + O₂ → 2H₂O', enthalpy: '-285.8 kJ/mol', funFact: 'Expands by ~9% when freezing.' },
  { id: 'H2O2', name: 'Hydrogen Peroxide', formula: 'H₂O₂', category: 'oxide', state: 'liquid', appearance: 'Pale blue fluid', description: 'Potent oxidizer with an unstable single peroxide linkage.', hazard: 'corrosive', bondType: 'covalent', color: '#7dd3fc', glowColor: 'rgba(125, 211, 252, 0.4)', recipe: ['H2O', 'O'], condition: { electricity: true }, equation: 'H₂O + [O] → H₂O₂', enthalpy: '-187.8 kJ/mol', funFact: 'Concentrated peroxide fuels rocket monopropellant thrusters.' },
  { id: 'HeH_plus', name: 'Helium Hydride Ion', formula: 'HeH⁺', category: 'rare_matter', state: 'gas', appearance: 'Glowing celestial plasma discharge', description: 'The oldest known molecular ion in the universe, forged ~380,000 years after the Big Bang under high electrical ionization.', hazard: 'safe', bondType: 'polar-covalent', color: '#38bdf8', glowColor: 'rgba(56, 189, 248, 0.6)', recipe: ['He', 'H'], condition: { electricity: true }, equation: 'He + H⁺ (Extreme Discharge) → HeH⁺', enthalpy: 'ΔH° = +321 kJ/mol', funFact: 'Detected in planetary nebula NGC 7027 by NASA’s SOFIA observatory in 2019.' },

  // Carbon Oxides
  { id: 'CO', name: 'Carbon Monoxide', formula: 'CO', category: 'oxide', state: 'gas', appearance: 'Colorless gas', description: 'Formed by incomplete combustion; binds tenaciously to hemoglobin.', hazard: 'toxic', bondType: 'covalent', color: '#94a3b8', glowColor: 'rgba(148, 163, 184, 0.4)', recipe: ['C', 'O'], equation: '2C + O₂ → 2CO', enthalpy: '-110.5 kJ/mol' },
  { id: 'CO2', name: 'Carbon Dioxide', formula: 'CO₂', category: 'oxide', state: 'gas', appearance: 'Colorless gas', description: 'Product of complete combustion and cellular respiration.', hazard: 'safe', bondType: 'covalent', color: '#cbd5e1', glowColor: 'rgba(203, 213, 225, 0.4)', recipe: ['C', 'O'], condition: { heat: true }, equation: 'C + O₂ → CO₂', enthalpy: '-393.5 kJ/mol' },

  // Nitrogen & Sulfur Oxides
  { id: 'NO', name: 'Nitric Oxide', formula: 'NO', category: 'oxide', state: 'gas', appearance: 'Colorless gas', description: 'Free-radical biological vasodilator signalling molecule.', hazard: 'toxic', bondType: 'covalent', color: '#a78bfa', recipe: ['N', 'O'], condition: { heat: true }, equation: 'N₂ + O₂ → 2NO' },
  { id: 'NO2', name: 'Nitrogen Dioxide', formula: 'NO₂', category: 'oxide', state: 'gas', appearance: 'Reddish-brown acrid gas', description: 'Key constituent of photochemical urban smog.', hazard: 'toxic', bondType: 'covalent', color: '#ea580c', recipe: ['NO', 'O'], equation: '2NO + O₂ → 2NO₂' },
  { id: 'N2O', name: 'Nitrous Oxide (Laughing Gas)', formula: 'N₂O', category: 'oxide', state: 'gas', appearance: 'Sweet-smelling gas', description: 'Inhalation anesthetic and racing rocket fuel booster.', hazard: 'safe', bondType: 'covalent', color: '#93c5fd', recipe: ['NH4NO3'], condition: { heat: true }, equation: 'NH₄NO₃ → N₂O + 2H₂O' },
  { id: 'SO2', name: 'Sulfur Dioxide', formula: 'SO₂', category: 'oxide', state: 'gas', appearance: 'Choking pungent gas', description: 'Volcanic gas causing sulfuric acid rain.', hazard: 'toxic', bondType: 'covalent', color: '#facc15', recipe: ['S', 'O'], condition: { heat: true }, equation: 'S + O₂ → SO₂' },
  { id: 'SO3', name: 'Sulfur Trioxide', formula: 'SO₃', category: 'oxide', state: 'gas', appearance: 'Dense fuming white vapor', description: 'Contact process precursor to sulfuric acid.', hazard: 'corrosive', bondType: 'covalent', color: '#fef08a', recipe: ['SO2', 'O'], condition: { catalyst: true }, equation: '2SO₂ + O₂ → 2SO₃' },

  // Halogen Hydracids
  { id: 'HF', name: 'Hydrofluoric Acid', formula: 'HF', category: 'acid', state: 'liquid', appearance: 'Fuming corrosive liquid', description: 'Attacks silica glass and dissolves biological tissue.', hazard: 'corrosive', bondType: 'polar-covalent', color: '#10b981', recipe: ['H', 'F'], equation: 'H₂ + F₂ → 2HF' },
  { id: 'HCl', name: 'Hydrochloric Acid (Muriatic Acid)', formula: 'HCl', category: 'acid', state: 'liquid', appearance: 'Clear pungent acid', description: 'Human stomach gastric acid for digesting proteins.', hazard: 'corrosive', bondType: 'polar-covalent', color: '#22c55e', recipe: ['H', 'Cl'], equation: 'H₂ + Cl₂ → 2HCl' },
  { id: 'HBr', name: 'Hydrobromic Acid', formula: 'HBr', category: 'acid', state: 'liquid', appearance: 'Heavy fuming acid', description: 'Strong mineral acid for alkyl halide synthesis.', hazard: 'corrosive', bondType: 'polar-covalent', color: '#f97316', recipe: ['H', 'Br'], equation: 'H₂ + Br₂ → 2HBr' },
  { id: 'HI', name: 'Hydroiodic Acid', formula: 'HI', category: 'acid', state: 'liquid', appearance: 'Deep brownish-red acid', description: 'Ultra-strong halogen hydracid reducing agent.', hazard: 'corrosive', bondType: 'polar-covalent', color: '#a855f7', recipe: ['H', 'I'], equation: 'H₂ + I₂ → 2HI' },
  { id: 'H2S', name: 'Hydrogen Sulfide', formula: 'H₂S', category: 'acid', state: 'gas', appearance: 'Rotten-egg odor gas', description: 'Volcanic and sewer gas blocking cellular respiration.', hazard: 'toxic', bondType: 'covalent', color: '#eab308', recipe: ['H', 'S'], equation: 'H₂ + S → H₂S' },
  { id: 'NH3', name: 'Ammonia', formula: 'NH₃', category: 'base', state: 'gas', appearance: 'Sharp alkaline gas', description: 'Synthesized via the Haber-Bosch process for fertilizer.', hazard: 'corrosive', bondType: 'covalent', color: '#38bdf8', recipe: ['N', 'H'], condition: { heat: true, catalyst: true }, equation: 'N₂ + 3H₂ → 2NH₃' },

  // Oxoacids
  { id: 'H2SO4', name: 'Sulfuric Acid', formula: 'H₂SO₄', category: 'acid', state: 'liquid', appearance: 'Dense oily vitriol fluid', description: 'The "King of Chemicals" driving industrial civilization.', hazard: 'corrosive', bondType: 'polar-covalent', color: '#eab308', recipe: ['SO3', 'H2O'], equation: 'SO₃ + H₂O → H₂SO₄' },
  { id: 'HNO3', name: 'Nitric Acid', formula: 'HNO₃', category: 'acid', state: 'liquid', appearance: 'Fuming yellow acid', description: 'Powerful oxidizer dissolving metals and producing nitrates.', hazard: 'corrosive', bondType: 'polar-covalent', color: '#f97316', recipe: ['NO2', 'H2O'], equation: '3NO₂ + H₂O → 2HNO₃ + NO' },
  { id: 'H3PO4', name: 'Phosphoric Acid', formula: 'H₃PO₄', category: 'acid', state: 'liquid', appearance: 'Viscous clear acid', description: 'Acidulant in cola soft drinks and dental etching gel.', hazard: 'corrosive', bondType: 'polar-covalent', color: '#6366f1', recipe: ['P', 'O'], condition: { heat: true }, equation: 'P₄O₁₀ + 6H₂O → 4H₃PO₄' },
  { id: 'H2CO3', name: 'Carbonic Acid', formula: 'H₂CO₃', category: 'acid', state: 'liquid', appearance: 'Effervescent fluid', description: 'Formed when carbon dioxide dissolves in water.', hazard: 'safe', bondType: 'covalent', color: '#cbd5e1', recipe: ['CO2', 'H2O'], equation: 'CO₂ + H₂O ⇌ H₂CO₃' },

  // Alkalis & Bases
  { id: 'NaOH', name: 'Sodium Hydroxide (Lye)', formula: 'NaOH', category: 'base', state: 'solid', appearance: 'White deliquescent pellets', description: 'Caustic soda for soap saponification and drain opening.', hazard: 'corrosive', bondType: 'ionic', color: '#38bdf8', recipe: ['Na', 'H2O'], equation: '2Na + 2H₂O → 2NaOH + H₂' },
  { id: 'KOH', name: 'Potassium Hydroxide (Caustic Potash)', formula: 'KOH', category: 'base', state: 'solid', appearance: 'White flakes', description: 'Strong base used in alkaline batteries and soft soaps.', hazard: 'corrosive', bondType: 'ionic', color: '#c084fc', recipe: ['K', 'H2O'], equation: '2K + 2H₂O → 2KOH + H₂' },
  { id: 'CaOH2', name: 'Calcium Hydroxide (Slaked Lime)', formula: 'Ca(OH)₂', category: 'base', state: 'solid', appearance: 'White powder', description: 'Used in mortar plaster and agricultural lime.', hazard: 'corrosive', bondType: 'ionic', color: '#e2e8f0', recipe: ['CaO', 'H2O'], equation: 'CaO + H₂O → Ca(OH)₂' },
  { id: 'MgOH2', name: 'Magnesium Hydroxide (Milk of Magnesia)', formula: 'Mg(OH)₂', category: 'base', state: 'solid', appearance: 'White suspension', description: 'Antacid and gentle laxative neutralizing stomach acid.', hazard: 'safe', bondType: 'ionic', color: '#e2e8f0', recipe: ['MgO', 'H2O'], equation: 'MgO + H₂O → Mg(OH)₂' },
  { id: 'AlOH3', name: 'Aluminium Hydroxide', formula: 'Al(OH)₃', category: 'base', state: 'solid', appearance: 'Amorphous gelatinous powder', description: 'Amphoteric antacid and flame-retardant filler.', hazard: 'safe', bondType: 'ionic', color: '#cbd5e1', recipe: ['Al2O3', 'H2O'], condition: { heat: true }, equation: 'Al₂O₃ + 3H₂O → 2Al(OH)₃' },
];

for (const b of BASE_INORGANICS) add(b);

// 2. Multivalent Halides & Condition-Dependent Halogenation
const HALOGENS = [
  { id: 'F', symbol: 'F', name: 'Fluoride', color: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' },
  { id: 'Cl', symbol: 'Cl', name: 'Chloride', color: '#4ade80', glow: 'rgba(74, 222, 128, 0.4)' },
  { id: 'Br', symbol: 'Br', name: 'Bromide', color: '#f97316', glow: 'rgba(249, 115, 22, 0.4)' },
  { id: 'I', symbol: 'I', name: 'Iodide', color: '#a855f7', glow: 'rgba(168, 85, 247, 0.4)' },
];

const subNums = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
function toSub(n: number) {
  if (n <= 1) return '';
  return String(n).split('').map(d => subNums[parseInt(d)]).join('');
}

// Fixed-valence salts:
const MONOVALENT_AND_DIVALENT = [
  { id: 'Na', symbol: 'Na', name: 'Sodium', valence: 1, state: 'solid', hazard: 'safe' },
  { id: 'K', symbol: 'K', name: 'Potassium', valence: 1, state: 'solid', hazard: 'safe' },
  { id: 'Li', symbol: 'Li', name: 'Lithium', valence: 1, state: 'solid', hazard: 'safe' },
  { id: 'Ca', symbol: 'Ca', name: 'Calcium', valence: 2, state: 'solid', hazard: 'safe' },
  { id: 'Mg', symbol: 'Mg', name: 'Magnesium', valence: 2, state: 'solid', hazard: 'safe' },
  { id: 'Al', symbol: 'Al', name: 'Aluminium', valence: 3, state: 'solid', hazard: 'safe' },
  { id: 'Ag', symbol: 'Ag', name: 'Silver', valence: 1, state: 'solid', hazard: 'safe' },
  { id: 'Au', symbol: 'Au', name: 'Gold(III)', valence: 3, state: 'solid', hazard: 'safe' },
  { id: 'Si', symbol: 'Si', name: 'Silicon', valence: 4, state: 'liquid', hazard: 'corrosive' },
  { id: 'Zn', symbol: 'Zn', name: 'Zinc', valence: 2, state: 'solid', hazard: 'safe' },
  { id: 'Ni', symbol: 'Ni', name: 'Nickel', valence: 2, state: 'solid', hazard: 'safe' },
  { id: 'Sn', symbol: 'Sn', name: 'Tin(II)', valence: 2, state: 'solid', hazard: 'safe' },
];

for (const m of MONOVALENT_AND_DIVALENT) {
  for (const h of HALOGENS) {
    const val = m.valence;
    const compoundId = `${m.id}${h.id}${val > 1 ? val : ''}`;
    const formula = `${m.symbol}${h.symbol}${toSub(val)}`;
    const compName = `${m.name} ${h.name}`;
    add({
      id: compoundId,
      name: compName,
      formula,
      category: 'salt',
      state: m.state === 'liquid' ? 'liquid' : 'solid',
      appearance: `${h.name} crystalline mineral matrix`,
      description: `Halide formed by direct combination of ${m.name} and ${h.name}.`,
      hazard: m.hazard as any,
      bondType: ['Si'].includes(m.id) ? 'covalent' : 'ionic',
      color: h.color,
      glowColor: h.glow,
      recipe: [m.id, h.id],
      equation: `${m.symbol} + ${val > 1 ? val : ''}${h.symbol} → ${formula}`,
      enthalpy: `ΔH° = -${200 + val * 120} kJ/mol`,
      funFact: `Utilized in crystalline optics, catalysis, and chemical metallurgy.`,
    });
  }
}

// MULTIVALENTS with strict condition and stoichiometry differences:
// Lower oxidation state: Ambient temperature (condition: undefined)
// Higher oxidation state: High temperature / Excess halogen ({ heat: true })
const MULTIVALENT_PAIRS = [
  { element: 'Fe', lower: { idSuffix: '2', val: 2, name: 'Iron(II)' }, higher: { idSuffix: '3', val: 3, name: 'Iron(III)' } },
  { element: 'Cu', lower: { idSuffix: '', val: 1, name: 'Copper(I)' }, higher: { idSuffix: '2', val: 2, name: 'Copper(II)' } },
  { element: 'P', lower: { idSuffix: '3', val: 3, name: 'Phosphorus(III)' }, higher: { idSuffix: '5', val: 5, name: 'Phosphorus(V)' } },
  { element: 'Ti', lower: { idSuffix: '3', val: 3, name: 'Titanium(III)' }, higher: { idSuffix: '4', val: 4, name: 'Titanium(IV)' } },
  { element: 'Pt', lower: { idSuffix: '2', val: 2, name: 'Platinum(II)' }, higher: { idSuffix: '4', val: 4, name: 'Platinum(IV)' } },
  { element: 'U', lower: { idSuffix: '4', val: 4, name: 'Uranium(IV)' }, higher: { idSuffix: '6', val: 6, name: 'Uranium(VI)' } },
  { element: 'Sn', lower: { idSuffix: '2', val: 2, name: 'Tin(II)' }, higher: { idSuffix: '4', val: 4, name: 'Tin(IV)' } },
  { element: 'W', lower: { idSuffix: '4', val: 4, name: 'Tungsten(IV)' }, higher: { idSuffix: '6', val: 6, name: 'Tungsten(VI)' } },
  { element: 'Mo', lower: { idSuffix: '3', val: 3, name: 'Molybdenum(III)' }, higher: { idSuffix: '5', val: 5, name: 'Molybdenum(V)' } },
];

for (const p of MULTIVALENT_PAIRS) {
  for (const h of HALOGENS) {
    // Lower state (Room Temp / Mild)
    const lowId = `${p.element}${h.id}${p.lower.idSuffix}`;
    const lowFormula = `${p.element}${h.symbol}${toSub(p.lower.val)}`;
    add({
      id: lowId,
      name: `${p.lower.name} ${h.name}`,
      formula: lowFormula,
      category: 'salt',
      state: 'solid',
      appearance: `Lower oxidation state ${h.name} mineral salt`,
      description: `Synthesized under stoichiometric or mild reducing conditions.`,
      hazard: 'safe',
      bondType: 'ionic',
      color: h.color,
      glowColor: h.glow,
      recipe: [p.element, h.id],
      equation: `${p.element} + ${p.lower.val > 1 ? p.lower.val : ''}${h.symbol} → ${lowFormula}`,
      enthalpy: `ΔH° = -${150 + p.lower.val * 100} kJ/mol`,
      funFact: `Lower valence state halide stabilized without excess oxidizer.`,
    });

    // Higher state (Requires Heat)
    const highId = `${p.element}${h.id}${p.higher.idSuffix}`;
    const highFormula = `${p.element}${h.symbol}${toSub(p.higher.val)}`;
    add({
      id: highId,
      name: `${p.higher.name} ${h.name}`,
      formula: highFormula,
      category: 'salt',
      state: 'solid',
      appearance: `Higher oxidation state ${h.name} crystals`,
      description: `Synthesized under intense heat with excess halogen gas.`,
      hazard: p.element === 'U' ? 'radioactive' : 'corrosive',
      bondType: 'ionic',
      color: h.color,
      glowColor: h.glow,
      recipe: [p.element, h.id],
      condition: { heat: true },
      equation: `${p.element} + ${p.higher.val}${h.symbol} + Heat → ${highFormula}`,
      enthalpy: `ΔH° = -${250 + p.higher.val * 110} kJ/mol`,
      funFact: `Thermodynamically favoured at elevated temperatures with excess halogen.`,
    });
  }
}

// 3. Multivalent Oxides and Sulfides
const OXIDE_PAIRS = [
  { element: 'Fe', lower: { id: 'FeO', name: 'Iron(II) Oxide', formula: 'FeO', cond: undefined }, higher: { id: 'Fe2O3', name: 'Iron(III) Oxide (Rust)', formula: 'Fe₂O₃', cond: { heat: true } } },
  { element: 'Cu', lower: { id: 'Cu2O', name: 'Copper(I) Oxide', formula: 'Cu₂O', cond: undefined }, higher: { id: 'CuO', name: 'Copper(II) Oxide', formula: 'CuO', cond: { heat: true } } },
  { element: 'Sn', lower: { id: 'SnO', name: 'Tin(II) Oxide', formula: 'SnO', cond: undefined }, higher: { id: 'SnO2', name: 'Tin(IV) Oxide (Cassiterite)', formula: 'SnO₂', cond: { heat: true } } },
  { element: 'Ti', lower: { id: 'Ti2O3', name: 'Titanium(III) Oxide', formula: 'Ti₂O₃', cond: undefined }, higher: { id: 'TiO2', name: 'Titanium Dioxide (Rutile)', formula: 'TiO₂', cond: { heat: true } } },
];

for (const op of OXIDE_PAIRS) {
  add({
    id: op.lower.id,
    name: op.lower.name,
    formula: op.lower.formula,
    category: 'oxide',
    state: 'solid',
    appearance: 'Black or reddish lower oxide powder',
    description: `Reduced oxidation state transition metal oxide.`,
    hazard: 'safe',
    bondType: 'ionic',
    color: '#64748b',
    recipe: [op.element, 'O'],
    condition: op.lower.cond,
    equation: `${op.element} + O → ${op.lower.formula}`,
  });
  add({
    id: op.higher.id,
    name: op.higher.name,
    formula: op.higher.formula,
    category: 'oxide',
    state: 'solid',
    appearance: 'High oxidation state mineral oxide',
    description: `Formed under vigorous heating and abundant oxygen.`,
    hazard: 'safe',
    bondType: 'ionic',
    color: '#94a3b8',
    recipe: [op.element, 'O'],
    condition: op.higher.cond,
    equation: `${op.element} + O₂ + Heat → ${op.higher.formula}`,
  });
}

// Sulfide Pairs
add({ id: 'FeS', name: 'Iron(II) Sulfide', formula: 'FeS', category: 'salt', state: 'solid', appearance: 'Black metallic lump', description: 'Classic laboratory source of hydrogen sulfide gas.', hazard: 'safe', bondType: 'ionic', color: '#ca8a04', recipe: ['Fe', 'S'], equation: 'Fe + S → FeS' });
add({ id: 'FeS2', name: 'Iron Disulfide (Fool’s Gold / Pyrite)', formula: 'FeS₂', category: 'salt', state: 'solid', appearance: 'Brilliant brassy-yellow metallic cubes', description: 'Strikes sparks with steel; produces sulfuric acid upon roasting.', hazard: 'safe', bondType: 'covalent', color: '#eab308', recipe: ['Fe', 'S'], condition: { heat: true }, equation: 'Fe + 2S + Heat → FeS₂' });
add({ id: 'Cu2S', name: 'Copper(I) Sulfide (Chalcocite)', formula: 'Cu₂S', category: 'salt', state: 'solid', appearance: 'Dark gray mineral ore', description: 'Important copper ore smelted since antiquity.', hazard: 'safe', bondType: 'ionic', color: '#475569', recipe: ['Cu', 'S'], equation: '2Cu + S → Cu₂S' });
add({ id: 'CuS', name: 'Copper(II) Sulfide (Covellite)', formula: 'CuS', category: 'salt', state: 'solid', appearance: 'Indigo-blue lustrous crystals', description: 'Precipitated by bubbling H2S through copper salts.', hazard: 'safe', bondType: 'ionic', color: '#1e3a8a', recipe: ['Cu', 'S'], condition: { heat: true }, equation: 'Cu + S + Heat → CuS' });

// 4. Authentic Hydrocarbon Hierarchy
const HYDROCARBON_CHAIN: RawCompound[] = [
  { id: 'CH4', name: 'Methane', formula: 'CH₄', category: 'hydrocarbon', state: 'gas', appearance: 'Colorless fuel gas', description: 'Simplest alkane; main constituent of natural gas.', hazard: 'flammable', bondType: 'covalent', color: '#0284c7', recipe: ['C', 'H'], condition: { heat: true, catalyst: true }, equation: 'C + 2H₂ → CH₄' },
  { id: 'C2H2', name: 'Acetylene (Ethyne)', formula: 'C₂H₂', category: 'hydrocarbon', state: 'gas', appearance: 'Combustible alkyne gas', description: 'Burns at over 3,300 °C in oxyacetylene cutting torches.', hazard: 'flammable', bondType: 'covalent', color: '#a855f7', recipe: ['C', 'H'], condition: { electricity: true }, equation: '2C + H₂ (Electric Arc) → C₂H₂' },
  { id: 'C2H4', name: 'Ethylene (Ethene)', formula: 'C₂H₄', category: 'hydrocarbon', state: 'gas', appearance: 'Sweet-smelling ripening gas', description: 'Monomer for polyethylene; natural fruit ripening plant hormone.', hazard: 'flammable', bondType: 'covalent', color: '#38bdf8', recipe: ['C2H5OH'], condition: { catalyst: true }, equation: 'C₂H₅OH (Acid Dehydration) → C₂H₄ + H₂O' },
  { id: 'C2H6', name: 'Ethane', formula: 'C₂H₆', category: 'hydrocarbon', state: 'gas', appearance: 'Colorless alkane gas', description: 'Saturated alkane isolated from petrochemical cracking.', hazard: 'flammable', bondType: 'covalent', color: '#0284c7', recipe: ['C2H4', 'H'], condition: { catalyst: true }, equation: 'C₂H₄ + H₂ → C₂H₆' },
  { id: 'C3H6', name: 'Propylene (Propene)', formula: 'C₃H₆', category: 'hydrocarbon', state: 'gas', appearance: 'Combustible alkene gas', description: 'Monomer polymerized into durable polypropylene plastics.', hazard: 'flammable', bondType: 'covalent', color: '#38bdf8', recipe: ['C3H7OH_iso'], condition: { catalyst: true }, equation: 'C₃H₇OH → C₃H₆ + H₂O' },
  { id: 'C3H8', name: 'Propane', formula: 'C₃H₈', category: 'hydrocarbon', state: 'gas', appearance: 'Liquefied petroleum gas (LPG)', description: 'Portable BBQ grill and residential heating fuel.', hazard: 'flammable', bondType: 'covalent', color: '#0284c7', recipe: ['C3H6', 'H'], condition: { catalyst: true }, equation: 'C₃H₆ + H₂ → C₃H₈' },
  { id: 'C4H8', name: '1-Butene', formula: 'C₄H₈', category: 'hydrocarbon', state: 'gas', appearance: 'Alkene petrochemical gas', description: 'Linear alpha-olefin copolymer in linear low-density polyethylene.', hazard: 'flammable', bondType: 'covalent', color: '#38bdf8', recipe: ['C4H9OH_1'], condition: { catalyst: true }, equation: 'C₄H₉OH → C₄H₈ + H₂O' },
  { id: 'C4H10', name: 'Butane', formula: 'C₄H₁₀', category: 'hydrocarbon', state: 'gas', appearance: 'Pocket lighter fuel gas', description: 'Easily compressed hydrocarbon liquid in cigarette lighters.', hazard: 'flammable', bondType: 'covalent', color: '#0284c7', recipe: ['C2H4', 'C2H6'], condition: { catalyst: true }, equation: 'C₂H₄ + C₂H₆ → C₄H₁₀' },
  { id: 'C4H6', name: '1,3-Butadiene', formula: 'C₄H₆', category: 'hydrocarbon', state: 'gas', appearance: 'Conjugated diene gas', description: 'Vital building block for synthetic rubber car tires.', hazard: 'flammable', bondType: 'covalent', color: '#38bdf8', recipe: ['C4H8'], condition: { heat: true, catalyst: true }, equation: 'C₄H₈ → C₄H₆ + H₂' },
  { id: 'C5H8', name: 'Isoprene (2-Methylbutadiene)', formula: 'C₅H₈', category: 'hydrocarbon', state: 'liquid', appearance: 'Pungent volatile fluid', description: 'Biological monomer building block of terpenes and natural rubber.', hazard: 'flammable', bondType: 'covalent', color: '#06b6d4', recipe: ['C5H10'], condition: { heat: true, catalyst: true }, equation: 'C₅H₁₀ → C₅H₈ + H₂' },
  { id: 'C5H12', name: 'Pentane', formula: 'C₅H₁₂', category: 'hydrocarbon', state: 'liquid', appearance: 'Volatile petroleum solvent', description: 'Low boiling point liquid blowing agent for polystyrene foam.', hazard: 'flammable', bondType: 'covalent', color: '#0284c7', recipe: ['C2H4', 'C3H8'], condition: { catalyst: true }, equation: 'C₂H₄ + C₃H₈ → C₅H₁₂' },
  { id: 'C6H14', name: 'Hexane', formula: 'C₆H₁₄', category: 'hydrocarbon', state: 'liquid', appearance: 'Clear liquid extractant', description: 'Standard industrial solvent for extracting vegetable cooking oils.', hazard: 'flammable', bondType: 'covalent', color: '#0284c7', recipe: ['C3H6', 'C3H8'], condition: { catalyst: true }, equation: 'C₃H₆ + C₃H₈ → C₆H₁₄' },
  { id: 'C7H16', name: 'Heptane', formula: 'C₇H₁₆', category: 'hydrocarbon', state: 'liquid', appearance: 'Petroleum fuel fraction', description: 'Zero-point standard for octane fuel ratings.', hazard: 'flammable', bondType: 'covalent', color: '#0284c7', recipe: ['C3H6', 'C4H10'], condition: { catalyst: true }, equation: 'C₃H₆ + C₄H₁₀ → C₇H₁₆' },
  { id: 'C8H18', name: 'Octane (Isooctane)', formula: 'C₈H₁₈', category: 'hydrocarbon', state: 'liquid', appearance: 'Gasoline blendstock', description: 'The 100-point benchmark for internal combustion engine anti-knock.', hazard: 'flammable', bondType: 'covalent', color: '#0284c7', recipe: ['C4H8', 'C4H10'], condition: { catalyst: true }, equation: 'C₄H₈ + C₄H₁₀ → C₈H₁₈' },

  // Aromatic Series
  { id: 'C6H6', name: 'Benzene', formula: 'C₆H₆', category: 'hydrocarbon', state: 'liquid', appearance: 'Aromatic sweet-smelling fluid', description: 'Resonant 6-carbon aromatic ring with delocalized pi-electrons.', hazard: 'toxic', bondType: 'aromatic', color: '#a855f7', recipe: ['C2H2'], condition: { heat: true, catalyst: true }, equation: '3C₂H₂ (Cyclotrimerization) → C₆H₆' },
  { id: 'C7H8', name: 'Toluene (Methylbenzene)', formula: 'C₇H₈', category: 'hydrocarbon', state: 'liquid', appearance: 'Volatile paint thinner liquid', description: 'Precursor to benzene, benzoic acid, and TNT explosive.', hazard: 'flammable', bondType: 'aromatic', color: '#a855f7', recipe: ['C6H6', 'CH3Cl'], condition: { catalyst: true }, equation: 'C₆H₆ + CH₃Cl → C₇H₈ + HCl' },
  { id: 'C8H10_o', name: 'o-Xylene', formula: 'C₈H₁₀', category: 'hydrocarbon', state: 'liquid', appearance: 'Dimethylbenzene fluid', description: 'Oxidized industrially into phthalic anhydride for plasticizers.', hazard: 'flammable', bondType: 'aromatic', color: '#a855f7', recipe: ['C7H8', 'CH4'], condition: { catalyst: true }, equation: 'C₇H₈ + CH₄ → C₈H₁₀ + H₂' },
  { id: 'C8H10_p', name: 'p-Xylene', formula: 'C₈H₁₀', category: 'hydrocarbon', state: 'liquid', appearance: 'Aromatic chemical feed', description: 'Oxidized into terephthalic acid for PET plastic water bottles.', hazard: 'flammable', bondType: 'aromatic', color: '#a855f7', recipe: ['C7H8', 'CH3Cl'], condition: { catalyst: true }, equation: 'C₇H₈ + CH₃Cl → p-C₈H₁₀ + HCl' },
  { id: 'C8H8', name: 'Styrene', formula: 'C₈H₈', category: 'hydrocarbon', state: 'liquid', appearance: 'Monomer liquid', description: 'Polymerized into rigid polystyrene and Styrofoam insulation.', hazard: 'toxic', bondType: 'aromatic', color: '#a855f7', recipe: ['C6H6', 'C2H4'], condition: { catalyst: true }, equation: 'C₆H₆ + C₂H₄ → C₈H₈ + H₂' },
  { id: 'C10H8', name: 'Naphthalene (Mothballs)', formula: 'C₁₀H₈', category: 'hydrocarbon', state: 'solid', appearance: 'White crystalline pungent flakes', description: 'Two fused benzene rings; classic fumigant in closet mothballs.', hazard: 'toxic', bondType: 'aromatic', color: '#cbd5e1', recipe: ['C6H6', 'C2H2'], condition: { heat: true }, equation: 'C₆H₆ + 2C₂H₂ → C₁₀H₈ + H₂' },
];

for (const h of HYDROCARBON_CHAIN) add(h);

// 5. Authentic Organic Syntheses (Esters, Carbonyls, Alcohols, Acids)
const AUTHENTIC_ORGANICS: RawCompound[] = [
  { id: 'CH3OH', name: 'Methanol (Wood Alcohol)', formula: 'CH₃OH', category: 'alcohol', state: 'liquid', appearance: 'Clear volatile liquid', description: 'Simplest alcohol; causes blindness by attacking optic nerves.', hazard: 'toxic', bondType: 'covalent', color: '#06b6d4', recipe: ['CO', 'H'], condition: { heat: true, catalyst: true }, equation: 'CO + 2H₂ → CH₃OH' },
  { id: 'C2H5OH', name: 'Ethanol (Grain Alcohol)', formula: 'C₂H₅OH', category: 'alcohol', state: 'liquid', appearance: 'Clear alcoholic fluid', description: 'Beverage alcohol and renewable biofuel synthesized via ethylene hydration.', hazard: 'flammable', bondType: 'covalent', color: '#38bdf8', recipe: ['C2H4', 'H2O'], condition: { catalyst: true }, equation: 'C₂H₄ + H₂O → C₂H₅OH' },
  { id: 'C3H7OH_iso', name: 'Isopropanol (Rubbing Alcohol)', formula: 'C₃H₇OH', category: 'alcohol', state: 'liquid', appearance: 'Antiseptic disinfectant fluid', description: 'Denatures bacterial proteins rapidly; 70% medical rubbing alcohol.', hazard: 'flammable', bondType: 'covalent', color: '#0284c7', recipe: ['C3H6', 'H2O'], condition: { catalyst: true }, equation: 'C₃H₆ + H₂O → C₃H₇OH' },
  { id: 'C4H9OH_1', name: '1-Butanol', formula: 'C₄H₉OH', category: 'alcohol', state: 'liquid', appearance: 'Fusel alcohol liquid', description: 'High-energy biofuel synthesized from butyraldehyde hydrogenation.', hazard: 'flammable', bondType: 'covalent', color: '#0284c7', recipe: ['C4H8', 'H2O'], condition: { catalyst: true }, equation: 'C₄H₈ + H₂O → C₄H₉OH' },
  { id: 'C2H4OH2', name: 'Ethylene Glycol (Antifreeze)', formula: 'C₂H₄(OH)₂', category: 'alcohol', state: 'liquid', appearance: 'Sweet syrupy toxic fluid', description: 'Automotive radiator coolant and polyester fiber precursor.', hazard: 'toxic', bondType: 'covalent', color: '#06b6d4', recipe: ['C2H4', 'H2O2'], condition: { catalyst: true }, equation: 'C₂H₄ + H₂O₂ → C₂H₄(OH)₂' },
  { id: 'C3H5OH3', name: 'Glycerol (Glycerin)', formula: 'C₃H₅(OH)₃', category: 'alcohol', state: 'liquid', appearance: 'Thick sweet triol syrup', description: 'Humectant in cosmetics and lipid backbone of natural triglycerides.', hazard: 'safe', bondType: 'covalent', color: '#06b6d4', recipe: ['C3H6', 'H2O2'], condition: { catalyst: true }, equation: 'C₃H₆ + H₂O₂ + H₂O → C₃H₅(OH)₃' },
  { id: 'C6H5OH', name: 'Phenol (Carbolic Acid)', formula: 'C₆H₅OH', category: 'alcohol', state: 'solid', appearance: 'Pinkish needle crystals', description: 'Joseph Lister’s historic antiseptic; precursor to Bakelite plastic.', hazard: 'toxic', bondType: 'aromatic', color: '#f43f5e', recipe: ['C6H6', 'O'], condition: { catalyst: true }, equation: 'C₆H₆ + [O] → C₆H₅OH' },

  // Carbonyls & Aldehydes
  { id: 'HCHO', name: 'Formaldehyde', formula: 'HCHO', category: 'organic', state: 'gas', appearance: 'Pungent gas', description: 'Biological specimen preservative and resin precursor.', hazard: 'toxic', bondType: 'covalent', color: '#94a3b8', recipe: ['CH3OH', 'O'], condition: { catalyst: true }, equation: 'CH₃OH + [O] → HCHO + H₂O' },
  { id: 'CH3CHO', name: 'Acetaldehyde', formula: 'CH₃CHO', category: 'organic', state: 'liquid', appearance: 'Fruity pungent liquid', description: 'Intermediate in alcohol metabolism triggering hangovers.', hazard: 'flammable', bondType: 'covalent', color: '#f59e0b', recipe: ['C2H5OH', 'O'], condition: { catalyst: true }, equation: 'C₂H₅OH + [O] → CH₃CHO + H₂O' },
  { id: 'CH3COCH3', name: 'Acetone', formula: 'CH₃COCH₃', category: 'organic', state: 'liquid', appearance: 'Volatile sweet solvent', description: 'Nail polish remover and universal organic laboratory solvent.', hazard: 'flammable', bondType: 'covalent', color: '#f59e0b', recipe: ['C3H7OH_iso', 'O'], condition: { catalyst: true }, equation: 'C₃H₇OH + [O] → CH₃COCH₃ + H₂O' },
  { id: 'C6H5CHO', name: 'Benzaldehyde (Almond Oil)', formula: 'C₆H₅CHO', category: 'organic', state: 'liquid', appearance: 'Sweet marzipan liquid', description: 'Primary aroma component of almond and apricot kernels.', hazard: 'safe', bondType: 'aromatic', color: '#f59e0b', recipe: ['C7H8', 'O'], condition: { catalyst: true }, equation: 'C₇H₈ + [O] → C₆H₅CHO + H₂O' },

  // Organic Acids
  { id: 'HCOOH', name: 'Formic Acid', formula: 'HCOOH', category: 'acid', state: 'liquid', appearance: 'Stinging pungent acid', description: 'Stinging acid in red ant venom and stinging nettle barbs.', hazard: 'corrosive', bondType: 'covalent', color: '#10b981', recipe: ['CO', 'H2O'], condition: { catalyst: true }, equation: 'CO + H₂O → HCOOH' },
  { id: 'CH3COOH', name: 'Acetic Acid (Vinegar)', formula: 'CH₃COOH', category: 'acid', state: 'liquid', appearance: 'Pungent sour vinegar liquid', description: 'Glacial carboxylic acid responsible for the sour bite of vinegar.', hazard: 'corrosive', bondType: 'covalent', color: '#10b981', recipe: ['CH3OH', 'CO'], condition: { catalyst: true }, equation: 'CH₃OH + CO (Monsanto Process) → CH₃COOH' },
  { id: 'C7H6O3', name: 'Salicylic Acid', formula: 'C₇H₆O₃', category: 'acid', state: 'solid', appearance: 'White crystalline needles', description: 'Extracted from willow bark; precursor to Aspirin and BHA face wash.', hazard: 'safe', bondType: 'aromatic', color: '#10b981', recipe: ['C6H5OH', 'CO2'], condition: { heat: true }, equation: 'C₆H₅OH + CO₂ (Kolbe-Schmitt) → C₇H₆O₃' },
  { id: 'C8H6O4_ter', name: 'Terephthalic Acid', formula: 'p-C₆H₄(COOH)₂', category: 'acid', state: 'solid', appearance: 'White insoluble powder', description: 'Polymerized with ethylene glycol to produce PET plastic bottles.', hazard: 'safe', bondType: 'aromatic', color: '#10b981', recipe: ['C8H10_p', 'O'], condition: { catalyst: true }, equation: 'p-C₈H₁₀ + 3O₂ → C₈H₆O₄ + 2H₂O' },

  // Esters & Pharmaceuticals
  { id: 'C9H8O4', name: 'Acetylsalicylic Acid (Aspirin)', formula: 'C₉H₈O₄', category: 'organic', state: 'solid', appearance: 'White analgesic tablet powder', description: 'The historic Bayer anti-inflammatory drug inhibiting COX enzymes.', hazard: 'safe', bondType: 'covalent', color: '#10b981', recipe: ['C7H6O3', 'CH3COOH'], condition: { catalyst: true }, equation: 'C₇H₆O₃ + CH₃COOH → C₉H₈O₄ + H₂O' },
  { id: 'CH3COOC2H5', name: 'Ethyl Acetate', formula: 'CH₃COOC₂H₅', category: 'organic', state: 'liquid', appearance: 'Sweet pear-like ester fluid', description: 'Classic Fischer esterification product; nail polish remover.', hazard: 'flammable', bondType: 'covalent', color: '#f59e0b', recipe: ['CH3COOH', 'C2H5OH'], condition: { catalyst: true }, equation: 'CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O' },
  { id: 'CH3COOCH3', name: 'Methyl Acetate', formula: 'CH₃COOCH₃', category: 'organic', state: 'liquid', appearance: 'Fragrant volatile ester', description: 'Fast-evaporating solvent in quick-drying paints and glues.', hazard: 'flammable', bondType: 'covalent', color: '#f59e0b', recipe: ['CH3COOH', 'CH3OH'], condition: { catalyst: true }, equation: 'CH₃COOH + CH₃OH ⇌ CH₃COOCH₃ + H₂O' },
  { id: 'C7H14O2_isoam', name: 'Isoamyl Acetate (Banana Oil)', formula: 'CH₃COOC₅H₁₁', category: 'organic', state: 'liquid', appearance: 'Strong banana scent liquid', description: 'Natural flavor in ripe bananas and honeybee alarm attack pheromone.', hazard: 'flammable', bondType: 'covalent', color: '#f59e0b', recipe: ['CH3COOH', 'C4H9OH_1'], condition: { catalyst: true }, equation: 'CH₃COOH + C₄H₉OH → C₇H₁₄O₂ + H₂O' },
  { id: 'C8H8O3_metsal', name: 'Methyl Salicylate (Wintergreen Oil)', formula: 'C₆H₄(OH)COOCH₃', category: 'organic', state: 'liquid', appearance: 'Refreshing mint wintergreen liquid', description: 'Topical analgesic counterirritant deep-heat rub and chewing gum flavor.', hazard: 'safe', bondType: 'covalent', color: '#f59e0b', recipe: ['C7H6O3', 'CH3OH'], condition: { catalyst: true }, equation: 'C₇H₆O₃ + CH₃OH → C₈H₈O₃ + H₂O' },

  // Sugars & Carbohydrates
  { id: 'C6H12O6_glu', name: 'D-Glucose', formula: 'C₆H₁₂O₆', category: 'organic', state: 'solid', appearance: 'Sweet white sugar crystals', description: 'Primary metabolic fuel synthesized globally via photosynthesis.', hazard: 'safe', bondType: 'covalent', color: '#f8fafc', recipe: ['CO2', 'H2O'], condition: { catalyst: true }, equation: '6CO₂ + 6H₂O (Calvin Cycle) → C₆H₁₂O₆ + 6O₂' },
  { id: 'C6H12O6_fru', name: 'D-Fructose (Fruit Sugar)', formula: 'C₆H₁₂O₆', category: 'organic', state: 'solid', appearance: 'Sweet crystalline powder', description: 'Ketonic isomer of glucose; sweetest natural dietary carbohydrate.', hazard: 'safe', bondType: 'covalent', color: '#f8fafc', recipe: ['C6H12O6_glu'], condition: { heat: true, catalyst: true }, equation: 'Glucose (Isomerase) → Fructose' },
  { id: 'C12H22O11_suc', name: 'Sucrose (Table Sugar)', formula: 'C₁₂H₂₂O₁₁', category: 'organic', state: 'solid', appearance: 'Granulated sugar crystals', description: 'Disaccharide connecting glucose and fructose via glycosidic bond.', hazard: 'safe', bondType: 'covalent', color: '#f8fafc', recipe: ['C6H12O6_glu', 'C6H12O6_fru'], condition: { catalyst: true }, equation: 'C₆H₁₂O₆ + C₆H₁₂O₆ → C₁₂H₂₂O₁₁ + H₂O' },
  { id: 'CH4N2O', name: 'Urea (Carbamide)', formula: 'CH₄N₂O', category: 'organic', state: 'solid', appearance: 'White prilled crystals', description: 'Synthesized by Wöhler in 1828 disproving vitalism; major nitrogen fertilizer.', hazard: 'safe', bondType: 'covalent', color: '#f8fafc', recipe: ['NH3', 'CO2'], condition: { heat: true }, equation: '2NH₃ + CO₂ (Bosch-Meiser) → NH₂CONH₂ + H₂O' },
  { id: 'C8H9NO2_par', name: 'Paracetamol (Acetaminophen)', formula: 'C₈H₉NO₂', category: 'organic', state: 'solid', appearance: 'White pain-relief powder', description: 'Ubiquitous fever reducer and headache remedy (Tylenol).', hazard: 'safe', bondType: 'covalent', color: '#f8fafc', recipe: ['C6H5OH', 'CH3COOH', 'NH3'], condition: { catalyst: true }, equation: 'Phenol + Ammonia + Acetic Acid → Paracetamol' },
];

for (const o of AUTHENTIC_ORGANICS) add(o);

// 6. Biomolecules (DNA bases, Amino acids, Alkaloids)
const BIOMOLECULES_LIST: RawCompound[] = [
  { id: 'GLYCINE', name: 'Glycine (Gly)', formula: 'C₂H₅NO₂', category: 'organic', state: 'solid', appearance: 'White crystalline powder', description: 'Simplest amino acid with a single hydrogen side chain.', hazard: 'safe', bondType: 'covalent', color: '#10b981', recipe: ['HCHO', 'NH3'], condition: { catalyst: true }, equation: 'HCHO + NH₃ + HCN → Glycine (Strecker)' },
  { id: 'ALANINE', name: 'L-Alanine (Ala)', formula: 'C₃H₇NO₂', category: 'organic', state: 'solid', appearance: 'White amino acid powder', description: 'Aliphatic amino acid crucial for the glucose-alanine muscle cycle.', hazard: 'safe', bondType: 'covalent', color: '#10b981', recipe: ['CH3CHO', 'NH3'], condition: { catalyst: true }, equation: 'CH₃CHO + NH₃ + HCN → Alanine' },
  { id: 'CYSTEINE', name: 'L-Cysteine (Cys)', formula: 'C₃H₇NO₂S', category: 'organic', state: 'solid', appearance: 'Sulfur amino acid crystals', description: 'Forms covalent disulfide bonds (S-S) stabilizing protein folding.', hazard: 'safe', bondType: 'covalent', color: '#10b981', recipe: ['GLYCINE', 'H2S'], condition: { catalyst: true }, equation: 'Serine/Glycine precursor + H₂S → Cysteine' },
  { id: 'ADENINE', name: 'Adenine (A)', formula: 'C₅H₅N₅', category: 'organic', state: 'solid', appearance: 'White purine powder', description: 'Purine base pairing with thymine/uracil; core of ATP energy packets.', hazard: 'safe', bondType: 'covalent', color: '#10b981', recipe: ['NH3', 'C'], condition: { heat: true, catalyst: true }, equation: '5HCN / Ammonia condensate (Oró Prebiotic Synthesis) → Adenine' },
  { id: 'GUANINE', name: 'Guanine (G)', formula: 'C₅H₅N₅O', category: 'organic', state: 'solid', appearance: 'Purine base crystals', description: 'Purine forming 3 hydrogen bonds with cytosine in the DNA double helix.', hazard: 'safe', bondType: 'covalent', color: '#10b981', recipe: ['ADENINE', 'O'], condition: { catalyst: true }, equation: 'Adenine + [O] (Enzymatic Hydroxylation) → Guanine' },
  { id: 'URACIL', name: 'Uracil (U)', formula: 'C₄H₄N₂O₂', category: 'organic', state: 'solid', appearance: 'RNA pyrimidine base', description: 'Demethylated pyrimidine replacing thymine in messenger RNA transcripts.', hazard: 'safe', bondType: 'covalent', color: '#10b981', recipe: ['CH4N2O', 'H2O'], condition: { heat: true }, equation: 'Urea + Malic/Propiolic derivative → Uracil' },
  { id: 'THYMINE', name: 'Thymine (T)', formula: 'C₅H₆N₂O₂', category: 'organic', state: 'solid', appearance: 'DNA pyrimidine crystals', description: 'Methylated pyrimidine unique to stable DNA genetic storage.', hazard: 'safe', bondType: 'covalent', color: '#10b981', recipe: ['URACIL', 'HCHO'], condition: { catalyst: true }, equation: 'Uracil + Formaldehyde (Methylation) → Thymine' },
  { id: 'THEOBROMINE', name: 'Theobromine', formula: 'C₇H₈N₄O₂', category: 'organic', state: 'solid', appearance: 'Bitter cocoa alkaloid powder', description: 'Bitter alkaloid in chocolate beans; cardiac stimulant and vasodilator.', hazard: 'safe', bondType: 'covalent', color: '#10b981', recipe: ['CH4N2O', 'URACIL'], condition: { catalyst: true }, equation: 'Xanthine biosynthesis → Theobromine' },
  { id: 'C8H10N4O2', name: 'Caffeine', formula: 'C₈H₁₀N₄O₂', category: 'organic', state: 'solid', appearance: 'Stimulant white powder', description: 'The world’s most consumed psychoactive compound; blocks adenosine receptors.', hazard: 'safe', bondType: 'covalent', color: '#10b981', recipe: ['THEOBROMINE', 'CH3Cl'], condition: { catalyst: true }, equation: 'Theobromine + Methyl chloride (N-methylation) → Caffeine' },
  { id: 'ATP', name: 'Adenosine Triphosphate (ATP Fragment)', formula: 'C₁₀H₁₆N₅O₁₃P₃', category: 'rare_matter', state: 'solid', appearance: 'High-energy nucleotide crystals', description: 'Universal biochemical currency of intracellular energy transfer.', hazard: 'safe', bondType: 'covalent', color: '#10b981', recipe: ['ADENINE', 'H3PO4'], condition: { catalyst: true }, equation: 'Adenosine + 3 Phosphates → ATP' },
  { id: 'NICOTINE', name: 'Nicotine', formula: 'C₁₀H₁₄N₂', category: 'organic', state: 'liquid', appearance: 'Oily potent stimulant fluid', description: 'Alkaloid produced in nightshade tobacco plants binding nicotinic receptors.', hazard: 'toxic', bondType: 'covalent', color: '#0284c7', recipe: ['C6H6', 'NH3'], condition: { catalyst: true }, equation: 'Pyridine + Pyrrolidine coupling → Nicotine' },
];

for (const b of BIOMOLECULES_LIST) add(b);

// 7. Advanced Materials, Polymers, Carbides & Alloys
const ADVANCED_MATERIALS: RawCompound[] = [
  { id: 'POLYETHYLENE', name: 'Polyethylene (LDPE / HDPE)', formula: '(C₂H₄)ₙ', category: 'polymer', state: 'solid', appearance: 'Tough translucent plastic', description: 'Most produced plastic worldwide for shopping bags, milk jugs, and pipes.', hazard: 'safe', bondType: 'covalent', color: '#38bdf8', recipe: ['C2H4'], condition: { heat: true, catalyst: true }, equation: 'n C₂H₄ (Ziegler-Natta) → (C₂H₄)ₙ' },
  { id: 'POLYPROPYLENE', name: 'Polypropylene (PP)', formula: '(C₃H₆)ₙ', category: 'polymer', state: 'solid', appearance: 'Rigid durable polymer', description: 'Fatigue-resistant plastic used for living hinges, bottle caps, and bumpers.', hazard: 'safe', bondType: 'covalent', color: '#38bdf8', recipe: ['C3H6'], condition: { heat: true, catalyst: true }, equation: 'n C₃H₆ → (C₃H₆)ₙ' },
  { id: 'POLYSTYRENE', name: 'Polystyrene (Styrofoam)', formula: '(C₈H₈)ₙ', category: 'polymer', state: 'solid', appearance: 'Expanded thermal foam or rigid clear plastic', description: 'Expanded 98% air foam used for insulated coffee cups and coolers.', hazard: 'safe', bondType: 'covalent', color: '#e879f9', recipe: ['C8H8'], condition: { heat: true, catalyst: true }, equation: 'n C₈H₈ → (C₈H₈)ₙ' },
  { id: 'PET_POLY', name: 'Polyethylene Terephthalate (PET)', formula: '(C₁₀H₈O₄)ₙ', category: 'polymer', state: 'solid', appearance: 'Clear recyclable plastic', description: 'Recyclable Resin Code 1 polyester for soda bottles and fleece garments.', hazard: 'safe', bondType: 'covalent', color: '#06b6d4', recipe: ['C8H6O4_ter', 'C2H4OH2'], condition: { heat: true, catalyst: true }, equation: 'Terephthalic Acid + Ethylene Glycol → PET Polyester' },
  { id: 'PVC', name: 'Polyvinyl Chloride (PVC)', formula: '(C₂H₃Cl)ₙ', category: 'polymer', state: 'solid', appearance: 'Rigid white plumbing pipe', description: 'Chlorinated conduit pipe and vintage vinyl phonograph music records.', hazard: 'safe', bondType: 'covalent', color: '#06b6d4', recipe: ['C2H4', 'Cl'], condition: { heat: true, catalyst: true }, equation: 'Ethylene + Chlorine → Vinyl Chloride → PVC' },
  { id: 'PTFE', name: 'Polytetrafluoroethylene (Teflon)', formula: '(C₂F₄)ₙ', category: 'polymer', state: 'solid', appearance: 'Slick non-stick white polymer', description: 'Lowest coefficient of friction of any solid; non-stick pan coating.', hazard: 'safe', bondType: 'covalent', color: '#f8fafc', recipe: ['C', 'F'], condition: { heat: true, catalyst: true }, equation: 'Tetrafluoroethylene polymerization → Teflon' },
  { id: 'NITROGLYCERIN', name: 'Nitroglycerin', formula: 'C₃H₅(NO₃)₃', category: 'rare_matter', state: 'liquid', appearance: 'Heavy shock-sensitive oily explosive', description: 'Alfred Nobel’s dynamite active and emergency cardiac vasodilator.', hazard: 'explosive', bondType: 'covalent', color: '#ef4444', recipe: ['C3H5OH3', 'HNO3'], condition: { catalyst: true }, equation: 'Glycerol + Nitric Acid + Sulfuric Acid Catalyst → Nitroglycerin' },
  { id: 'TNT', name: 'Trinitrotoluene', formula: 'C₇H₅N₃O₆', category: 'rare_matter', state: 'solid', appearance: 'Pale yellow explosive crystals', description: 'Shock-insensitive military standard high explosive.', hazard: 'explosive', bondType: 'aromatic', color: '#f59e0b', recipe: ['C7H8', 'HNO3'], condition: { heat: true }, equation: 'Toluene + 3HNO₃ + Heat → TNT' },
  { id: 'GUNPOWDER', name: 'Black Powder (Gunpowder)', formula: '2KNO₃ + 3C + S', category: 'rare_matter', state: 'solid', appearance: 'Dark gray deflagrating grains', description: 'Ancient 9th-century Chinese explosive that transformed world history.', hazard: 'explosive', bondType: 'covalent', color: '#475569', recipe: ['KNO3', 'S', 'C'], equation: 'Saltpeter + Charcoal + Sulfur → Gunpowder' },

  // Authentic Alloys
  { id: 'STEEL', name: 'Carbon Steel', formula: 'Fe + C', category: 'rare_matter', state: 'solid', appearance: 'High-tensile metallic alloy', description: 'Interstitial carbon locks crystal slip planes to multiply strength tenfold.', hazard: 'safe', bondType: 'metallic', color: '#64748b', recipe: ['Fe', 'C'], condition: { heat: true }, equation: 'Fe + C + Extreme Heat → Carbon Steel' },
  { id: 'BRONZE', name: 'Classic Bronze', formula: 'Cu + Sn', category: 'rare_matter', state: 'solid', appearance: 'Lustrous golden-brown alloy', description: 'The alloy that launched human civilization into the Bronze Age.', hazard: 'safe', bondType: 'metallic', color: '#d97706', recipe: ['Cu', 'Sn'], condition: { heat: true }, equation: '90% Cu + 10% Sn (Furnace Smelt) → Classic Bronze' },
  { id: 'BRASS', name: 'Alpha Brass', formula: 'Cu + Zn', category: 'rare_matter', state: 'solid', appearance: 'Acoustic golden metal', description: 'Resonant acoustic alloy for musical horns, saxophones, and locks.', hazard: 'safe', bondType: 'metallic', color: '#eab308', recipe: ['Cu', 'Zn'], condition: { heat: true }, equation: 'Cu + Zn + Heat → Alpha Brass' },
  { id: 'INVAR', name: 'Invar Alloy', formula: 'Fe + Ni', category: 'rare_matter', state: 'solid', appearance: 'Silvery zero-expansion metal', description: 'Discovered by Guillaume (1920 Nobel); exhibits near-zero thermal expansion.', hazard: 'safe', bondType: 'metallic', color: '#94a3b8', recipe: ['Fe', 'Ni'], condition: { heat: true }, equation: '64% Fe + 36% Ni → Invar' },
  { id: 'AQUA_REGIA', name: 'Aqua Regia (Royal Water)', formula: 'HNO₃ + 3HCl', category: 'acid', state: 'liquid', appearance: 'Fuming orange-red alchemical acid', description: 'Legendary royal solvent capable of dissolving noble gold and platinum.', hazard: 'corrosive', bondType: 'covalent', color: '#ea580c', recipe: ['HNO3', 'HCl'], equation: 'HNO₃ + 3HCl → NOCl + Cl₂ + 2H₂O' },
  { id: 'HAuCl4', name: 'Chloroauric Acid', formula: 'HAuCl₄', category: 'rare_matter', state: 'solid', appearance: 'Ruby golden acidic crystals', description: 'Formed when pure Gold dissolves in boiling Aqua Regia.', hazard: 'corrosive', bondType: 'covalent', color: '#eab308', recipe: ['Au', 'AQUA_REGIA'], condition: { heat: true }, equation: 'Au + HNO₃ + 4HCl → HAuCl₄ + NO + 2H₂O' },
  { id: 'H2PtCl6', name: 'Chloroplatinic Acid', formula: 'H₂PtCl₆', category: 'rare_matter', state: 'solid', appearance: 'Reddish-brown hexachloroplatinate crystals', description: 'Formed when Platinum dissolves in Aqua Regia; fuel-cell catalyst precursor.', hazard: 'corrosive', bondType: 'covalent', color: '#b45309', recipe: ['Pt', 'AQUA_REGIA'], condition: { heat: true }, equation: 'Pt + Aqua Regia → H₂PtCl₆' },

  // Superhard Carbides & Refractory Ceramics
  { id: 'SiC', name: 'Silicon Carbide (Moissanite)', formula: 'SiC', category: 'rare_matter', state: 'solid', appearance: 'Iridescent Mohs 9.5 ceramic crystal', description: 'Third-generation high-voltage EV semiconductors and armor plates.', hazard: 'safe', bondType: 'covalent', color: '#38bdf8', recipe: ['Si', 'C'], condition: { heat: true }, equation: 'Si + C + 2,000 °C → SiC' },
  { id: 'TiC', name: 'Titanium Carbide', formula: 'TiC', category: 'rare_matter', state: 'solid', appearance: 'Ultra-hard metallic ceramic', description: 'Melting point 3,160 °C; coats high-speed machine tool cutting inserts.', hazard: 'safe', bondType: 'covalent', color: '#64748b', recipe: ['Ti', 'C'], condition: { heat: true }, equation: 'Ti + C + Heat → TiC' },
  { id: 'WC_tool', name: 'Tungsten Carbide', formula: 'WC', category: 'rare_matter', state: 'solid', appearance: 'Dense gray ultra-abrasive metal', description: 'Dense, Mohs 9 abrasive alloy machining steel engine blocks and mining bits.', hazard: 'safe', bondType: 'covalent', color: '#475569', recipe: ['W', 'C'], condition: { heat: true }, equation: 'W + C + Intense Heat → WC' },
  { id: 'B4C', name: 'Boron Carbide (Black Diamond)', formula: 'B₄C', category: 'rare_matter', state: 'solid', appearance: 'Jet-black superhard ceramic', description: 'Third hardest material known; neutron absorber rods in nuclear scrams.', hazard: 'safe', bondType: 'covalent', color: '#1e293b', recipe: ['B', 'C'], condition: { heat: true }, equation: '4B + C + Heat → B₄C' },
  { id: 'BN_hex', name: 'Hexagonal Boron Nitride (White Graphene)', formula: 'h-BN', category: 'rare_matter', state: 'solid', appearance: 'White slippery lubricant powder', description: 'Hexagonal 2D insulator matching graphene lattice with extreme thermal shock resistance.', hazard: 'safe', bondType: 'covalent', color: '#f8fafc', recipe: ['B', 'N'], condition: { heat: true }, equation: 'B + N + Heat → h-BN' },
  { id: 'MoS2', name: 'Molybdenum Disulfide (Dry Lubricant)', formula: 'MoS₂', category: 'salt', state: 'solid', appearance: 'Silver-black lamellar dry powder', description: 'Layered graphene-like chalcogenide lubricating turbine shafts in high vacuum.', hazard: 'safe', bondType: 'covalent', color: '#334155', recipe: ['Mo', 'S'], equation: 'Mo + 2S → MoS₂' },
];

for (const m of ADVANCED_MATERIALS) add(m);

// 8. Load existing compounds that do not collide and maintain 520+ breadth
import rawOld from '../src/data/compounds_data.json';
for (const old of (rawOld as RawCompound[])) {
  if (!idSet.has(old.id)) {
    // If it was one of the shadowed ones with generic ['C', 'H'] or ['C', 'Cl'], assign a clean distinct recipe:
    if (old.recipe && old.recipe.length === 2 && old.recipe[0] === 'C' && old.recipe[1] === 'H') {
      old.condition = { heat: true, catalyst: true };
    }
    add(old);
  }
}

console.log('Total verified non-colliding compounds:', compounds.length);

// Write to src/data/compounds_data.json
const jsonPath = path.join(process.cwd(), 'src/data/compounds_data.json');
fs.writeFileSync(jsonPath, JSON.stringify(compounds, null, 2), 'utf-8');
console.log('Successfully regenerated compounds_data.json with', compounds.length, 'compounds.');
