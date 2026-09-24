import React, { useState, useMemo } from 'react';
import {
  Flame,
  Zap,
  Sparkles,
  X,
  RefreshCw,
  Plus,
  HelpCircle,
  ArrowRight,
  Lightbulb,
  Search,
  Check,
  ChevronDown,
  Shuffle,
  Lock,
  CheckCircle,
} from 'lucide-react';
import { ReactorSlotItem, ReactionCondition, Compound } from '../types';
import { getRecipeClassHint, getBaseElementsForCompound } from '../utils/chemistry';
import { soundFx } from '../utils/audio';

interface CrucibleProps {
  slots: ReactorSlotItem[];
  onRemoveSlot: (instanceId: string) => void;
  onClearSlots: () => void;
  conditions: ReactionCondition;
  onToggleCondition: (type: 'heat' | 'electricity' | 'catalyst') => void;
  onSynthesize: () => void;
  isSynthesizing: boolean;
  onDropItem: (dataStr: string) => void;
  predictedProduct: Compound | null;
  // Recipe Hint feature
  showRecipeHint: boolean;
  onToggleRecipeHint: () => void;
  targetCompound: Compound | null;
  onSelectTargetCompound: (compound: Compound | null) => void;
  allCompounds: Compound[];
  discoveredCompoundIds: string[];
}

export const Crucible: React.FC<CrucibleProps> = ({
  slots,
  onRemoveSlot,
  onClearSlots,
  conditions,
  onToggleCondition,
  onSynthesize,
  isSynthesizing,
  onDropItem,
  predictedProduct,
  showRecipeHint,
  onToggleRecipeHint,
  targetCompound,
  onSelectTargetCompound,
  allCompounds,
  discoveredCompoundIds,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const data = e.dataTransfer.getData('text/plain');
    if (data) {
      onDropItem(data);
    }
  };

  // Recipe Class Hint for the currently targeted compound
  const recipeHint = useMemo(() => {
    if (!targetCompound) return null;
    return getRecipeClassHint(targetCompound);
  }, [targetCompound]);

  // Check which element categories are currently loaded into the reactor slots
  const loadedCategories = useMemo(() => {
    const cats = new Set<string>();
    for (const s of slots) {
      const elems = getBaseElementsForCompound(s.id);
      elems.forEach((e) => cats.add(e.category));
    }
    return cats;
  }, [slots]);

  // Filtered list of compounds for the target selector dropdown
  const filteredPickerCompounds = useMemo(() => {
    const q = pickerSearch.trim().toLowerCase();
    if (!q) {
      // Prioritize undiscovered compounds at top
      return [...allCompounds].sort((a, b) => {
        const aDiscovered = discoveredCompoundIds.includes(a.id) ? 1 : 0;
        const bDiscovered = discoveredCompoundIds.includes(b.id) ? 1 : 0;
        return aDiscovered - bDiscovered;
      }).slice(0, 35);
    }
    return allCompounds
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.formula.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      )
      .slice(0, 35);
  }, [allCompounds, pickerSearch, discoveredCompoundIds]);

  const handlePickRandomUndiscovered = () => {
    const undiscovered = allCompounds.filter((c) => !discoveredCompoundIds.includes(c.id));
    const pool = undiscovered.length > 0 ? undiscovered : allCompounds;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    if (picked) {
      onSelectTargetCompound(picked);
      setIsPickerOpen(false);
      soundFx.playAtomClick(1.2);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/60 rounded-2xl border border-slate-800 p-4 lg:p-5 shadow-2xl relative overflow-y-auto lg:overflow-visible backdrop-blur-md custom-scrollbar">
      {/* Background ambient reactor glow */}
      <div
        className={`absolute -top-32 -left-32 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          conditions.heat
            ? 'bg-amber-600/15'
            : conditions.electricity
            ? 'bg-cyan-600/15'
            : 'bg-indigo-600/10'
        }`}
      />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full blur-3xl pointer-events-none bg-purple-600/10" />

      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3 z-10 gap-2 shrink-0">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-slate-200 uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            Molecular Reaction Chamber
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Drop elements or compounds to form chemical bonds
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Recipe Hint Toggle Button */}
          <button
            id="toggle-recipe-hint"
            type="button"
            onClick={() => {
              onToggleRecipeHint();
              soundFx.playAtomClick(1.1);
            }}
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all duration-200 ${
              showRecipeHint
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                : 'bg-slate-800/70 text-slate-400 border-slate-700 hover:border-slate-600 hover:text-slate-200'
            }`}
            title="Toggle Recipe Hint for target compounds"
          >
            <Lightbulb
              className={`w-3.5 h-3.5 transition-colors ${
                showRecipeHint ? 'text-amber-400 fill-amber-400/20 animate-pulse' : 'text-slate-400'
              }`}
            />
            <span className="hidden sm:inline">Recipe Hint</span>
            <span
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                showRecipeHint ? 'bg-amber-400' : 'bg-slate-600'
              }`}
            />
          </button>

          {/* Reset Chamber Button */}
          {slots.length > 0 && (
            <button
              id="btn-clear-crucible"
              onClick={() => {
                onClearSlots();
                soundFx.playAtomClick(0.8);
              }}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 px-2 py-1.5 rounded-lg hover:bg-slate-800/80 transition"
              title="Clear all reactants"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Recipe Hint Interactive Panel (When Toggled On) */}
      {showRecipeHint && (
        <div className="mb-3 z-20 rounded-xl bg-slate-950/80 border border-amber-500/30 p-3 shadow-lg relative overflow-hidden backdrop-blur-md animate-scale-up">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* Target Molecule Selector Header */}
          <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex items-center justify-center w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 shrink-0">
                <Lightbulb className="w-3.5 h-3.5" />
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400/90 font-semibold shrink-0">
                Recipe Target:
              </span>

              {targetCompound ? (
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono font-bold text-xs text-slate-100 truncate">
                    {targetCompound.formula}
                  </span>
                  <span className="text-xs text-slate-400 truncate max-w-[140px] hidden sm:inline">
                    ({targetCompound.name})
                  </span>
                  {discoveredCompoundIds.includes(targetCompound.id) ? (
                    <span className="flex items-center gap-0.5 text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30 shrink-0">
                      <CheckCircle className="w-2.5 h-2.5" />
                      <span>Known</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-0.5 text-[10px] text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/30 shrink-0">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Target</span>
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-xs text-slate-400 italic">No molecule targeted</span>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsPickerOpen(!isPickerOpen)}
                className="flex items-center gap-1 text-[11px] font-semibold text-cyan-300 hover:text-cyan-200 bg-cyan-950/40 hover:bg-cyan-900/50 px-2 py-1 rounded border border-cyan-500/30 transition"
              >
                <span>{targetCompound ? 'Change' : 'Select'}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isPickerOpen ? 'rotate-180' : ''}`} />
              </button>

              <button
                type="button"
                onClick={handlePickRandomUndiscovered}
                title="Pick random undiscovered target"
                className="p-1 rounded text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition"
              >
                <Shuffle className="w-3.5 h-3.5" />
              </button>

              {targetCompound && (
                <button
                  type="button"
                  onClick={() => onSelectTargetCompound(null)}
                  title="Clear target"
                  className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Molecule Search Dropdown Popover */}
          {isPickerOpen && (
            <div className="mb-3 p-2.5 rounded-lg bg-slate-900 border border-slate-700 shadow-2xl z-30 animate-scale-up">
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  placeholder="Search molecules by name, formula, or category..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  autoFocus
                />
              </div>

              <div className="max-h-44 overflow-y-auto space-y-1 custom-scrollbar pr-1">
                {filteredPickerCompounds.length === 0 ? (
                  <p className="text-center text-xs text-slate-500 py-3">No matching compounds found.</p>
                ) : (
                  filteredPickerCompounds.map((comp) => {
                    const isDiscovered = discoveredCompoundIds.includes(comp.id);
                    const isSelected = targetCompound?.id === comp.id;

                    return (
                      <button
                        key={comp.id}
                        type="button"
                        onClick={() => {
                          onSelectTargetCompound(comp);
                          setIsPickerOpen(false);
                          soundFx.playAtomClick(1.2);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left transition ${
                          isSelected
                            ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                            : 'hover:bg-slate-800/80 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono font-bold text-xs text-cyan-300 shrink-0">
                            {comp.formula}
                          </span>
                          <span className="text-xs text-slate-200 truncate">{comp.name}</span>
                          <span className="text-[10px] text-slate-500 capitalize shrink-0 font-mono">
                            {comp.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          {isDiscovered ? (
                            <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-1 rounded">
                              Discovered
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-400 bg-amber-950/40 px-1 rounded">
                              Undiscovered
                            </span>
                          )}
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Vague Elemental Class Hint Details */}
          {recipeHint ? (
            <div className="space-y-2">
              {/* Element Class Badges */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-400 uppercase font-mono tracking-wider font-semibold mr-1">
                  Required Classes:
                </span>
                {recipeHint.elementClasses.map((cls) => {
                  const isLoaded =
                    loadedCategories.has(cls.id) ||
                    (cls.id === 'organic-backbone' && loadedCategories.has('nonmetal'));

                  return (
                    <span
                      key={cls.id}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border transition-all ${
                        cls.badgeBg
                      } ${cls.badgeColor} ${cls.badgeBorder} ${
                        isLoaded ? 'ring-1 ring-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.3)]' : ''
                      }`}
                      title={`Representative elements: ${cls.examples.join(', ')}`}
                    >
                      <span>{cls.name}</span>
                      {isLoaded ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : null}
                    </span>
                  );
                })}
              </div>

              {/* Vague Clue Prose */}
              <div className="text-xs text-slate-300 bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 leading-relaxed font-sans flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="italic text-slate-200">{recipeHint.vagueHint}</p>
                  {recipeHint.energyHint && (
                    <p className="text-[11px] font-mono text-cyan-300 font-medium">
                      {recipeHint.energyHint}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 py-1 flex items-center justify-between">
              <span>Choose any molecule above to uncover vague clues about required element classes.</span>
              <button
                type="button"
                onClick={handlePickRandomUndiscovered}
                className="text-amber-400 hover:text-amber-300 underline font-medium ml-2 shrink-0"
              >
                Auto-target next undiscovered
              </button>
            </div>
          )}
        </div>
      )}

      {/* Central Drop Zone & Fusion Chamber */}
      <div
        id="crucible-drop-zone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex-1 min-h-[190px] max-h-[320px] rounded-2xl border-2 border-dashed transition-all duration-300 relative flex flex-col items-center justify-center p-4 sm:p-5 text-center overflow-hidden ${
          isDragOver
            ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_30px_rgba(6,182,212,0.3)] scale-[1.01]'
            : slots.length > 0
            ? 'border-slate-700/80 bg-slate-950/60'
            : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
        }`}
      >
        {/* Visual orbital rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div
            className={`w-64 h-64 rounded-full border border-slate-800/50 transition-all duration-1000 ${
              slots.length > 0 ? 'border-cyan-500/20 animate-spin-slow' : ''
            }`}
          />
          <div
            className={`w-96 h-96 rounded-full border border-slate-800/30 transition-all duration-1000 ${
              slots.length > 0 ? 'border-indigo-500/20 animate-spin-reverse' : ''
            }`}
          />
        </div>

        {slots.length === 0 ? (
          <div className="z-10 flex flex-col items-center max-w-sm px-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/50 border border-slate-700/80 flex items-center justify-center mb-3 shadow-inner text-slate-400">
              <Plus className="w-6 h-6 text-cyan-400/80" />
            </div>
            <p className="text-sm font-medium text-slate-300">
              Drop Elements or Compounds Here
            </p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Drag items from the shelf or tap them directly to load reactants into the fusion field.
            </p>
          </div>
        ) : (
          <div className="z-10 w-full flex flex-col items-center justify-center gap-4">
            {/* Reactant items grid in chamber */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg max-h-[130px] overflow-y-auto shelf-scroll-area p-1">
              {slots.map((item, idx) => (
                <div
                  key={item.instanceId}
                  className="group relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 shadow-md hover:border-cyan-500/60 transition-all duration-200 animate-scale-up"
                  style={{
                    borderColor: `${item.color}55`,
                    boxShadow: `0 0 15px ${item.color}15`,
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs text-slate-950 shadow-md"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.symbolOrFormula}
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-semibold text-slate-200 block truncate max-w-[100px]">
                      {item.name}
                    </span>
                    <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider">
                      {item.type}
                    </span>
                  </div>
                  <button
                    id={`btn-remove-slot-${idx}`}
                    onClick={() => {
                      onRemoveSlot(item.instanceId);
                      soundFx.playAtomClick(0.9);
                    }}
                    title="Remove from chamber"
                    className="ml-1 p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-700/80 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Reaction readiness preview badge */}
            {predictedProduct ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Reaction Possible:</span>
                <span className="font-bold text-emerald-200">{predictedProduct.formula}</span>
                <span className="text-emerald-400/80 font-sans">({predictedProduct.name})</span>
              </div>
            ) : slots.some((s) => s.id === 'He') ? (
              <div className="flex items-center gap-1.5 text-xs text-sky-300 font-mono bg-sky-950/60 px-3.5 py-1.5 rounded-full border border-sky-500/40">
                <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                <span>Inert Gas Notice: Helium requires Electric Arc (⚡) + Hydrogen to bond into HeH⁺</span>
              </div>
            ) : slots.length >= 2 ? (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Adjust conditions or reactants to trigger fusion</span>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Conditions Panel: Heat, Electricity, Catalyst */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 z-10 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
            Environmental Energy Controls
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            {Object.values(conditions).filter(Boolean).length} Active Energy Field(s)
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {/* Thermal Energy */}
          <button
            id="toggle-heat"
            type="button"
            onClick={() => {
              onToggleCondition('heat');
              soundFx.playHeatToggle(!conditions.heat);
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
              conditions.heat
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300'
            }`}
          >
            <Flame
              className={`w-4 h-4 transition-transform ${
                conditions.heat ? 'text-amber-400 animate-bounce' : 'text-slate-500'
              }`}
            />
            <span>Heat (Δ)</span>
          </button>

          {/* Electric Arc */}
          <button
            id="toggle-electricity"
            type="button"
            onClick={() => {
              onToggleCondition('electricity');
              soundFx.playElectricityToggle(!conditions.electricity);
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
              conditions.electricity
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300'
            }`}
          >
            <Zap
              className={`w-4 h-4 transition-transform ${
                conditions.electricity ? 'text-cyan-400 animate-pulse' : 'text-slate-500'
              }`}
            />
            <span>Electric Arc (⚡)</span>
          </button>

          {/* Catalyst */}
          <button
            id="toggle-catalyst"
            type="button"
            onClick={() => {
              onToggleCondition('catalyst');
              soundFx.playAtomClick(1.3);
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
              conditions.catalyst
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.25)]'
                : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300'
            }`}
          >
            <Sparkles
              className={`w-4 h-4 transition-transform ${
                conditions.catalyst ? 'text-purple-400 animate-spin-slow' : 'text-slate-500'
              }`}
            />
            <span>Catalyst (Pt)</span>
          </button>
        </div>
      </div>

      {/* Synthesis Action Button */}
      <div className="mt-3 pt-1 z-10 shrink-0">
        <button
          id="btn-synthesize-action"
          type="button"
          onClick={onSynthesize}
          disabled={slots.length === 0 || isSynthesizing}
          className={`w-full py-3 px-6 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-3 shadow-xl ${
            slots.length === 0
              ? 'bg-slate-800/60 text-slate-500 border border-slate-800 cursor-not-allowed'
              : predictedProduct
              ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 border border-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:brightness-110 active:scale-[0.99]'
              : 'bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 text-white border border-cyan-400/40 shadow-[0_0_25px_rgba(99,102,241,0.3)] hover:brightness-110 active:scale-[0.99]'
          }`}
        >
          {isSynthesizing ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Simulating Molecular Bonding...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Synthesize & React</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
