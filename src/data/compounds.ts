import { Compound } from '../types';
import rawData from './compounds_data.json';

export const ALL_COMPOUNDS: Compound[] = rawData as Compound[];
export const TOTAL_COMPOUNDS_COUNT = ALL_COMPOUNDS.length;
