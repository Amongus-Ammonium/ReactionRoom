import React, { useState } from 'react';
import { Sparkles, Lock, CheckCircle2, Info, Plus } from 'lucide-react';
import { ChemicalElement } from '../types';
import { RESEARCH_TASKS } from '../data/tasks';
import { soundFx } from '../utils/audio';

interface PeriodicViewProps {
  allElements: ChemicalElement[];
  unlockedElementIds: string[];
  onAddElementToCrucible: (element: ChemicalElement) => void;
  onGoToTasks: () => void;
}

export const PeriodicView: React.FC<PeriodicViewProps> = ({
  allElements,
  unlockedElementIds,
  onAddElementToCrucible,
  onGoToTasks,
}) => {
  const [selectedElement, setSelectedElement] = useState<ChemicalElement | null>(null);

  const getUnlockHint = (elementId: string) => {
    const task = RESEARCH_TASKS.find((t) => t.rewardElementId === elementId);
    if (task) {
      return `Complete Research Task "${task.title}" (Synthesize ${task.targetFormula}) to unlock.`;
    }
    return 'Unlocked through advanced chemical experimentation.';
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-xs uppercase tracking-wider font-mono font-bold text-purple-400">
              Elemental Matrix
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Periodic Elements & Unlocks
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track your available elemental reagents and review tasks required to unlock new, rare matter.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
          <div className="text-right">
            <span className="text-2xl font-extrabold font-mono text-purple-400">
              {unlockedElementIds.length}
              <span className="text-slate-500 font-normal text-sm">/{allElements.length}</span>
            </span>
            <span className="text-[10px] text-slate-400 block">Elements Unlocked</span>
          </div>
        </div>
      </div>

      {/* Grid of Elements */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
        {allElements.map((elem) => {
          const isUnlocked = unlockedElementIds.includes(elem.id);

          return (
            <div
              key={elem.id}
              onClick={() => {
                setSelectedElement(elem);
                soundFx.playAtomClick(1.1);
              }}
              className={`flex flex-col p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none ${
                isUnlocked
                  ? 'bg-slate-900/70 border-slate-800 hover:border-purple-500/60 hover:bg-slate-900/90 shadow-sm hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:scale-[1.02]'
                  : 'bg-slate-950/40 border-slate-850 opacity-60 hover:opacity-80'
              }`}
              style={{
                borderLeftWidth: '4px',
                borderLeftColor: isUnlocked ? elem.color : '#334155',
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-mono text-slate-500">
                  #{elem.atomicNumber}
                </span>
                {isUnlocked ? (
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Available
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-amber-400/80 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Locked
                  </span>
                )}
              </div>

              {/* Chemical Symbol */}
              <div className="my-2 text-center py-2">
                <span
                  className="font-mono font-extrabold text-3xl tracking-tight inline-block"
                  style={{ color: isUnlocked ? elem.color : '#64748b' }}
                >
                  {elem.symbol}
                </span>
                <span className="block text-xs font-semibold text-slate-200 mt-1">
                  {elem.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400 block">
                  {elem.atomicMass} u
                </span>
              </div>

              {/* Category Footer */}
              <div className="mt-auto pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="capitalize truncate">{elem.category}</span>
                <span className="uppercase">{elem.state}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Element Modal */}
      {selectedElement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6"
            style={{ boxShadow: `0 0 50px ${selectedElement.color}30` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  Atomic Number: {selectedElement.atomicNumber}
                </span>
                <div className="flex items-baseline gap-3 mt-2">
                  <span
                    className="text-4xl font-mono font-extrabold"
                    style={{ color: selectedElement.color }}
                  >
                    {selectedElement.symbol}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-100">
                    {selectedElement.name}
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setSelectedElement(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed my-4">
              {selectedElement.description}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs mb-4">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase block">Valence Electrons</span>
                <span className="text-slate-200 font-mono font-bold mt-0.5 block">
                  {selectedElement.valence}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase block">Standard State</span>
                <span className="text-slate-200 capitalize font-medium mt-0.5 block">
                  {selectedElement.state}
                </span>
              </div>
            </div>

            {unlockedElementIds.includes(selectedElement.id) ? (
              <button
                onClick={() => {
                  onAddElementToCrucible(selectedElement);
                  setSelectedElement(null);
                }}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Load into Reaction Crucible</span>
              </button>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-xs text-amber-200">
                  <span className="font-bold block mb-1">Unlock Requirement:</span>
                  {getUnlockHint(selectedElement.id)}
                </div>
                <button
                  onClick={() => {
                    setSelectedElement(null);
                    onGoToTasks();
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider transition flex items-center justify-center gap-2"
                >
                  <span>Go to Research Tasks</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
