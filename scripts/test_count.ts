import fs from 'fs';
import path from 'path';

// Let's import all sub-modules we've created
import { OXIDE_COMPOUNDS } from '../src/data/compounds/oxides';
import { ACID_COMPOUNDS } from '../src/data/compounds/acids';
import { BASE_COMPOUNDS } from '../src/data/compounds/bases';
import { HALIDE_COMPOUNDS } from '../src/data/compounds/salts_halides';
import { POLYATOMIC_SALTS } from '../src/data/compounds/salts_polyatomic';
import { HYDROCARBON_COMPOUNDS } from '../src/data/compounds/hydrocarbons';
import { ORGANIC_COMPOUNDS } from '../src/data/compounds/organics';
import { MATERIAL_COMPOUNDS } from '../src/data/compounds/materials';
import { ALL_COMPOUNDS as EXISTING_COMPOUNDS } from '../src/data/compounds';

console.log('Existing compounds count:', EXISTING_COMPOUNDS.length);
console.log('Oxides count:', OXIDE_COMPOUNDS.length);
console.log('Acids count:', ACID_COMPOUNDS.length);
console.log('Bases count:', BASE_COMPOUNDS.length);
console.log('Halides count:', HALIDE_COMPOUNDS.length);
console.log('Polyatomic salts count:', POLYATOMIC_SALTS.length);
console.log('Hydrocarbons count:', HYDROCARBON_COMPOUNDS.length);
console.log('Organics count:', ORGANIC_COMPOUNDS.length);
console.log('Materials count:', MATERIAL_COMPOUNDS.length);
