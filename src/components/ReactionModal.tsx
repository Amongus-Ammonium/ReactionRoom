import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Check, Flame, ShieldAlert, ArrowRight, X, AlertCircle } from 'lucide-react';
import { Compound, Task } from '../types';

interface ReactionModalProps {
  compound: Compound | null;
  onClose: () => void;
  completedTask?: Task | null;
  isFirstDiscovery: boolean;
}

export const ReactionModal: React.FC<ReactionModalProps> = ({
  compound,
  onClose,
  completedTask,
  isFirstDiscovery,
}) => {
  useEffect(() => {
    if (compound) {
      // Fire confetti burst for celebration
      confetti({
        particleCount: isFirstDiscovery ? 70 : 35,
        spread: 60,
        origin: { y: 0.6 },
        colors: [compound.color, '#38bdf8', '#818cf8', '#facc15', '#ffffff'],
      });
    }
  }, [compound, isFirstDiscovery]);

  if (!compound) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 md:p-8 animate-scale-up max-h-[90vh] overflow-y-auto custom-scrollbar"
        style={{
          boxShadow: `0 0 50px ${compound.color}25`,
        }}
      >
        {/* Glow backdrop */}
        <div
          className="absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl pointer-events-none opacity-40"
          style={{ backgroundColor: compound.color }}
        />

        {/* Close icon */}
        <button
          id="btn-close-reaction-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Discovery tag */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-700/60">
            <Sparkles className="w-3.5 h-3.5" />
            {isFirstDiscovery ? 'New Compound Discovered!' : 'Synthesis Successful'}
          </span>
          <span className="text-xs uppercase font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
            {compound.category}
          </span>
        </div>

        {/* Main Chemical Header */}
        <div className="flex items-baseline gap-4 my-2">
          <h2
            className="text-4xl md:text-5xl font-mono font-extrabold tracking-tight"
            style={{ color: compound.color }}
          >
            {compound.formula}
          </h2>
          <span className="text-xl font-bold text-slate-200">
            {compound.name}
          </span>
        </div>

        {/* Balanced Equation */}
        <div className="my-4 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 font-mono text-xs text-slate-300 flex items-center justify-between">
          <div>
            <span className="text-slate-500 uppercase text-[10px] tracking-wider block mb-0.5">
              Chemical Equation
            </span>
            <span className="text-cyan-300 font-semibold text-sm">
              {compound.equation}
            </span>
          </div>
          {compound.enthalpy && (
            <div className="text-right text-[11px] text-slate-400">
              <span className="text-slate-500 block text-[9px] uppercase">Enthalpy</span>
              <span className="font-mono text-amber-400">{compound.enthalpy}</span>
            </div>
          )}
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-2 gap-2.5 my-3 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase font-mono block">State & Appearance</span>
            <span className="text-slate-200 font-medium capitalize mt-0.5 block truncate">
              {compound.state} • {compound.appearance}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase font-mono block">Bond Type</span>
            <span className="text-slate-200 font-medium capitalize mt-0.5 block truncate">
              {compound.bondType} bonding
            </span>
          </div>
        </div>

        {/* Description & Scientific Lore */}
        <p className="text-xs text-slate-300 leading-relaxed my-3">
          {compound.description}
        </p>

        {compound.funFact && (
          <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/50 text-xs text-indigo-200/90 leading-relaxed mb-4">
            <span className="font-bold text-indigo-300 block mb-0.5">Scientific Insight:</span>
            {compound.funFact}
          </div>
        )}

        {/* Task completion banner if triggered */}
        {completedTask && (
          <div className="p-3.5 rounded-xl bg-amber-950/50 border border-amber-500/60 flex items-center justify-between gap-3 mb-4 animate-pulse">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-amber-400 block">
                Research Milestone Accomplished!
              </span>
              <span className="text-xs font-semibold text-amber-100">
                {completedTask.title}: Unlocked {completedTask.rewardElementName} ({completedTask.rewardElementSymbol})
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-bold font-mono text-sm flex items-center justify-center shrink-0">
              {completedTask.rewardElementSymbol}
            </div>
          </div>
        )}

        {/* Action button */}
        <button
          id="btn-collect-compound"
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm tracking-wide transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
        >
          <Check className="w-4 h-4" />
          <span>Add to Laboratory Reagents</span>
        </button>
      </div>
    </div>
  );
};
