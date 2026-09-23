import React, { useState } from 'react';
import { Search, Plus, Sparkles, Lock, Info } from 'lucide-react';
import { ChemicalElement, ElementCategory } from '../types';
import { soundFx } from '../utils/audio';

interface ElementShelfProps {
  unlockedElements: ChemicalElement[];
  onAddElement: (element: ChemicalElement) => void;
  allElementsCount: number;
}

const CATEGORY_LABELS: { [key in ElementCategory | 'all']: string } = {
  all: 'All',
  nonmetal: 'Nonmetals',
  'alkali-metal': 'Alkali',
  'alkaline-earth': 'Alkaline Earth',
  'transition-metal': 'Transition',
  'post-transition': 'Post-Trans',
  metalloid: 'Metalloids',
  halogen: 'Halogens',
  'noble-gas': 'Noble Gases',
  actinide: 'Actinides',
};

export const ElementShelf: React.FC<ElementShelfProps> = ({
  unlockedElements,
  onAddElement,
  allElementsCount,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ElementCategory | 'all'>('all');
  const [hoveredElement, setHoveredElement] = useState<ChemicalElement | null>(null);

  const filtered = unlockedElements.filter((elem) => {
    const matchesSearch =
      elem.name.toLowerCase().includes(search.toLowerCase()) ||
      elem.symbol.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || elem.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleDragStart = (e: React.DragEvent, element: ChemicalElement) => {
    e.dataTransfer.setData(
      'text/plain',
      JSON.stringify({ type: 'element', id: element.id })
    );
    e.dataTransfer.effectAllowed = 'copy';
    soundFx.playAtomClick(1.1);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 rounded-2xl border border-slate-800 p-4 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-200">
            Unlocked Elements
          </h3>
          <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800/60">
            {unlockedElements.length}/{allElementsCount}
          </span>
        </div>
        <span className="text-[11px] text-slate-400 hidden sm:inline">
          Drag or tap to add
        </span>
      </div>

      {/* Search & Categories */}
      <div className="mt-3 space-y-2.5">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-element-search"
            type="text"
            placeholder="Search element or symbol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition"
          />
        </div>

        {/* Category horizontal scroll */}
        <div className="flex gap-1.5 overflow-x-auto pb-1.5 no-scrollbar text-xs">
          {(Object.keys(CATEGORY_LABELS) as (ElementCategory | 'all')[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap text-[11px] transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-950/40 text-slate-400 border border-slate-800 hover:text-slate-300'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Elements Grid */}
      <div className="flex-1 overflow-y-auto mt-3 pr-1 space-y-2 min-h-[160px] max-h-[360px] md:max-h-none">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {filtered.map((elem) => (
            <div
              key={elem.id}
              draggable
              onDragStart={(e) => handleDragStart(e, elem)}
              onClick={() => {
                onAddElement(elem);
                soundFx.playAtomClick(1.0);
              }}
              onMouseEnter={() => setHoveredElement(elem)}
              onMouseLeave={() => setHoveredElement(null)}
              className="group relative flex flex-col p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/90 hover:border-cyan-500/60 hover:bg-slate-900/80 cursor-pointer select-none transition-all duration-200 hover:scale-[1.02] shadow-sm hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]"
              style={{
                borderLeftWidth: '3px',
                borderLeftColor: elem.color,
              }}
            >
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-mono text-slate-500">
                  #{elem.atomicNumber}
                </span>
                <span className="text-[9px] uppercase font-mono px-1 rounded bg-slate-800 text-slate-400">
                  {elem.state}
                </span>
              </div>

              <div className="my-1 text-center">
                <span
                  className="font-mono font-extrabold text-2xl tracking-tight transition-transform group-hover:scale-110 inline-block"
                  style={{ color: elem.color }}
                >
                  {elem.symbol}
                </span>
              </div>

              <div className="flex items-center justify-between mt-auto pt-1 border-t border-slate-800/60 text-slate-400 group-hover:text-slate-200">
                <span className="text-xs font-medium truncate">{elem.name}</span>
                <Plus className="w-3.5 h-3.5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-8 text-slate-500 text-xs">
            No unlocked elements match filter
          </div>
        )}
      </div>

      {/* Hover preview inspector footer */}
      {hoveredElement && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs flex items-start gap-2 animate-fade-in bg-slate-950/40 p-2.5 rounded-xl">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-slate-200 flex items-center gap-2">
              <span>{hoveredElement.name} ({hoveredElement.symbol})</span>
              <span className="text-[10px] font-mono text-slate-400">
                Mass: {hoveredElement.atomicMass} u
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              {hoveredElement.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
