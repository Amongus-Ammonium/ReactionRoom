import React, { useState } from 'react';
import { Search, BookOpen, Lock, CheckCircle, HelpCircle, ShieldAlert, Sparkles, Filter, ExternalLink, Lightbulb } from 'lucide-react';
import { Compound, CompoundCategory } from '../types';
import { soundFx } from '../utils/audio';

interface CompendiumViewProps {
  allCompounds: Compound[];
  discoveredCompoundIds: string[];
  onSelectCompoundForCrucible?: (compound: Compound) => void;
  onSelectCompoundForHint?: (compound: Compound) => void;
}

const CATEGORIES: { [key in CompoundCategory | 'all']: string } = {
  all: 'All Classes',
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

export const CompendiumView: React.FC<CompendiumViewProps> = ({
  allCompounds,
  discoveredCompoundIds,
  onSelectCompoundForCrucible,
  onSelectCompoundForHint,
}) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CompoundCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'discovered' | 'undiscovered'>('all');
  const [inspectedCompound, setInspectedCompound] = useState<Compound | null>(null);

  const discoveredCount = discoveredCompoundIds.length;
  const totalCount = allCompounds.length;
  const percentage = Math.round((discoveredCount / totalCount) * 100);

  const filtered = allCompounds.filter((c) => {
    const isDiscovered = discoveredCompoundIds.includes(c.id);

    if (statusFilter === 'discovered' && !isDiscovered) return false;
    if (statusFilter === 'undiscovered' && isDiscovered) return false;

    if (category !== 'all' && c.category !== category) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchFormula = c.formula.toLowerCase().includes(q);
      const matchCat = c.category.toLowerCase().includes(q);
      if (!matchName && !matchFormula && !matchCat) return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <span className="text-xs uppercase tracking-wider font-mono font-bold text-indigo-400">
              Chemical Codex & Compendium
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            {totalCount}+ Synthesizable Molecules
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse discovered compounds, chemical equations, bond thermodynamics, and uncover recipe clues.
          </p>
        </div>

        {/* Total stats */}
        <div className="flex items-center gap-4 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
          <div className="text-right">
            <span className="text-2xl font-extrabold font-mono text-indigo-400">
              {discoveredCount}
              <span className="text-slate-500 font-normal text-sm">/{totalCount}</span>
            </span>
            <span className="text-[10px] text-slate-400 block">Cataloged ({percentage}%)</span>
          </div>
          <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-compendium-search"
            type="text"
            placeholder="Search catalog by name, formula, or class (e.g. H2SO4, Ethanol, Acid)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Status filter */}
          <div className="flex rounded-xl bg-slate-900/80 border border-slate-800 p-1 text-xs">
            {(['all', 'discovered', 'undiscovered'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg capitalize text-[11px] font-medium transition ${
                  statusFilter === s
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar text-xs">
        {(Object.keys(CATEGORIES) as (CompoundCategory | 'all')[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap text-xs transition ${
              category === cat
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            {CATEGORIES[cat]}
          </button>
        ))}
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {filtered.map((c) => {
          const isDiscovered = discoveredCompoundIds.includes(c.id);

          return (
            <div
              key={c.id}
              onClick={() => {
                setInspectedCompound(c);
                soundFx.playAtomClick(1.1);
              }}
              className={`flex flex-col rounded-2xl border p-4 transition-all duration-200 cursor-pointer ${
                isDiscovered
                  ? 'bg-slate-900/70 border-slate-800 hover:border-indigo-500/60 hover:bg-slate-900/90 shadow-sm hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-amber-500/50 hover:bg-slate-900/50 shadow-sm'
              }`}
              style={{
                borderLeftWidth: '3px',
                borderLeftColor: isDiscovered ? c.color : '#475569',
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  {c.category}
                </span>
                {isDiscovered ? (
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Synthesized
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-amber-400/90 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Undiscovered
                  </span>
                )}
              </div>

              {/* Chemical Formula */}
              <div className="my-2 text-center py-2">
                <span
                  className="font-mono font-bold text-2xl tracking-tight inline-block"
                  style={{ color: isDiscovered ? c.color : '#94a3b8' }}
                >
                  {isDiscovered ? c.formula : '???'}
                </span>
                <span className="block text-xs font-semibold text-slate-300 mt-1 truncate">
                  {c.name}
                </span>
              </div>

              {/* Equation / Hint */}
              <div className="mt-auto pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                {isDiscovered ? (
                  <div className="truncate text-cyan-300/90" title={c.equation}>
                    {c.equation}
                  </div>
                ) : (
                  <div className="text-amber-400/80 italic flex items-center justify-between">
                    <span>Hint: {c.state} • {c.bondType}</span>
                    <span className="text-[10px] font-sans text-slate-500">Tap for clues</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-500 text-xs">
          No compounds match current filter criteria.
        </div>
      )}

      {/* Inspect Modal */}
      {inspectedCompound && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto custom-scrollbar"
            style={{ boxShadow: `0 0 50px ${inspectedCompound.color}30` }}
          >
            {(() => {
              const isDiscovered = discoveredCompoundIds.includes(inspectedCompound.id);
              return (
                <>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs uppercase font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {inspectedCompound.category} • {isDiscovered ? 'Synthesized' : 'Undiscovered'}
                      </span>
                      <h2
                        className="text-3xl font-mono font-extrabold mt-2 tracking-tight"
                        style={{ color: isDiscovered ? inspectedCompound.color : '#cbd5e1' }}
                      >
                        {isDiscovered ? inspectedCompound.formula : `${inspectedCompound.formula} (Target)`}
                      </h2>
                      <span className="text-lg font-bold text-slate-200">
                        {inspectedCompound.name}
                      </span>
                    </div>
                    <button
                      onClick={() => setInspectedCompound(null)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    >
                      ✕
                    </button>
                  </div>

                  {isDiscovered ? (
                    <div className="my-4 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300">
                      <span className="text-[10px] text-slate-500 uppercase block mb-0.5">Reaction Equation</span>
                      {inspectedCompound.equation}
                    </div>
                  ) : (
                    <div className="my-4 p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 font-mono text-xs text-amber-300">
                      <span className="text-[10px] text-amber-500 uppercase block mb-0.5">Synthesis Directive</span>
                      Synthesis pathway locked. Activate the Recipe Hint system in the Crucible to reveal elemental class clues!
                    </div>
                  )}

                  <p className="text-xs text-slate-300 leading-relaxed my-3">
                    {inspectedCompound.description}
                  </p>

                  {inspectedCompound.funFact && (
                    <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/50 text-xs text-indigo-200 leading-relaxed mb-4">
                      <span className="font-bold text-indigo-300 block mb-0.5">Chemical Lore:</span>
                      {inspectedCompound.funFact}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                    <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-800">
                      <span className="text-slate-500 text-[10px] uppercase block">Physical State</span>
                      <span className="text-slate-200 capitalize font-medium">{inspectedCompound.state}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-800">
                      <span className="text-slate-500 text-[10px] uppercase block">Bond Classification</span>
                      <span className="text-slate-200 capitalize font-medium">{inspectedCompound.bondType}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    {onSelectCompoundForHint && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectCompoundForHint(inspectedCompound);
                          setInspectedCompound(null);
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
                      >
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                        <span>Seek Recipe Hint in Crucible</span>
                      </button>
                    )}

                    {isDiscovered && onSelectCompoundForCrucible && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectCompoundForCrucible(inspectedCompound);
                          setInspectedCompound(null);
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-2"
                      >
                        <span>Load Crucible</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
