import React, { useState } from 'react';
import { Search, Plus, FlaskConical, AlertTriangle, ShieldCheck, Flame, Skull, Radio } from 'lucide-react';
import { Compound, CompoundCategory, HazardLevel } from '../types';
import { soundFx } from '../utils/audio';

interface CompoundShelfProps {
  discoveredCompounds: Compound[];
  onAddCompound: (compound: Compound) => void;
  totalCompoundsCount: number;
}

const CATEGORY_TABS: { [key in CompoundCategory | 'all']: string } = {
  all: 'All',
  oxide: 'Oxides',
  acid: 'Acids',
  base: 'Bases',
  alkali: 'Alkalis',
  salt: 'Salts',
  hydrocarbon: 'Hydrocarbons',
  alcohol: 'Alcohols',
  organic: 'Organics',
  polymer: 'Polymers',
  rare_matter: 'Rare Matter',
};

const getHazardIcon = (hazard: HazardLevel) => {
  switch (hazard) {
    case 'safe':
      return <ShieldCheck className="w-3 h-3 text-emerald-400" />;
    case 'flammable':
      return <Flame className="w-3 h-3 text-amber-400" />;
    case 'corrosive':
      return <AlertTriangle className="w-3 h-3 text-orange-400" />;
    case 'toxic':
      return <Skull className="w-3 h-3 text-purple-400" />;
    case 'radioactive':
      return <Radio className="w-3 h-3 text-lime-400 animate-spin-slow" />;
    default:
      return <AlertTriangle className="w-3 h-3 text-amber-400" />;
  }
};

export const CompoundShelf: React.FC<CompoundShelfProps> = ({
  discoveredCompounds,
  onAddCompound,
  totalCompoundsCount,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<CompoundCategory | 'all'>('all');

  const filtered = discoveredCompounds.filter((comp) => {
    const matchesSearch =
      comp.name.toLowerCase().includes(search.toLowerCase()) ||
      comp.formula.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'all' || comp.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const handleDragStart = (e: React.DragEvent, compound: Compound) => {
    e.dataTransfer.setData(
      'text/plain',
      JSON.stringify({ type: 'compound', id: compound.id })
    );
    e.dataTransfer.effectAllowed = 'copy';
    soundFx.playAtomClick(1.2);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 rounded-2xl border border-slate-800 p-4 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-slate-200">
            Synthesized Reagents
          </h3>
          <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-800/60">
            {discoveredCompounds.length}/{totalCompoundsCount}
          </span>
        </div>
        <span className="text-[11px] text-slate-400 hidden sm:inline">
          Reusable in reactions
        </span>
      </div>

      {/* Search and category pills */}
      <div className="mt-3 space-y-2.5">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-compound-search"
            type="text"
            placeholder="Search compound or formula..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1.5 no-scrollbar text-xs">
          {(Object.keys(CATEGORY_TABS) as (CompoundCategory | 'all')[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap text-[11px] transition-all ${
                selectedCat === cat
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'bg-slate-950/40 text-slate-400 border border-slate-800 hover:text-slate-300'
              }`}
            >
              {CATEGORY_TABS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Compound items list / grid */}
      <div className="flex-1 overflow-y-auto mt-3 pr-1 space-y-2 min-h-[160px] max-h-[360px] md:max-h-none">
        {discoveredCompounds.length === 0 ? (
          <div className="text-center py-10 px-4 text-slate-500 text-xs">
            <FlaskConical className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
            <p className="font-medium text-slate-400">No Compounds Synthesized Yet</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Combine starter elements in the crucible to synthesize your first molecules!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {filtered.map((comp) => (
              <div
                key={comp.id}
                draggable
                onDragStart={(e) => handleDragStart(e, comp)}
                onClick={() => {
                  onAddCompound(comp);
                  soundFx.playAtomClick(1.0);
                }}
                className="group relative flex flex-col p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/90 hover:border-indigo-500/60 hover:bg-slate-900/80 cursor-pointer select-none transition-all duration-200 hover:scale-[1.02] shadow-sm hover:shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                style={{
                  borderLeftWidth: '3px',
                  borderLeftColor: comp.color,
                }}
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">
                    {comp.category}
                  </span>
                  <div className="flex items-center gap-1" title={`Hazard: ${comp.hazard}`}>
                    {getHazardIcon(comp.hazard)}
                  </div>
                </div>

                <div className="my-1.5 text-center">
                  <span
                    className="font-mono font-bold text-lg tracking-tight inline-block group-hover:scale-105 transition-transform"
                    style={{ color: comp.color }}
                  >
                    {comp.formula}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-auto pt-1 border-t border-slate-800/60 text-slate-400 group-hover:text-slate-200">
                  <span className="text-xs font-medium truncate">{comp.name}</span>
                  <Plus className="w-3.5 h-3.5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
