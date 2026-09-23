import React from 'react';
import { Atom, FlaskConical, CheckSquare, BookOpen, Volume2, VolumeX, RotateCcw, Sparkles } from 'lucide-react';
import { ActiveTab } from '../types';
import { soundFx } from '../utils/audio';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  discoveredCount: number;
  totalCompoundsCount: number;
  unlockedElementsCount: number;
  totalElementsCount: number;
  pendingTasksCount: number;
  onResetProgress: () => void;
  soundEnabled: boolean;
  setSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  discoveredCount,
  totalCompoundsCount,
  unlockedElementsCount,
  totalElementsCount,
  pendingTasksCount,
  onResetProgress,
  soundEnabled,
  setSoundEnabled,
}) => {
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFx.enabled = next;
    if (next) soundFx.playAtomClick(1.5);
  };

  const percentDiscovered = Math.round((discoveredCount / totalCompoundsCount) * 100);

  return (
    <header className="border-b border-slate-800/80 bg-[#0c101a]/95 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Stats */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-600/20 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
              <Atom className="w-6 h-6 text-cyan-400 animate-spin-slow" />
              <div className="absolute inset-0 rounded-xl border border-cyan-400/20 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                  ChemiVerse
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 font-semibold tracking-wider">
                  Molecular Lab
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Elements & Reaction Explorer
              </p>
            </div>
          </div>

          {/* Progress Counters (Mobile compact) */}
          <div className="flex items-center gap-3 md:hidden">
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-cyan-300">
                {discoveredCount}/{totalCompoundsCount}
              </span>
              <span className="text-[10px] text-slate-500 block">Synthesized</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 w-full sm:w-auto justify-center">
          <button
            id="tab-lab"
            onClick={() => {
              setActiveTab('lab');
              soundFx.playAtomClick(1.0);
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'lab'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <FlaskConical className="w-4 h-4 text-cyan-400" />
            <span>Crucible Lab</span>
          </button>

          <button
            id="tab-tasks"
            onClick={() => {
              setActiveTab('tasks');
              soundFx.playAtomClick(1.1);
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all relative ${
              activeTab === 'tasks'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <CheckSquare className="w-4 h-4 text-amber-400" />
            <span>Tasks</span>
            {pendingTasksCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center justify-center animate-pulse">
                {pendingTasksCount}
              </span>
            )}
          </button>

          <button
            id="tab-compendium"
            onClick={() => {
              setActiveTab('compendium');
              soundFx.playAtomClick(1.2);
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'compendium'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Compendium</span>
            <span className="text-[10px] font-mono text-indigo-300/80 bg-indigo-950/60 px-1 rounded">
              {discoveredCount}
            </span>
          </button>

          <button
            id="tab-periodic"
            onClick={() => {
              setActiveTab('periodic');
              soundFx.playAtomClick(1.3);
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'periodic'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Elements</span>
            <span className="text-[10px] font-mono text-purple-300/80 bg-purple-950/60 px-1 rounded">
              {unlockedElementsCount}/{totalElementsCount}
            </span>
          </button>
        </nav>

        {/* Global Progress & Utility Controls */}
        <div className="hidden md:flex items-center gap-4">
          {/* Progress metric */}
          <div className="flex items-center gap-3 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${percentDiscovered}%` }}
              />
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-slate-200">
                {discoveredCount}
                <span className="text-slate-500 font-normal">/{totalCompoundsCount}</span>
              </span>
              <span className="text-[10px] text-slate-400 block -mt-0.5">Compounds</span>
            </div>
          </div>

          {/* Sound toggle */}
          <button
            id="btn-sound-toggle"
            onClick={toggleSound}
            title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Reset progress */}
          <button
            id="btn-reset-progress"
            onClick={onResetProgress}
            title="Reset Experiment & Progress"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
