import { ALL_COMPOUNDS } from '../data/compounds';
import { ALL_ELEMENTS } from '../data/elements';
import {
  Compound,
  ReactionCondition,
  ChemicalElement,
  RecipeClassHint,
  ElementClassInfo,
  ElementCategory,
} from '../types';

/**
 * Alternate recipe definitions for realistic chemical pathways.
 * Multiple synthesis routes can produce the same target compound.
 */
interface AlternativeRecipe {
  compoundId: string;
  reactants: string[];
  condition?: ReactionCondition;
}

export const ALTERNATIVE_RECIPES: AlternativeRecipe[] = [
  // Oxides and simple compounds
  { compoundId: 'H2O', reactants: ['H', 'O'], condition: { heat: true } },
  { compoundId: 'H2O', reactants: ['H', 'H', 'O'], condition: { heat: true } },
  { compoundId: 'H2O', reactants: ['H', 'H2O2'] },
  { compoundId: 'H2O2', reactants: ['H2O', 'O'], condition: { electricity: true } },
  { compoundId: 'H2O2', reactants: ['H', 'H', 'O', 'O'], condition: { electricity: true } },
  { compoundId: 'CO', reactants: ['C', 'O'] },
  { compoundId: 'CO2', reactants: ['C', 'O'], condition: { heat: true } },
  { compoundId: 'CO2', reactants: ['C', 'O', 'O'], condition: { heat: true } },
  { compoundId: 'CO2', reactants: ['CO', 'O'], condition: { heat: true } },
  { compoundId: 'CO2', reactants: ['CH4', 'O'], condition: { heat: true } },
  { compoundId: 'SO2', reactants: ['S', 'O'], condition: { heat: true } },
  { compoundId: 'SO2', reactants: ['S', 'O', 'O'], condition: { heat: true } },
  { compoundId: 'SO3', reactants: ['SO2', 'O'], condition: { catalyst: true } },
  { compoundId: 'SO3', reactants: ['S', 'O', 'O', 'O'], condition: { heat: true } },
  { compoundId: 'NO', reactants: ['N', 'O'], condition: { heat: true } },
  { compoundId: 'NO2', reactants: ['NO', 'O'] },
  { compoundId: 'NO2', reactants: ['N', 'O', 'O'], condition: { heat: true } },
  { compoundId: 'N2O', reactants: ['N', 'N', 'O'], condition: { heat: true } },
  { compoundId: 'N2O5', reactants: ['NO2', 'O'] },
  { compoundId: 'SiO2', reactants: ['Si', 'O'], condition: { heat: true } },
  { compoundId: 'SiO2', reactants: ['Si', 'O', 'O'], condition: { heat: true } },
  { compoundId: 'P4O10', reactants: ['P', 'O'], condition: { heat: true } },

  // Acid-Base Neutralizations to Salts
  { compoundId: 'NaCl', reactants: ['NaOH', 'HCl'] },
  { compoundId: 'NaCl', reactants: ['Na', 'Cl'] },
  { compoundId: 'NaCl', reactants: ['Na', 'Cl', 'Cl'] },
  { compoundId: 'NaCl', reactants: ['NaHCO3', 'HCl'] },
  { compoundId: 'NaCl', reactants: ['Na2CO3', 'HCl'] },
  { compoundId: 'KCl', reactants: ['KOH', 'HCl'] },
  { compoundId: 'KCl', reactants: ['K', 'Cl'] },
  { compoundId: 'LiCl', reactants: ['LiOH', 'HCl'] },
  { compoundId: 'LiCl', reactants: ['Li', 'Cl'] },
  { compoundId: 'CaCl2', reactants: ['CaOH2', 'HCl'] },
  { compoundId: 'CaCl2', reactants: ['CaO', 'HCl'] },
  { compoundId: 'CaCl2', reactants: ['CaCO3', 'HCl'] },
  { compoundId: 'CaCl2', reactants: ['Ca', 'Cl'] },
  { compoundId: 'MgCl2', reactants: ['MgOH2', 'HCl'] },
  { compoundId: 'MgCl2', reactants: ['MgO', 'HCl'] },
  { compoundId: 'MgCl2', reactants: ['Mg', 'Cl'] },
  { compoundId: 'NH4Cl', reactants: ['NH3', 'HCl'] },
  { compoundId: 'AlCl3', reactants: ['Al', 'Cl'] },
  { compoundId: 'AlCl3', reactants: ['Al', 'HCl'] },
  { compoundId: 'FeCl2', reactants: ['Fe', 'Cl'] },
  { compoundId: 'FeCl2', reactants: ['Fe', 'Cl', 'Cl'] },
  { compoundId: 'FeCl2', reactants: ['Fe', 'HCl'] },
  { compoundId: 'FeCl3', reactants: ['Fe', 'Cl'], condition: { heat: true } },
  { compoundId: 'FeCl3', reactants: ['Fe', 'Cl', 'Cl', 'Cl'], condition: { heat: true } },
  { compoundId: 'FeCl3', reactants: ['FeCl2', 'Cl'], condition: { heat: true } },
  { compoundId: 'CuCl', reactants: ['Cu', 'Cl'] },
  { compoundId: 'CuCl2', reactants: ['Cu', 'Cl'], condition: { heat: true } },
  { compoundId: 'CuCl2', reactants: ['Cu', 'Cl', 'Cl'], condition: { heat: true } },
  { compoundId: 'CuCl2', reactants: ['CuO', 'HCl'] },
  { compoundId: 'PCl3', reactants: ['P', 'Cl'] },
  { compoundId: 'PCl3', reactants: ['P', 'Cl', 'Cl', 'Cl'] },
  { compoundId: 'PCl5', reactants: ['P', 'Cl'], condition: { heat: true } },
  { compoundId: 'PCl5', reactants: ['P', 'Cl', 'Cl', 'Cl', 'Cl', 'Cl'], condition: { heat: true } },
  { compoundId: 'PCl5', reactants: ['PCl3', 'Cl'], condition: { heat: true } },
  { compoundId: 'HeH_plus', reactants: ['He', 'H'], condition: { electricity: true } },
  { compoundId: 'HeH_plus', reactants: ['He', 'H', 'H'], condition: { electricity: true } },
  { compoundId: 'AgCl', reactants: ['AgNO3', 'NaCl'] },
  { compoundId: 'AgCl', reactants: ['Ag', 'Cl'] },

  // Sulfates
  { compoundId: 'Na2SO4', reactants: ['NaOH', 'H2SO4'] },
  { compoundId: 'K2SO4', reactants: ['KOH', 'H2SO4'] },
  { compoundId: 'CaSO4', reactants: ['CaOH2', 'H2SO4'] },
  { compoundId: 'CaSO4', reactants: ['CaO', 'H2SO4'] },
  { compoundId: 'CaSO4', reactants: ['CaCO3', 'H2SO4'] },
  { compoundId: 'MgSO4', reactants: ['MgOH2', 'H2SO4'] },
  { compoundId: 'MgSO4', reactants: ['MgO', 'H2SO4'] },
  { compoundId: 'MgSO4', reactants: ['Mg', 'H2SO4'] },
  { compoundId: 'CuSO4', reactants: ['CuO', 'H2SO4'] },
  { compoundId: 'CuSO4', reactants: ['Cu', 'H2SO4'], condition: { heat: true } },
  { compoundId: 'FeSO4', reactants: ['Fe', 'H2SO4'] },
  { compoundId: 'FeSO4', reactants: ['FeO', 'H2SO4'] },

  // Nitrates
  { compoundId: 'NaNO3', reactants: ['NaOH', 'HNO3'] },
  { compoundId: 'KNO3', reactants: ['KOH', 'HNO3'] },
  { compoundId: 'CaNO32', reactants: ['CaOH2', 'HNO3'] },
  { compoundId: 'MgNO32', reactants: ['MgOH2', 'HNO3'] },
  { compoundId: 'NH4NO3', reactants: ['NH3', 'HNO3'] },
  { compoundId: 'CuNO32', reactants: ['Cu', 'HNO3'] },
  { compoundId: 'AgNO3', reactants: ['Ag', 'HNO3'] },

  // Carbonates & Bicarbonates
  { compoundId: 'CaCO3', reactants: ['CaOH2', 'CO2'] },
  { compoundId: 'CaCO3', reactants: ['CaO', 'CO2'] },
  { compoundId: 'NaHCO3', reactants: ['NaOH', 'CO2'] },
  { compoundId: 'Na2CO3', reactants: ['NaOH', 'CO2'], condition: { heat: true } },
  { compoundId: 'KHCO3', reactants: ['KOH', 'CO2'] },
  { compoundId: 'K2CO3', reactants: ['KOH', 'CO2'], condition: { heat: true } },

  // Hydration of Oxides (Slaking & Acid formation)
  { compoundId: 'CaOH2', reactants: ['CaO', 'H2O'] },
  { compoundId: 'NaOH', reactants: ['Na2O', 'H2O'] },
  { compoundId: 'NaOH', reactants: ['Na', 'H2O'] },
  { compoundId: 'KOH', reactants: ['K2O', 'H2O'] },
  { compoundId: 'KOH', reactants: ['K', 'H2O'] },
  { compoundId: 'LiOH', reactants: ['Li2O', 'H2O'] },
  { compoundId: 'LiOH', reactants: ['Li', 'H2O'] },
  { compoundId: 'MgOH2', reactants: ['MgO', 'H2O'] },
  { compoundId: 'AlOH3', reactants: ['Al2O3', 'H2O'] },
  { compoundId: 'H2SO4', reactants: ['SO3', 'H2O'] },
  { compoundId: 'H2SO4', reactants: ['SO2', 'H2O2'] },
  { compoundId: 'H2SO3', reactants: ['SO2', 'H2O'] },
  { compoundId: 'H2CO3', reactants: ['CO2', 'H2O'] },
  { compoundId: 'HNO3', reactants: ['NO2', 'H2O'] },
  { compoundId: 'HNO3', reactants: ['N2O5', 'H2O'] },
  { compoundId: 'H3PO4', reactants: ['P4O10', 'H2O'] },

  // Hydrocarbons & Fuel chemistry
  { compoundId: 'CH4', reactants: ['C', 'H'], condition: { heat: true, catalyst: true } },
  { compoundId: 'CH4', reactants: ['C', 'H', 'H', 'H', 'H'], condition: { heat: true } },
  { compoundId: 'C2H6', reactants: ['C', 'C', 'H'], condition: { heat: true } },
  { compoundId: 'C2H4', reactants: ['C2H6'], condition: { heat: true } },
  { compoundId: 'C2H2', reactants: ['C', 'H'], condition: { electricity: true } },
  { compoundId: 'C2H2', reactants: ['CaC2', 'H2O'] },
  { compoundId: 'C6H6', reactants: ['C2H2'], condition: { heat: true, catalyst: true } },
  { compoundId: 'C7H8', reactants: ['C6H6', 'CH4'], condition: { heat: true, catalyst: true } },

  // Organics, Alcohols & Esters
  { compoundId: 'CH3OH', reactants: ['CO', 'H'], condition: { heat: true, catalyst: true } },
  { compoundId: 'C2H5OH', reactants: ['C2H4', 'H2O'], condition: { catalyst: true } },
  { compoundId: 'C2H5OH', reactants: ['C6H12O6'], condition: { catalyst: true } },
  { compoundId: 'CH3COOH', reactants: ['C2H5OH', 'O'], condition: { catalyst: true } },
  { compoundId: 'CH3COOC2H5', reactants: ['CH3COOH', 'C2H5OH'], condition: { catalyst: true } },
  { compoundId: 'CH3COOCH3', reactants: ['CH3COOH', 'CH3OH'], condition: { catalyst: true } },
  { compoundId: 'C9H8O4', reactants: ['C7H6O3', 'CH3COOH'], condition: { heat: true } }, // Aspirin
  { compoundId: 'C9H8O4', reactants: ['C6H6', 'CH3COOH'], condition: { heat: true } },
  { compoundId: 'CH4N2O', reactants: ['NH3', 'CO2'], condition: { heat: true } }, // Urea
  { compoundId: 'NITROGLYCERIN', reactants: ['C3H5OH3', 'HNO3'] },
  { compoundId: 'TNT', reactants: ['C7H8', 'HNO3'] },

  // Alloys & Carbides
  { compoundId: 'STEEL', reactants: ['Fe', 'C'] },
  { compoundId: 'BRONZE', reactants: ['Cu', 'Al'] },
  { compoundId: 'BRASS', reactants: ['Cu', 'Zn'] },
  { compoundId: 'CaC2', reactants: ['CaO', 'C'], condition: { heat: true } },
  { compoundId: 'CaC2', reactants: ['Ca', 'C'], condition: { heat: true } },
  { compoundId: 'SiC', reactants: ['Si', 'C'], condition: { heat: true } },
  { compoundId: 'TiC', reactants: ['Ti', 'C'], condition: { heat: true } },
  { compoundId: 'TiN', reactants: ['Ti', 'N'], condition: { heat: true } },

  // Noble Aqua Regia Dissolution
  { compoundId: 'AQUA_REGIA', reactants: ['HNO3', 'HCl'] },
  { compoundId: 'HAuCl4', reactants: ['AQUA_REGIA', 'Au'] },
  { compoundId: 'H2PtCl6', reactants: ['AQUA_REGIA', 'Pt'] },

  // Metal + Halogens
  { compoundId: 'FeS', reactants: ['Fe', 'S'] },
  { compoundId: 'FeS2', reactants: ['Fe', 'S'], condition: { heat: true } },
  { compoundId: 'CuS', reactants: ['Cu', 'S'] },
  { compoundId: 'Cu2S', reactants: ['Cu', 'Cu', 'S'] },
  { compoundId: 'Ag2S', reactants: ['Ag', 'S'] },
  { compoundId: 'H2S', reactants: ['H', 'S'] },
  { compoundId: 'H2S', reactants: ['H', 'H', 'S'] },
];

/**
 * Normalizes an array of reactant IDs (sorts them so ordering doesn't matter).
 */
export function normalizeReactants(reactants: string[]): string {
  return [...reactants].sort().join('+');
}

/**
 * Checks if provided laboratory conditions satisfy required recipe conditions.
 */
function conditionsMatch(
  required?: ReactionCondition,
  provided: ReactionCondition = {}
): boolean {
  if (!required) return true;

  if (required.heat && !provided.heat) return false;
  if (required.electricity && !provided.electricity) return false;
  if (required.catalyst && !provided.catalyst) return false;

  return true;
}

/**
 * Computes a compatibility score for how well the provided conditions fit the required conditions.
 * Returns -1 if required conditions are not satisfied.
 * Higher scores indicate a more specific match (e.g. required heat when heat is applied beats ambient match).
 */
export function evaluateConditionScore(
  required?: ReactionCondition,
  provided: ReactionCondition = {}
): number {
  if (required?.heat && !provided.heat) return -1;
  if (required?.electricity && !provided.electricity) return -1;
  if (required?.catalyst && !provided.catalyst) return -1;

  let score = 0;
  if (required?.heat && provided.heat) score += 20;
  if (required?.electricity && provided.electricity) score += 20;
  if (required?.catalyst && provided.catalyst) score += 20;

  if (!required?.heat && !provided.heat) score += 2;
  if (!required?.electricity && !provided.electricity) score += 2;
  if (!required?.catalyst && !provided.catalyst) score += 2;

  return score;
}

/**
 * Generates clear scientific feedback when a reaction fails due to noble gas chemical inertness.
 */
export function getInertGasReactionFeedback(
  reactantIds: string[],
  conditions: ReactionCondition
): string | null {
  const hasHe = reactantIds.includes('He');
  const hasH = reactantIds.includes('H');
  if (hasHe) {
    if (hasH && !conditions.electricity) {
      return 'Noble Gas Alert: Helium requires high-voltage ionization! Turn on Electric Arc (⚡) with Hydrogen to forge the exotic Helium Hydride ion (HeH⁺).';
    }
    return 'Noble Gas Inertness: Helium has a complete duplet valence shell (1s²) and remains chemically unreactive under standard conditions. (Exotic bonding requires Electric Arc ⚡ with H⁺).';
  }

  const nobleGases = ['Ne', 'Ar', 'Kr', 'Xe', 'Rn'];
  const foundNoble = nobleGases.find((ng) => reactantIds.includes(ng));
  if (foundNoble) {
    if (foundNoble === 'Xe' && reactantIds.includes('F')) {
      return 'Noble Gas Chemistry: Xenon can bond with Fluorine under specialized Heat (Δ) or Electric Arc (⚡) conditions!';
    }
    return `Noble Gas Inertness: ${foundNoble} possesses an exceptionally stable octet valence shell and resists chemical bonding under standard conditions.`;
  }

  return null;
}

/**
 * Core dynamic chemical reaction rules engine.
 * Automatically deduces real-world chemical interactions (neutralization,
 * displacement, hydration, direct combination) between any valid reagents.
 */
function evaluateDynamicChemistry(
  reactants: string[],
  conditions: ReactionCondition
): Compound | null {
  if (reactants.length !== 2) return null;

  const [r1, r2] = reactants;

  // Rule 1: Water Formation / Neutralization
  const isAcid = (id: string) => {
    const c = ALL_COMPOUNDS.find(x => x.id === id);
    return c?.category === 'acid' || ['HCl', 'HNO3', 'H2SO4', 'H3PO4', 'CH3COOH', 'HF', 'HBr', 'HI', 'H2CO3'].includes(id);
  };
  const isBase = (id: string) => {
    const c = ALL_COMPOUNDS.find(x => x.id === id);
    return c?.category === 'base' || c?.category === 'alkali' || ['NaOH', 'KOH', 'LiOH', 'CaOH2', 'MgOH2', 'NH3', 'AlOH3', 'CuOH2'].includes(id);
  };

  // Rule 2: Metal + Halogen Direct Combination
  const metals = ['Na', 'K', 'Li', 'Ca', 'Mg', 'Al', 'Fe', 'Cu', 'Ti', 'Ag', 'Au', 'Pt', 'U'];
  const halogens = ['F', 'Cl', 'Br', 'I'];

  let metal = metals.find(m => m === r1 || m === r2);
  let halogen = halogens.find(h => h === r1 || h === r2);
  if (metal && halogen) {
    // Look up compound matching this metal and halogen
    const target = ALL_COMPOUNDS.find(c => {
      return (
        c.category === 'salt' &&
        (c.id === `${metal}${halogen}` ||
          c.id === `${metal}${halogen}2` ||
          c.id === `${metal}${halogen}3` ||
          c.id === `${metal}${halogen}4`)
      );
    });
    if (target) return target;
  }

  // Rule 3: Metal + Oxygen Direct Combustion
  if ((r1 === 'O' || r2 === 'O') && metal) {
    const target = ALL_COMPOUNDS.find(c => {
      return (
        c.category === 'oxide' &&
        (c.id === `${metal}O` ||
          c.id === `${metal}O2` ||
          c.id === `${metal}2O` ||
          c.id === `${metal}2O3` ||
          c.id === `${metal}3O4`)
      );
    });
    if (target) return target;
  }

  // Rule 4: Metal + Sulfur Direct Combination
  if ((r1 === 'S' || r2 === 'S') && metal) {
    const target = ALL_COMPOUNDS.find(c => {
      return (
        (c.category === 'salt' || c.category === 'rare_matter') &&
        (c.id === `${metal}S` || c.id === `${metal}S2` || c.id === `${metal}2S` || c.id === `${metal}2S3`)
      );
    });
    if (target) return target;
  }

  // Rule 5: Metal + Water (Alkali & Alkaline Earth Hydroxides)
  if (r1 === 'H2O' || r2 === 'H2O') {
    const other = r1 === 'H2O' ? r2 : r1;
    // Basic oxides hydrating
    if (other === 'CaO') return ALL_COMPOUNDS.find(c => c.id === 'CaOH2') || null;
    if (other === 'MgO') return ALL_COMPOUNDS.find(c => c.id === 'MgOH2') || null;
    if (other === 'Na2O') return ALL_COMPOUNDS.find(c => c.id === 'NaOH') || null;
    if (other === 'K2O') return ALL_COMPOUNDS.find(c => c.id === 'KOH') || null;
    if (other === 'Li2O') return ALL_COMPOUNDS.find(c => c.id === 'LiOH') || null;

    // Acid anhydrides hydrating
    if (other === 'SO3') return ALL_COMPOUNDS.find(c => c.id === 'H2SO4') || null;
    if (other === 'SO2') return ALL_COMPOUNDS.find(c => c.id === 'H2SO3') || null;
    if (other === 'CO2') return ALL_COMPOUNDS.find(c => c.id === 'H2CO3') || null;
    if (other === 'NO2' || other === 'N2O5') return ALL_COMPOUNDS.find(c => c.id === 'HNO3') || null;
    if (other === 'P4O10') return ALL_COMPOUNDS.find(c => c.id === 'H3PO4') || null;

    // Pure alkali metals with water
    if (other === 'Na') return ALL_COMPOUNDS.find(c => c.id === 'NaOH') || null;
    if (other === 'K') return ALL_COMPOUNDS.find(c => c.id === 'KOH') || null;
    if (other === 'Li') return ALL_COMPOUNDS.find(c => c.id === 'LiOH') || null;
    if (other === 'Ca') return ALL_COMPOUNDS.find(c => c.id === 'CaOH2') || null;
  }

  // Rule 6: Acid + Carbonate / Bicarbonate Decomposition
  if (
    (r1 === 'NaHCO3' || r2 === 'NaHCO3' || r1 === 'Na2CO3' || r2 === 'Na2CO3') &&
    (r1 === 'HCl' || r2 === 'HCl')
  ) {
    return ALL_COMPOUNDS.find(c => c.id === 'NaCl') || null;
  }
  if (
    (r1 === 'NaHCO3' || r2 === 'NaHCO3') &&
    (r1 === 'CH3COOH' || r2 === 'CH3COOH')
  ) {
    return ALL_COMPOUNDS.find(c => c.id === 'CH3COONa') || null;
  }
  if (
    (r1 === 'CaCO3' || r2 === 'CaCO3') &&
    (r1 === 'HCl' || r2 === 'HCl')
  ) {
    return ALL_COMPOUNDS.find(c => c.id === 'CaCl2') || null;
  }

  // Rule 7: Metal + Acid Single Displacement
  if (metal && isAcid(r1 === metal ? r2 : r1)) {
    const acid = r1 === metal ? r2 : r1;
    if (acid === 'HCl') {
      const match = ALL_COMPOUNDS.find(c => c.id === `${metal}Cl` || c.id === `${metal}Cl2` || c.id === `${metal}Cl3` || c.id === `${metal}Cl4`);
      if (match) return match;
    }
    if (acid === 'H2SO4') {
      const match = ALL_COMPOUNDS.find(c => c.id === `${metal}SO4` || c.id === `${metal}2SO4` || c.id === `${metal}2SO43`);
      if (match) return match;
    }
    if (acid === 'HNO3') {
      const match = ALL_COMPOUNDS.find(c => c.id === `${metal}NO3` || c.id === `${metal}NO32` || c.id === `${metal}NO33`);
      if (match) return match;
    }
  }

  // Rule 8: General Neutralization (Acid + Base -> Salt)
  if (isAcid(r1) && isBase(r2) || isAcid(r2) && isBase(r1)) {
    const acid = isAcid(r1) ? r1 : r2;
    const base = isAcid(r1) ? r2 : r1;

    // Check specific pairing salts
    if (base.includes('Na') && acid === 'HCl') return ALL_COMPOUNDS.find(c => c.id === 'NaCl') || null;
    if (base.includes('K') && acid === 'HCl') return ALL_COMPOUNDS.find(c => c.id === 'KCl') || null;
    if (base.includes('Li') && acid === 'HCl') return ALL_COMPOUNDS.find(c => c.id === 'LiCl') || null;
    if (base.includes('Ca') && acid === 'HCl') return ALL_COMPOUNDS.find(c => c.id === 'CaCl2') || null;
    if (base.includes('Mg') && acid === 'HCl') return ALL_COMPOUNDS.find(c => c.id === 'MgCl2') || null;
    if (base.includes('NH') && acid === 'HCl') return ALL_COMPOUNDS.find(c => c.id === 'NH4Cl') || null;

    if (base.includes('Na') && acid === 'HNO3') return ALL_COMPOUNDS.find(c => c.id === 'NaNO3') || null;
    if (base.includes('K') && acid === 'HNO3') return ALL_COMPOUNDS.find(c => c.id === 'KNO3') || null;
    if (base.includes('NH') && acid === 'HNO3') return ALL_COMPOUNDS.find(c => c.id === 'NH4NO3') || null;

    if (base.includes('Na') && acid === 'H2SO4') return ALL_COMPOUNDS.find(c => c.id === 'Na2SO4') || null;
    if (base.includes('K') && acid === 'H2SO4') return ALL_COMPOUNDS.find(c => c.id === 'K2SO4') || null;
    if (base.includes('Ca') && acid === 'H2SO4') return ALL_COMPOUNDS.find(c => c.id === 'CaSO4') || null;
    if (base.includes('Mg') && acid === 'H2SO4') return ALL_COMPOUNDS.find(c => c.id === 'MgSO4') || null;
  }

  return null;
}

/**
 * Matches crucible contents against all known chemical recipes.
 * Prioritizes exact stoichiometric matches and dynamic universal chemical rules
 * before falling back to unique elemental sets.
 */
export function findReaction(
  reactants: string[],
  conditions: ReactionCondition
): Compound | null {
  if (!reactants || reactants.length === 0) return null;

  const normalizedInput = normalizeReactants(reactants);
  const uniqueReactants = Array.from(new Set(reactants));
  const uniqueNormalized = normalizeReactants(uniqueReactants);

  // PASS 1 & 2: Exact recipe match across primary & alternative recipes with condition scoring
  let bestCandidate: Compound | null = null;
  let bestScore = -1;

  for (const compound of ALL_COMPOUNDS) {
    if (normalizeReactants(compound.recipe) === normalizedInput) {
      const score = evaluateConditionScore(compound.condition, conditions);
      if (score > bestScore) {
        bestScore = score;
        bestCandidate = compound;
      }
    }
  }

  for (const alt of ALTERNATIVE_RECIPES) {
    if (normalizeReactants(alt.reactants) === normalizedInput) {
      const score = evaluateConditionScore(alt.condition, conditions);
      if (score > bestScore) {
        const found = ALL_COMPOUNDS.find(c => c.id === alt.compoundId);
        if (found) {
          bestScore = score;
          bestCandidate = found;
        }
      }
    }
  }

  if (bestCandidate && bestScore >= 0) {
    return bestCandidate;
  }

  // PASS 3: Dynamic Real-World Chemical Reactions Engine (Acid+Base, Metal+Acid, etc.)
  const dynamicMatch = evaluateDynamicChemistry(reactants, conditions);
  if (dynamicMatch) {
    return dynamicMatch;
  }

  // PASS 4: If reactants had duplicates (e.g. ['H', 'H', 'O']), test unique dynamic chemistry
  if (uniqueReactants.length !== reactants.length) {
    const dynamicFromUnique = evaluateDynamicChemistry(uniqueReactants, conditions);
    if (dynamicFromUnique) {
      return dynamicFromUnique;
    }
  }

  // PASS 5 & 6: Unique-element fallback with condition scoring
  let fallbackCandidate: Compound | null = null;
  let fallbackScore = -1;

  if (uniqueReactants.length !== reactants.length || reactants.length <= 3) {
    for (const compound of ALL_COMPOUNDS) {
      if (normalizeReactants(compound.recipe) === uniqueNormalized) {
        const score = evaluateConditionScore(compound.condition, conditions);
        if (score > fallbackScore) {
          fallbackScore = score;
          fallbackCandidate = compound;
        }
      }
    }

    for (const alt of ALTERNATIVE_RECIPES) {
      if (normalizeReactants(alt.reactants) === uniqueNormalized) {
        const score = evaluateConditionScore(alt.condition, conditions);
        if (score > fallbackScore) {
          const found = ALL_COMPOUNDS.find(c => c.id === alt.compoundId);
          if (found) {
            fallbackScore = score;
            fallbackCandidate = found;
          }
        }
      }
    }

    if (fallbackCandidate && fallbackScore >= 0) {
      return fallbackCandidate;
    }
  }

  return null;
}

/**
 * Quick search helpers
 */
export function getElementById(id: string): ChemicalElement | undefined {
  return ALL_ELEMENTS.find(e => e.id === id);
}

export function getCompoundById(id: string): Compound | undefined {
  return ALL_COMPOUNDS.find(c => c.id === id);
}

export function getItemData(id: string): { name: string; formula: string; color: string; type: 'element' | 'compound' } | null {
  const elem = getElementById(id);
  if (elem) {
    return { name: elem.name, formula: elem.symbol, color: elem.color, type: 'element' };
  }
  const comp = getCompoundById(id);
  if (comp) {
    return { name: comp.name, formula: comp.formula, color: comp.color, type: 'compound' };
  }
  return null;
}

/**
 * Recursively retrieves all base elements required to synthesize a compound.
 */
export function getBaseElementsForCompound(
  compoundId: string,
  visited = new Set<string>()
): ChemicalElement[] {
  if (visited.has(compoundId)) return [];
  visited.add(compoundId);

  const elem = ALL_ELEMENTS.find((e) => e.id === compoundId || e.symbol === compoundId);
  if (elem) return [elem];

  const comp = ALL_COMPOUNDS.find((c) => c.id === compoundId);
  if (!comp || !comp.recipe) return [];

  const elements: ChemicalElement[] = [];
  for (const r of comp.recipe) {
    elements.push(...getBaseElementsForCompound(r, visited));
  }
  return elements;
}

/**
 * Computes a vague, scientifically authentic hint regarding which elemental
 * classes and energetic conditions are required to synthesize a specific compound.
 */
export function getRecipeClassHint(compound: Compound): RecipeClassHint {
  const baseElements = getBaseElementsForCompound(compound.id);
  const uniqueCategories = Array.from(new Set(baseElements.map((e) => e.category)));
  const hasCarbon = baseElements.some((e) => e.symbol === 'C');
  const hasHydrogen = baseElements.some((e) => e.symbol === 'H');

  const classBadges: ElementClassInfo[] = [];

  // Group 1: Alkali Metals
  if (uniqueCategories.includes('alkali-metal')) {
    classBadges.push({
      id: 'alkali-metal',
      name: 'Alkali Metal',
      badgeColor: 'text-rose-300',
      badgeBg: 'bg-rose-950/60',
      badgeBorder: 'border-rose-500/40',
      examples: ['Na', 'K', 'Li'],
    });
  }

  // Group 2: Alkaline Earth Metals
  if (uniqueCategories.includes('alkaline-earth')) {
    classBadges.push({
      id: 'alkaline-earth',
      name: 'Alkaline Earth Metal',
      badgeColor: 'text-amber-300',
      badgeBg: 'bg-amber-950/60',
      badgeBorder: 'border-amber-500/40',
      examples: ['Ca', 'Mg'],
    });
  }

  // Transition Metals
  if (uniqueCategories.includes('transition-metal')) {
    classBadges.push({
      id: 'transition-metal',
      name: 'Transition Metal',
      badgeColor: 'text-emerald-300',
      badgeBg: 'bg-emerald-950/60',
      badgeBorder: 'border-emerald-500/40',
      examples: ['Fe', 'Cu', 'Ag', 'Pt', 'Ti', 'Zn', 'Ni', 'Au', 'W', 'Mo'],
    });
  }

  // Post-Transition Metals
  if (uniqueCategories.includes('post-transition')) {
    classBadges.push({
      id: 'post-transition',
      name: 'Post-Transition Metal',
      badgeColor: 'text-teal-300',
      badgeBg: 'bg-teal-950/60',
      badgeBorder: 'border-teal-500/40',
      examples: ['Al', 'Sn'],
    });
  }

  // Metalloids
  if (uniqueCategories.includes('metalloid')) {
    classBadges.push({
      id: 'metalloid',
      name: 'Metalloid (Semimetal)',
      badgeColor: 'text-cyan-300',
      badgeBg: 'bg-cyan-950/60',
      badgeBorder: 'border-cyan-500/40',
      examples: ['Si', 'B'],
    });
  }

  // Halogens
  if (uniqueCategories.includes('halogen')) {
    classBadges.push({
      id: 'halogen',
      name: 'Halogen',
      badgeColor: 'text-yellow-300',
      badgeBg: 'bg-yellow-950/60',
      badgeBorder: 'border-yellow-500/40',
      examples: ['Cl', 'F', 'Br', 'I'],
    });
  }

  // Noble Gases
  if (uniqueCategories.includes('noble-gas')) {
    classBadges.push({
      id: 'noble-gas',
      name: 'Noble Gas',
      badgeColor: 'text-sky-300',
      badgeBg: 'bg-sky-950/60',
      badgeBorder: 'border-sky-500/40',
      examples: ['He', 'Xe'],
    });
  }

  // Actinides
  if (uniqueCategories.includes('actinide')) {
    classBadges.push({
      id: 'actinide',
      name: 'Actinide (Radioactive)',
      badgeColor: 'text-fuchsia-300',
      badgeBg: 'bg-fuchsia-950/60',
      badgeBorder: 'border-fuchsia-500/40',
      examples: ['U'],
    });
  }

  // Nonmetals (differentiating Organic carbon skeleton vs reactive atmospheric nonmetals)
  if (uniqueCategories.includes('nonmetal')) {
    if (
      hasCarbon &&
      hasHydrogen &&
      (compound.category === 'hydrocarbon' ||
        compound.category === 'organic' ||
        compound.category === 'alcohol' ||
        compound.category === 'polymer')
    ) {
      classBadges.push({
        id: 'organic-backbone',
        name: 'Organic Nonmetal (Carbon Backbone)',
        badgeColor: 'text-indigo-300',
        badgeBg: 'bg-indigo-950/60',
        badgeBorder: 'border-indigo-500/40',
        examples: ['C', 'H', 'O', 'N'],
      });
    } else {
      classBadges.push({
        id: 'nonmetal',
        name: 'Reactive Nonmetal',
        badgeColor: 'text-blue-300',
        badgeBg: 'bg-blue-950/60',
        badgeBorder: 'border-blue-500/40',
        examples: ['H', 'O', 'N', 'P', 'S'],
      });
    }
  }

  // Generate evocative, vague scientific clue text
  let vagueHint = '';
  const cats = new Set(uniqueCategories);

  if (cats.has('noble-gas')) {
    vagueHint =
      'Cosmic Ionization: Requires forcing an otherwise inert, complete-octet Noble Gas to coordinate under intense electrical excitation.';
  } else if (cats.has('alkali-metal') && cats.has('halogen')) {
    vagueHint =
      'Vigorous Halide Precipitation: Demands a reactive Alkali Metal eager to surrender its outer valence electron to an electronegative Halogen partner.';
  } else if (cats.has('alkali-metal') && cats.has('nonmetal')) {
    vagueHint =
      'Strong Base / Oxide Lattice: Involves pairing an electropositive Alkali Metal with oxidizing Nonmetal groups.';
  } else if (cats.has('alkaline-earth') && cats.has('halogen')) {
    vagueHint =
      'Divalent Halide Fusion: Requires bridging a divalent Alkaline Earth Metal into a crystalline matrix with corrosive Halogens.';
  } else if (cats.has('alkaline-earth') && cats.has('nonmetal')) {
    vagueHint =
      'Mineral Earth Binding: Synthesized by locking an Alkaline Earth Metal into an ionic framework with reactive Nonmetal partners.';
  } else if (cats.has('transition-metal') && cats.has('halogen')) {
    vagueHint =
      'Transition Halide Complex: Demands a multivalent d-block Transition Metal reacting with aggressive Halogen oxidizers.';
  } else if (cats.has('transition-metal') && cats.has('nonmetal')) {
    vagueHint =
      'Metallic Coordination: Forged by coordinating a dense Transition Metal lattice with atmospheric or chalcogen Nonmetals.';
  } else if (cats.has('metalloid')) {
    vagueHint =
      'Semiconductor Genesis: Harnesses the hybrid chemical duality of a Metalloid bridging the metallic and nonmetallic realms.';
  } else if (cats.has('post-transition')) {
    vagueHint =
      'Post-Transition Metallic Bond: Requires pairing a ductile Post-Transition Metal with reactive nonmetal or halogen reagents.';
  } else if (cats.has('actinide')) {
    vagueHint =
      'Actinide Coordination: Involves coordinating a heavy, radioactive Actinide within a stable nonmetallic matrix.';
  } else if (
    hasCarbon &&
    (compound.category === 'hydrocarbon' ||
      compound.category === 'organic' ||
      compound.category === 'alcohol' ||
      compound.category === 'polymer')
  ) {
    vagueHint =
      'Organic Framework Assembly: Constructed upon an Organic Nonmetal backbone, linking covalent carbon chains with fundamental life-bearing nonmetals.';
  } else {
    vagueHint =
      'Covalent Nonmetal Fusion: Assembled entirely from reactive, electron-sharing Nonmetals locked into polar covalent structures.';
  }

  // Energy conditions hint
  let energyHint: string | undefined;
  const cond = compound.condition;
  if (cond?.heat && cond?.electricity) {
    energyHint =
      '⚡ Energetic Clue: Requires simultaneous thermal excitation (Heat Δ) and electrical discharge (⚡).';
  } else if (cond?.heat && cond?.catalyst) {
    energyHint =
      '🔥 Energetic Clue: Requires sustained thermal energy (Heat Δ) accelerated by a catalytic surface (Pt).';
  } else if (cond?.heat) {
    energyHint =
      '🔥 Energetic Clue: Requires elevated thermal energy (Heat Δ) to overcome activation energy barriers.';
  } else if (cond?.electricity) {
    energyHint =
      '⚡ Energetic Clue: Cannot bond spontaneously—demands high-voltage ionization via Electric Arc (⚡).';
  } else if (cond?.catalyst) {
    energyHint =
      '✨ Energetic Clue: The molecular assembly is kinetically hindered without a transition-metal Catalyst (Pt).';
  }

  return {
    compoundId: compound.id,
    compoundName: compound.name,
    compoundFormula: compound.formula,
    category: compound.category,
    elementClasses: classBadges,
    vagueHint,
    energyHint,
    hasHeat: Boolean(cond?.heat),
    hasElectricity: Boolean(cond?.electricity),
    hasCatalyst: Boolean(cond?.catalyst),
  };
}
