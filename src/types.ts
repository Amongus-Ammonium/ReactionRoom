export type ElementCategory =
  | 'nonmetal'
  | 'alkali-metal'
  | 'alkaline-earth'
  | 'transition-metal'
  | 'post-transition'
  | 'metalloid'
  | 'halogen'
  | 'noble-gas'
  | 'actinide';

export type ElementState = 'gas' | 'liquid' | 'solid';

export interface ChemicalElement {
  id: string; // e.g. 'H', 'O', 'C'
  symbol: string;
  name: string;
  atomicNumber: number;
  atomicMass: number;
  category: ElementCategory;
  valence: number;
  state: ElementState;
  color: string;
  glowColor: string;
  description: string;
  isStarter?: boolean;
}

export type CompoundCategory =
  | 'oxide'
  | 'acid'
  | 'base'
  | 'alkali'
  | 'salt'
  | 'hydrocarbon'
  | 'alcohol'
  | 'organic'
  | 'polymer'
  | 'rare_matter';

export type HazardLevel = 'safe' | 'irritant' | 'flammable' | 'corrosive' | 'toxic' | 'explosive' | 'radioactive';

export interface ReactionCondition {
  heat?: boolean;
  electricity?: boolean;
  catalyst?: boolean;
}

export interface Compound {
  id: string; // e.g. 'H2O'
  name: string;
  formula: string; // e.g. 'H₂O'
  category: CompoundCategory;
  state: 'gas' | 'liquid' | 'solid' | 'plasma';
  appearance: string;
  description: string;
  hazard: HazardLevel;
  bondType: 'covalent' | 'ionic' | 'metallic' | 'polar covalent' | 'polar-covalent' | 'aromatic' | 'coordinate';
  color: string;
  glowColor?: string;
  recipe: string[]; // Reactant IDs (e.g. ['H', 'H', 'O'] or ['H2O', 'CO2'])
  condition?: ReactionCondition;
  equation: string; // e.g. '2H₂ + O₂ → 2H₂O'
  enthalpy?: string; // e.g. 'ΔH° = -285.8 kJ/mol (Exothermic)'
  funFact?: string;
  structureHint?: string; // e.g. 'Bent H-O-H'
}

export interface Task {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  targetCompoundId: string;
  targetCompoundName: string;
  targetFormula: string;
  rewardElementId: string;
  rewardElementName: string;
  rewardElementSymbol: string;
  hint: string;
  lore: string;
}

export interface ReactorSlotItem {
  instanceId: string;
  id: string; // element or compound id
  name: string;
  symbolOrFormula: string;
  type: 'element' | 'compound';
  color: string;
}

export interface ElementClassInfo {
  id: ElementCategory | 'organic-backbone';
  name: string;
  badgeColor: string;
  badgeBg: string;
  badgeBorder: string;
  examples: string[];
}

export interface RecipeClassHint {
  compoundId: string;
  compoundName: string;
  compoundFormula: string;
  category: CompoundCategory;
  elementClasses: ElementClassInfo[];
  vagueHint: string;
  energyHint?: string;
  hasHeat: boolean;
  hasElectricity: boolean;
  hasCatalyst: boolean;
}

export type ActiveTab = 'lab' | 'tasks' | 'compendium' | 'periodic';
