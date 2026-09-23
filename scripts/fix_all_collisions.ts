import fs from 'fs';
import path from 'path';

interface Compound {
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

const filePath = path.join(process.cwd(), 'src/data/compounds_data.json');
let compounds: Compound[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// Filter out duplicates
compounds = compounds.filter(c => !['KNO3_saltpeter', 'NH3NO3', 'NH4NO3_prilled'].includes(c.id));

// Map of specific recipe and condition overrides
const updates: Record<string, { recipe: string[]; condition?: { heat?: boolean; electricity?: boolean; catalyst?: boolean } }> = {
  // Oxides & Acids
  H3PO4: { recipe: ['P4O10', 'H2O'], condition: undefined },
  P4O10: { recipe: ['P', 'O'], condition: { heat: true } },
  Fe2S3: { recipe: ['FeCl3', 'H2S'], condition: undefined },
  FeS2: { recipe: ['Fe', 'S'], condition: { heat: true } },
  FeOH2: { recipe: ['FeCl2', 'NaOH'], condition: undefined },
  FeOH3: { recipe: ['FeCl3', 'NaOH'], condition: undefined },

  // Salts of polyprotic acids
  Na3PO4: { recipe: ['NaOH', 'H3PO4'], condition: { heat: true } },
  Na2HPO4: { recipe: ['NaOH', 'H3PO4'], condition: undefined },
  NaH2PO4: { recipe: ['Na2HPO4', 'H3PO4'], condition: undefined },
  K3PO4: { recipe: ['KOH', 'H3PO4'], condition: { heat: true } },
  K2HPO4: { recipe: ['KOH', 'H3PO4'], condition: undefined },
  KH2PO4: { recipe: ['K2HPO4', 'H3PO4'], condition: undefined },
  Ca3PO42: { recipe: ['CaOH2', 'H3PO4'], condition: { heat: true } },
  CaH2PO42: { recipe: ['Ca3PO42', 'H3PO4'], condition: undefined },
  Na2SO3: { recipe: ['NaOH', 'SO2'], condition: { heat: true } },
  NaHSO3: { recipe: ['Na2SO3', 'SO2'], condition: undefined },

  // Interhalogens
  ClF: { recipe: ['Cl', 'F'], condition: undefined },
  ClF3: { recipe: ['Cl', 'F'], condition: { heat: true } },
  ClF5: { recipe: ['Cl', 'F'], condition: { electricity: true } },
  BrF: { recipe: ['Br', 'F'], condition: undefined },
  BrF3: { recipe: ['Br', 'F'], condition: { heat: true } },
  BrF5: { recipe: ['Br', 'F'], condition: { electricity: true } },
  IF5: { recipe: ['I', 'F'], condition: { heat: true } },
  IF7: { recipe: ['I', 'F'], condition: { electricity: true } },
  ICl: { recipe: ['I', 'Cl'], condition: undefined },
  ICl3: { recipe: ['I', 'Cl'], condition: { heat: true } },
  IBr: { recipe: ['I', 'Br'], condition: undefined },

  // Halocarbons & Reagents
  CH3Cl: { recipe: ['CH4', 'Cl'], condition: undefined },
  CH2Cl2: { recipe: ['CH3Cl', 'Cl'], condition: undefined },
  CHCl3: { recipe: ['CH2Cl2', 'Cl'], condition: { catalyst: true } },
  CCl4: { recipe: ['CHCl3', 'Cl'], condition: { heat: true } },
  CH3F: { recipe: ['CH3Cl', 'HF'], condition: undefined },
  CH2F2: { recipe: ['CH2Cl2', 'HF'], condition: undefined },
  CHF3: { recipe: ['CHCl3', 'HF'], condition: undefined },
  CF4: { recipe: ['CH4', 'F'], condition: { heat: true } },
  CBr4: { recipe: ['CH4', 'Br'], condition: { heat: true } },
  CHBr3: { recipe: ['CH4', 'Br'], condition: { catalyst: true } },
  CI4: { recipe: ['CH4', 'I'], condition: { heat: true } },
  CHI3: { recipe: ['CH3COCH3', 'I'], condition: { catalyst: true } },
  C2H5Cl: { recipe: ['C2H4', 'HCl'], condition: undefined },
  C2H4Cl2: { recipe: ['C2H4', 'Cl'], condition: undefined },
  C2HCl3: { recipe: ['C2H2', 'Cl'], condition: undefined },
  C2Cl4: { recipe: ['C2HCl3', 'Cl'], condition: { heat: true } },
  SOCl2: { recipe: ['SO2', 'PCl5'], condition: undefined },
  SO2Cl2: { recipe: ['SO2', 'Cl'], condition: { catalyst: true } },
  POCl3: { recipe: ['PCl3', 'O'], condition: undefined },
  COCl2: { recipe: ['CO', 'Cl'], condition: { catalyst: true } },
  NOCl: { recipe: ['NO', 'Cl'], condition: undefined },

  // Inorganic Hydrides, Nitrides & Carbides
  SiH4: { recipe: ['Si', 'H'], condition: { heat: true } },
  PH3: { recipe: ['P', 'H'], condition: { heat: true } },
  NaH: { recipe: ['Na', 'H'], condition: { heat: true } },
  CaH2: { recipe: ['Ca', 'H'], condition: { heat: true } },
  LiAlH4: { recipe: ['Li', 'Al'], condition: { heat: true } },
  CaC2: { recipe: ['CaO', 'C'], condition: { heat: true } },
  Fe3C: { recipe: ['Fe', 'C'], condition: { heat: true, catalyst: true } },
  TiN: { recipe: ['Ti', 'N'], condition: { heat: true } },
  Si3N4: { recipe: ['Si', 'N'], condition: { heat: true } },
  AlN: { recipe: ['Al', 'N'], condition: { heat: true } },

  // Hydrocarbons & Aromatics
  C9H20: { recipe: ['C4H8', 'C5H12'], condition: { catalyst: true } },
  C10H22: { recipe: ['C5H8', 'C5H12'], condition: { catalyst: true } },
  C12H26: { recipe: ['C6H12', 'C6H14'], condition: { catalyst: true } },
  C16H34: { recipe: ['C8H16O2_oct', 'H'], condition: { catalyst: true } },
  C20H42: { recipe: ['C10H20O2_dec', 'H'], condition: { catalyst: true } },
  C3H4: { recipe: ['C2H2', 'CH4'], condition: { catalyst: true } },
  C3H6_cyc: { recipe: ['C3H6'], condition: { heat: true, catalyst: true } },
  C4H8_cyc: { recipe: ['C4H8'], condition: { heat: true, catalyst: true } },
  C5H10: { recipe: ['C5H8', 'H'], condition: { catalyst: true } },
  C6H12: { recipe: ['C6H6', 'H'], condition: { heat: true, catalyst: true } },
  C14H10: { recipe: ['C6H6', 'CH2Cl2'], condition: { catalyst: true } },
  C14H10_ph: { recipe: ['C6H6', 'C8H8'], condition: { catalyst: true } },
  C12H10: { recipe: ['C6H6', 'C6H6'], condition: { heat: true, catalyst: true } },
  C16H10: { recipe: ['C10H8', 'C6H6'], condition: { heat: true, catalyst: true } },

  // Alcohols & Ethers
  C3H7OH_1: { recipe: ['C3H6', 'CO'], condition: { heat: true, catalyst: true } },
  C4H9OH_tert: { recipe: ['C4H8', 'H2SO4'], condition: { catalyst: true } },
  C3H6OH2: { recipe: ['C3H6', 'H2O2'], condition: { catalyst: true } },
  CH3OCH3: { recipe: ['CH3OH', 'H2SO4'], condition: { heat: true } },
  C2H5OC2H5: { recipe: ['C2H5OH', 'H2SO4'], condition: { heat: true } },
  C4H8O: { recipe: ['C4H8', 'O'], condition: { catalyst: true } },
  C4H8O2_diox: { recipe: ['C2H4OH2', 'H2SO4'], condition: { heat: true } },

  // Carbonyls & Aldehydes
  C9H8O_cinn: { recipe: ['C6H5CHO', 'CH3CHO'], condition: { catalyst: true } },
  C8H8O3_van: { recipe: ['C6H5OH', 'HCHO'], condition: { catalyst: true } },
  C4H8O_mek: { recipe: ['C4H9OH_1', 'O'], condition: { catalyst: true } },
  C6H10O: { recipe: ['C6H12', 'O'], condition: { catalyst: true } },
  C8H8O_acp: { recipe: ['C6H6', 'CH3COOH'], condition: { catalyst: true } },

  // Carboxylic Acids & Derivatives
  C2H5COOH: { recipe: ['C2H4', 'CO'], condition: { catalyst: true } },
  C3H7COOH: { recipe: ['C4H9OH_1', 'O'], condition: { catalyst: true } },
  H2C2O4: { recipe: ['C2H2', 'HNO3'], condition: { catalyst: true } },
  C3H4O4_mal: { recipe: ['CH3COOH', 'CO2'], condition: { catalyst: true } },
  C4H6O4_succ: { recipe: ['C4H6', 'O'], condition: { catalyst: true } },
  C6H10O4_adip: { recipe: ['C6H12', 'HNO3'], condition: { heat: true } },
  C3H6O3_lac: { recipe: ['C6H12O6_glu'], condition: { catalyst: true } },
  C6H5COOH: { recipe: ['C7H8', 'O'], condition: { catalyst: true } },
  C6H8O7: { recipe: ['C6H12O6_glu', 'O'], condition: { catalyst: true } },
  C6H8O6_vitc: { recipe: ['C6H12O6_glu', 'CO2'], condition: { catalyst: true } },

  // Amines, Esters, Polymers
  CH3NH2: { recipe: ['CH3OH', 'NH3'], condition: { catalyst: true } },
  C6H5NH2: { recipe: ['C6H6', 'HNO3'], condition: { heat: true, catalyst: true } },
  NYLON66: { recipe: ['C6H10O4_adip', 'NH3'], condition: { heat: true } },
  C6H12O2_ethbut: { recipe: ['C3H7COOH', 'C2H5OH'], condition: { catalyst: true } },

  // Fatty Acids
  C4H8O2_isobut: { recipe: ['C3H7OH_iso', 'CO'], condition: { catalyst: true } },
  C5H10O2_val: { recipe: ['C4H8', 'CO'], condition: { catalyst: true } },
  C6H12O2_capr: { recipe: ['C5H10', 'CO'], condition: { catalyst: true } },
  C8H16O2_oct: { recipe: ['C7H14O2_isoam', 'CO'], condition: { catalyst: true } },
  C10H20O2_dec: { recipe: ['C8H18', 'CO2'], condition: { catalyst: true } },
  C12H24O2_laur: { recipe: ['C10H22', 'CO2'], condition: { catalyst: true } },
  C14H28O2_myr: { recipe: ['C12H26', 'CO2'], condition: { catalyst: true } },
  C16H32O2_palm: { recipe: ['C14H10', 'CO2'], condition: { catalyst: true } },
  C18H36O2_stear: { recipe: ['C16H34', 'CO2'], condition: { catalyst: true } },
  C18H34O2_ole: { recipe: ['C18H36O2_stear'], condition: { heat: true } },
  C4H4O4_mal: { recipe: ['C6H6', 'O'], condition: { heat: true, catalyst: true } },
  C4H4O4_fum: { recipe: ['C4H4O4_mal'], condition: { heat: true } },
  C4H6O5_malic: { recipe: ['C4H4O4_mal', 'H2O'], condition: { catalyst: true } },
  C4H6O6_tart: { recipe: ['C4H4O4_mal', 'H2O2'], condition: { catalyst: true } },
  C3H4O3_pyr: { recipe: ['C3H6O3_lac', 'O'], condition: { catalyst: true } },
  C8H6O4_phth: { recipe: ['C8H10_o', 'O'], condition: { catalyst: true } },
  C9H8O2_cinn: { recipe: ['C6H5CHO', 'CH3COOH'], condition: { catalyst: true } },
  C3H4O2_acr: { recipe: ['C3H6', 'O'], condition: { catalyst: true } },
  C4H6O2_methacr: { recipe: ['CH3COCH3', 'CO'], condition: { catalyst: true } },

  // Esters
  HCOOCH3: { recipe: ['HCOOH', 'CH3OH'], condition: { catalyst: true } },
  HCOOC2H5: { recipe: ['HCOOH', 'C2H5OH'], condition: { catalyst: true } },
  CH3COOC3H7: { recipe: ['CH3COOH', 'C3H7OH_1'], condition: { catalyst: true } },
  CH3COOC4H9: { recipe: ['CH3COOH', 'C4H9OH_1'], condition: { catalyst: true } },
  C4H8O2_methbut: { recipe: ['C3H7COOH', 'CH3OH'], condition: { catalyst: true } },
  C10H20O2_octac: { recipe: ['CH3COOH', 'C8H18'], condition: { catalyst: true } },
  C9H10O2_benzac: { recipe: ['CH3COOH', 'C7H8'], condition: { catalyst: true } },
  C9H10O2_ethbenz: { recipe: ['C6H5COOH', 'C2H5OH'], condition: { catalyst: true } },
  C10H10O4_dmt: { recipe: ['C8H6O4_ter', 'CH3OH'], condition: { catalyst: true } },

  // Amino Acids & Nucleic Bases
  VALINE: { recipe: ['C3H7OH_iso', 'NH3'], condition: { catalyst: true } },
  LEUCINE: { recipe: ['C4H9OH_1', 'NH3'], condition: { catalyst: true } },
  ISOLEUCINE: { recipe: ['C4H8', 'NH3'], condition: { catalyst: true } },
  SERINE: { recipe: ['GLYCINE', 'HCHO'], condition: { catalyst: true } },
  THREONINE: { recipe: ['ALANINE', 'HCHO'], condition: { catalyst: true } },
  METHIONINE: { recipe: ['CYSTEINE', 'CH3OH'], condition: { catalyst: true } },
  ASPARTATE: { recipe: ['H2C2O4', 'NH3'], condition: { catalyst: true } },
  GLUTAMATE: { recipe: ['C4H6O4_succ', 'NH3'], condition: { catalyst: true } },
  LYSINE: { recipe: ['GLYCINE', 'C4H8'], condition: { catalyst: true } },
  ARGININE: { recipe: ['GLUTAMATE', 'CH4N2O'], condition: { catalyst: true } },
  HISTIDINE: { recipe: ['ADENINE', 'C3H6O3_lac'], condition: { catalyst: true } },
  PHENYLALANINE: { recipe: ['C6H6', 'ALANINE'], condition: { catalyst: true } },
  TYROSINE: { recipe: ['PHENYLALANINE', 'O'], condition: { catalyst: true } },
  TRYPTOPHAN: { recipe: ['C6H6', 'SERINE'], condition: { catalyst: true } },
  PROLINE: { recipe: ['GLUTAMATE', 'H'], condition: { catalyst: true } },
  CYTOSINE: { recipe: ['CH4N2O', 'C3H4'], condition: { catalyst: true } },

  // Terpenes, Aromatics & Alkaloids
  LIMONENE: { recipe: ['C5H8'], condition: { heat: true, catalyst: true } },
  PINENE: { recipe: ['LIMONENE'], condition: { catalyst: true } },
  CAMPHOR: { recipe: ['PINENE', 'O'], condition: { catalyst: true } },
  MENTHOL: { recipe: ['THYMOL', 'H'], condition: { catalyst: true } },
  THYMOL: { recipe: ['C6H5OH', 'C3H6'], condition: { catalyst: true } },
  EUGENOL: { recipe: ['C6H5OH', 'C3H6'], condition: { heat: true, catalyst: true } },
  CAPSAICIN: { recipe: ['C8H8O3_van', 'NH3'], condition: { catalyst: true } },
  RESVERATROL: { recipe: ['C6H5OH', 'C7H6O3'], condition: { catalyst: true } },
  CURCUMIN: { recipe: ['C8H8O3_van', 'CH3COCH3'], condition: { catalyst: true } },
  MELATONIN: { recipe: ['SEROTONIN', 'CH3COOH'], condition: { catalyst: true } },
  SEROTONIN: { recipe: ['TRYPTOPHAN'], condition: { catalyst: true } },
  DOPAMINE: { recipe: ['TYROSINE'], condition: { catalyst: true } },
  EPINEPHRINE: { recipe: ['DOPAMINE', 'CH3OH'], condition: { catalyst: true } },
  ACETYLCHOLINE: { recipe: ['CH3COOC2H5', 'NH3'], condition: { catalyst: true } },
  HISTAMINE: { recipe: ['HISTIDINE'], condition: { catalyst: true } },
  CHOLESTEROL: { recipe: ['C5H8', 'O'], condition: { catalyst: true } },
  TESTOSTERONE: { recipe: ['CHOLESTEROL'], condition: { catalyst: true } },
  ESTRADIOL: { recipe: ['TESTOSTERONE'], condition: { catalyst: true } },
  CORTISOL: { recipe: ['CHOLESTEROL', 'O'], condition: { heat: true, catalyst: true } },

  // Final Disambiguation Overrides
  C4H8_cyc: { recipe: ['C4H8'], condition: { electricity: true } },
  C4H6: { recipe: ['C4H8'], condition: { heat: true, catalyst: true } },
  C3H5OH3: { recipe: ['C3H6OH2', 'O'], condition: { catalyst: true } },
  C3H6OH2: { recipe: ['C3H6', 'H2O2'], condition: { catalyst: true } },
  C6H5CHO: { recipe: ['C7H8', 'O'], condition: { catalyst: true } },
  C6H5COOH: { recipe: ['C7H8', 'O'], condition: { heat: true, catalyst: true } },
  CH3COOC2H5: { recipe: ['CH3COOH', 'C2H5OH'], condition: { catalyst: true } },
  CH3COOC4H9: { recipe: ['CH3COOH', 'C4H9OH_1'], condition: { catalyst: true } },
  C7H14O2_isoam: { recipe: ['CH3COOH', 'C5H10'], condition: { catalyst: true } },
  POLYPROPYLENE: { recipe: ['C3H6'], condition: { heat: true, catalyst: true } },
  C3H6_cyc: { recipe: ['C3H6'], condition: { electricity: true } },
  C4H8O_mek: { recipe: ['C4H9OH_1', 'O'], condition: { catalyst: true } },
  C3H7COOH: { recipe: ['C4H9OH_1', 'O'], condition: { heat: true, catalyst: true } },
};

let applied = 0;
for (const c of compounds) {
  if (updates[c.id]) {
    c.recipe = updates[c.id].recipe;
    c.condition = updates[c.id].condition;
    applied++;
  }
}

fs.writeFileSync(filePath, JSON.stringify(compounds, null, 2), 'utf-8');
console.log(`Applied ${applied} updates. Remaining compounds: ${compounds.length}`);
