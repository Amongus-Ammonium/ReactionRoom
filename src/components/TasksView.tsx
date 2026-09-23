import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Lock, Gift, ArrowRight, Sparkles, HelpCircle, FlaskConical, Award, Lightbulb } from 'lucide-react';
import { Task, Compound } from '../types';
import { soundFx } from '../utils/audio';

interface TasksViewProps {
  tasks: Task[];
  completedTaskIds: string[];
  discoveredCompoundIds: string[];
  unlockedElementIds: string[];
  onClaimTaskReward: (task: Task) => void;
  onGoToLab: () => void;
  onSelectCompoundForHint?: (compoundId: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  completedTaskIds,
  discoveredCompoundIds,
  unlockedElementIds,
  onClaimTaskReward,
  onGoToLab,
  onSelectCompoundForHint,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const completedCount = completedTaskIds.length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  const filteredTasks = tasks.filter((task) => {
    const isCompleted = completedTaskIds.includes(task.id);
    if (filter === 'completed') return isCompleted;
    if (filter === 'active') return !isCompleted;
    return true;
  });

  const handleClaim = (task: Task) => {
    soundFx.playTaskUnlocked();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#38bdf8', '#10b981', '#f43f5e', '#a855f7'],
    });
    onClaimTaskReward(task);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6">
      {/* Hero Banner & Quest Roadmap Header */}
      <div className="relative rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/30 p-6 md:p-8 overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span className="text-xs uppercase tracking-wider font-mono font-bold text-amber-400">
                Alchemical Research Directive
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
              Synthesis Tasks & Elemental Rewards
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl mt-1 leading-relaxed">
              Synthesize specific chemical targets to unlock rare elements, heavy transition metals,
              halogens, catalysts, and nuclear materials for your laboratory shelf.
            </p>
          </div>

          {/* Progress gauge */}
          <div className="flex flex-col items-end shrink-0 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-amber-400">
                {completedCount}
              </span>
              <span className="text-sm font-mono text-slate-500">/{tasks.length}</span>
              <span className="text-xs text-slate-400 font-sans ml-1">Completed</span>
            </div>
            <div className="w-48 bg-slate-800 h-2.5 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-slate-400 mt-1">
              {progressPercent}% Exploration Mastered
            </span>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/80">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                filter === f
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {f === 'all' ? 'All Tasks' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.map((task, idx) => {
          const isCompleted = completedTaskIds.includes(task.id);
          const hasSynthesizedTarget = discoveredCompoundIds.includes(task.targetCompoundId);
          const isUnlocked = unlockedElementIds.includes(task.rewardElementId);

          // Can claim if target compound has been created but task not marked completed
          const readyToClaim = hasSynthesizedTarget && !isCompleted;

          return (
            <div
              key={task.id}
              className={`relative flex flex-col rounded-2xl border p-5 transition-all duration-300 ${
                isCompleted
                  ? 'bg-slate-950/40 border-emerald-900/40 opacity-90'
                  : readyToClaim
                  ? 'bg-slate-900/90 border-amber-500/60 shadow-[0_0_30px_rgba(245,158,11,0.2)] scale-[1.01]'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Top Meta Bar */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                    {task.subtitle}
                  </span>
                  <h3 className="text-base font-bold text-slate-200 mt-0.5">
                    {task.title}
                  </h3>
                </div>

                {isCompleted ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 text-xs font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Completed
                  </span>
                ) : readyToClaim ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500 text-xs font-semibold animate-pulse">
                    <Sparkles className="w-3.5 h-3.5" />
                    Ready to Claim!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-medium">
                    In Progress
                  </span>
                )}
              </div>

              {/* Objective Description */}
              <p className="text-xs text-slate-300 leading-relaxed my-2">
                {task.description}
              </p>

              {/* Target & Reward Box */}
              <div className="grid grid-cols-2 gap-2.5 my-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                {/* Target */}
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">
                    Target Compound
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="font-mono font-bold text-cyan-400 text-sm">
                      {task.targetFormula}
                    </span>
                    <span className="text-xs text-slate-300 truncate">
                      ({task.targetCompoundName})
                    </span>
                  </div>
                </div>

                {/* Reward Element */}
                <div className="border-l border-slate-800 pl-3">
                  <span className="text-[10px] uppercase font-mono text-amber-400/90 block">
                    Element Reward
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="w-5 h-5 rounded-md bg-amber-500 text-slate-950 font-bold font-mono text-xs flex items-center justify-center shrink-0">
                      {task.rewardElementSymbol}
                    </span>
                    <span className="text-xs font-semibold text-amber-200 truncate">
                      {task.rewardElementName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hint & Lore accordion */}
              <div className="text-[11px] text-slate-400 bg-slate-800/30 p-2.5 rounded-lg border border-slate-800/60 flex items-start gap-2 mb-4">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-300">Synthesis Hint: </span>
                  {task.hint}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-auto pt-2">
                {readyToClaim ? (
                  <button
                    id={`btn-claim-task-${task.id}`}
                    onClick={() => handleClaim(task)}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all hover:brightness-110 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                  >
                    <Gift className="w-4 h-4" />
                    <span>Claim {task.rewardElementName} ({task.rewardElementSymbol})</span>
                  </button>
                ) : isCompleted ? (
                  <div className="text-center text-xs text-emerald-400 font-mono py-1">
                    ✓ Reward Unlocked on Laboratory Shelf
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectCompoundForHint) {
                          onSelectCompoundForHint(task.targetCompoundId);
                        } else {
                          onGoToLab();
                        }
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-sm"
                      title="Activate Recipe Hint in Crucible"
                    >
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                      <span>Recipe Hint</span>
                    </button>
                    <button
                      type="button"
                      onClick={onGoToLab}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700 text-xs font-medium transition flex items-center justify-center gap-1.5"
                    >
                      <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Open Lab</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-0.5 opacity-60" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
