import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Crucible } from './components/Crucible';
import { ElementShelf } from './components/ElementShelf';
import { CompoundShelf } from './components/CompoundShelf';
import { ReactionModal } from './components/ReactionModal';
import { TasksView } from './components/TasksView';
import { CompendiumView } from './components/CompendiumView';
import { PeriodicView } from './components/PeriodicView';

import { ALL_ELEMENTS, STARTER_ELEMENT_IDS } from './data/elements';
import { ALL_COMPOUNDS } from './data/compounds';
import { RESEARCH_TASKS } from './data/tasks';
import {
  ChemicalElement,
  Compound,
  ActiveTab,
  ReactorSlotItem,
  ReactionCondition,
  Task,
} from './types';
import { findReaction, getItemData, getElementById, getCompoundById, getInertGasReactionFeedback } from './utils/chemistry';
import { soundFx } from './utils/audio';

const STORAGE_KEY = 'chemiverse_state_v2';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('lab');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Persistent user state
  const [unlockedElementIds, setUnlockedElementIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.elements) && parsed.elements.length > 0) {
          return parsed.elements;
        }
      }
    } catch {
      // Fallback
    }
    return STARTER_ELEMENT_IDS;
  });

  const [discoveredCompoundIds, setDiscoveredCompoundIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.compounds)) {
          return parsed.compounds;
        }
      }
    } catch {
      // Fallback
    }
    return [];
  });

  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.tasks)) {
          return parsed.tasks;
        }
      }
    } catch {
      // Fallback
    }
    return [];
  });

  // Reaction Crucible state
  const [slots, setSlots] = useState<ReactorSlotItem[]>([]);
  const [conditions, setConditions] = useState<ReactionCondition>({
    heat: false,
    electricity: false,
    catalyst: false,
  });
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // Recipe Hint state
  const [showRecipeHint, setShowRecipeHint] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('chemiverse_recipe_hint_active');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [targetCompoundForHint, setTargetCompoundForHint] = useState<Compound | null>(() => {
    try {
      const saved = localStorage.getItem('chemiverse_target_compound');
      if (saved) {
        return ALL_COMPOUNDS.find((c) => c.id === saved) || null;
      }
    } catch {
      // Fallback
    }
    return null;
  });

  // Modals & Notifications
  const [reactionModalData, setReactionModalData] = useState<{
    compound: Compound;
    completedTask: Task | null;
    isFirstDiscovery: boolean;
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'info' | 'error' | 'success' } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Persist progression state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          elements: unlockedElementIds,
          compounds: discoveredCompoundIds,
          tasks: completedTaskIds,
        })
      );
      localStorage.setItem('chemiverse_recipe_hint_active', String(showRecipeHint));
      if (targetCompoundForHint) {
        localStorage.setItem('chemiverse_target_compound', targetCompoundForHint.id);
      } else {
        localStorage.removeItem('chemiverse_target_compound');
      }
    } catch {
      // Storage unavailable
    }
  }, [unlockedElementIds, discoveredCompoundIds, completedTaskIds, showRecipeHint, targetCompoundForHint]);

  // Derived datasets
  const unlockedElements = useMemo(() => {
    return ALL_ELEMENTS.filter((e) => unlockedElementIds.includes(e.id));
  }, [unlockedElementIds]);

  const discoveredCompounds = useMemo(() => {
    return ALL_COMPOUNDS.filter((c) => discoveredCompoundIds.includes(c.id));
  }, [discoveredCompoundIds]);

  // Real-time reaction prediction in crucible
  const predictedProduct = useMemo(() => {
    if (slots.length === 0) return null;
    return findReaction(
      slots.map((s) => s.id),
      conditions
    );
  }, [slots, conditions]);

  // Calculate pending / ready-to-claim tasks
  const pendingTasksCount = useMemo(() => {
    return RESEARCH_TASKS.filter(
      (t) => discoveredCompoundIds.includes(t.targetCompoundId) && !completedTaskIds.includes(t.id)
    ).length;
  }, [discoveredCompoundIds, completedTaskIds]);

  // Toast helper
  const showToast = (text: string, type: 'info' | 'error' | 'success' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((cur) => (cur?.text === text ? null : cur));
    }, 3800);
  };

  // Add Item to Crucible
  const addItemToCrucible = (id: string, type: 'element' | 'compound') => {
    const data = getItemData(id);
    if (!data) return;

    if (slots.length >= 6) {
      showToast('Crucible capacity reached (Max 6 reactants).', 'error');
      soundFx.playReactionFail();
      return;
    }

    const newItem: ReactorSlotItem = {
      instanceId: `${id}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      id,
      name: data.name,
      symbolOrFormula: data.formula,
      type,
      color: data.color,
    };

    setSlots((prev) => [...prev, newItem]);
    soundFx.playAtomClick(1.0 + slots.length * 0.1);
  };

  const handleDropItem = (dataStr: string) => {
    try {
      const parsed = JSON.parse(dataStr);
      if (parsed.id && parsed.type) {
        addItemToCrucible(parsed.id, parsed.type);
      }
    } catch {
      // Ignored
    }
  };

  const handleRemoveSlot = (instanceId: string) => {
    setSlots((prev) => prev.filter((s) => s.instanceId !== instanceId));
  };

  const handleClearSlots = () => {
    setSlots([]);
  };

  const handleToggleCondition = (type: 'heat' | 'electricity' | 'catalyst') => {
    setConditions((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  // Reaction Action
  const handleSynthesize = () => {
    if (slots.length === 0 || isSynthesizing) return;

    setIsSynthesizing(true);
    soundFx.playAtomClick(1.4);

    setTimeout(() => {
      setIsSynthesizing(false);
      const reactantIds = slots.map((s) => s.id);
      const product = findReaction(reactantIds, conditions);

      if (product) {
        soundFx.playReactionSuccess();
        const isFirst = !discoveredCompoundIds.includes(product.id);

        if (isFirst) {
          setDiscoveredCompoundIds((prev) => [...prev, product.id]);
        }

        // Check if this synthesis fulfills any research task
        let fulfilledTask: Task | null = null;
        const matchingTask = RESEARCH_TASKS.find((t) => t.targetCompoundId === product.id);

        if (matchingTask && !completedTaskIds.includes(matchingTask.id)) {
          fulfilledTask = matchingTask;
          setCompletedTaskIds((prev) => [...prev, matchingTask.id]);
          // Unlock the rewarded element
          if (!unlockedElementIds.includes(matchingTask.rewardElementId)) {
            setUnlockedElementIds((prev) => [...prev, matchingTask.rewardElementId]);
          }
        }

        setReactionModalData({
          compound: product,
          completedTask: fulfilledTask,
          isFirstDiscovery: isFirst,
        });

        // Clear reactor upon successful bonding
        setSlots([]);
      } else {
        soundFx.playReactionFail();
        const inertFeedback = getInertGasReactionFeedback(reactantIds, conditions);
        if (inertFeedback) {
          showToast(inertFeedback, 'info');
        } else {
          showToast(
            'Inert Mixture: Reactants could not overcome activation energy or bond. Try adjusting Heat (Δ), Electric Arc (⚡), or Catalysts!',
            'error'
          );
        }
      }
    }, 450);
  };

  // Claim Task Reward from Tasks tab
  const handleClaimTaskReward = (task: Task) => {
    if (!completedTaskIds.includes(task.id)) {
      setCompletedTaskIds((prev) => [...prev, task.id]);
    }
    if (!unlockedElementIds.includes(task.rewardElementId)) {
      setUnlockedElementIds((prev) => [...prev, task.rewardElementId]);
      showToast(
        `Reward Unlocked: ${task.rewardElementName} (${task.rewardElementSymbol}) is now available on your laboratory shelf!`,
        'success'
      );
    }
  };

  // Recipe Hint selection handler from Compendium, Tasks, or Shelves
  const handleSelectCompoundForHint = (target: Compound | string) => {
    const compound = typeof target === 'string' ? ALL_COMPOUNDS.find((c) => c.id === target) : target;
    if (!compound) return;
    setTargetCompoundForHint(compound);
    setShowRecipeHint(true);
    setActiveTab('lab');
    showToast(`Recipe Hint activated: ${compound.formula} (${compound.name})`, 'info');
    soundFx.playAtomClick(1.2);
  };

  // Reset Progress
  const handleResetProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('chemiverse_recipe_hint_active');
    localStorage.removeItem('chemiverse_target_compound');
    setUnlockedElementIds(STARTER_ELEMENT_IDS);
    setDiscoveredCompoundIds([]);
    setCompletedTaskIds([]);
    setSlots([]);
    setTargetCompoundForHint(null);
    setShowResetConfirm(false);
    showToast('Experiment reset: Restored to 4 starter elements.', 'info');
    soundFx.playAtomClick(0.7);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090c14] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Sleek Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        discoveredCount={discoveredCompoundIds.length}
        totalCompoundsCount={ALL_COMPOUNDS.length}
        unlockedElementsCount={unlockedElementIds.length}
        totalElementsCount={ALL_ELEMENTS.length}
        pendingTasksCount={pendingTasksCount}
        onResetProgress={() => setShowResetConfirm(true)}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 lg:p-6 flex flex-col">
        {activeTab === 'lab' && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {/* Left Drawer: Element Shelf (4 cols) */}
            <div className="lg:col-span-3 order-2 lg:order-1 flex flex-col">
              <ElementShelf
                unlockedElements={unlockedElements}
                onAddElement={(el) => addItemToCrucible(el.id, 'element')}
                allElementsCount={ALL_ELEMENTS.length}
              />
            </div>

            {/* Center: Crucible Reaction Chamber (5 cols) */}
            <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col">
              <Crucible
                slots={slots}
                onRemoveSlot={handleRemoveSlot}
                onClearSlots={handleClearSlots}
                conditions={conditions}
                onToggleCondition={handleToggleCondition}
                onSynthesize={handleSynthesize}
                isSynthesizing={isSynthesizing}
                onDropItem={handleDropItem}
                predictedProduct={predictedProduct}
                showRecipeHint={showRecipeHint}
                onToggleRecipeHint={() => setShowRecipeHint((prev) => !prev)}
                targetCompound={targetCompoundForHint}
                onSelectTargetCompound={(comp) => setTargetCompoundForHint(comp)}
                allCompounds={ALL_COMPOUNDS}
                discoveredCompoundIds={discoveredCompoundIds}
              />
            </div>

            {/* Right Drawer: Discovered Compounds Reagents (4 cols) */}
            <div className="lg:col-span-4 order-3 flex flex-col">
              <CompoundShelf
                discoveredCompounds={discoveredCompounds}
                onAddCompound={(comp) => addItemToCrucible(comp.id, 'compound')}
                totalCompoundsCount={ALL_COMPOUNDS.length}
              />
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <TasksView
            tasks={RESEARCH_TASKS}
            completedTaskIds={completedTaskIds}
            discoveredCompoundIds={discoveredCompoundIds}
            unlockedElementIds={unlockedElementIds}
            onClaimTaskReward={handleClaimTaskReward}
            onGoToLab={() => setActiveTab('lab')}
            onSelectCompoundForHint={handleSelectCompoundForHint}
          />
        )}

        {activeTab === 'compendium' && (
          <CompendiumView
            allCompounds={ALL_COMPOUNDS}
            discoveredCompoundIds={discoveredCompoundIds}
            onSelectCompoundForCrucible={(compound) => {
              addItemToCrucible(compound.id, 'compound');
              setActiveTab('lab');
            }}
            onSelectCompoundForHint={handleSelectCompoundForHint}
          />
        )}

        {activeTab === 'periodic' && (
          <PeriodicView
            allElements={ALL_ELEMENTS}
            unlockedElementIds={unlockedElementIds}
            onAddElementToCrucible={(element) => {
              addItemToCrucible(element.id, 'element');
              setActiveTab('lab');
            }}
            onGoToTasks={() => setActiveTab('tasks')}
          />
        )}
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-short max-w-sm">
          <div
            className={`px-4 py-3 rounded-xl shadow-2xl border text-xs font-medium flex items-center gap-3 backdrop-blur-md ${
              toastMessage.type === 'error'
                ? 'bg-rose-950/90 border-rose-600/70 text-rose-200'
                : toastMessage.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-600/70 text-emerald-200'
                : 'bg-slate-900/95 border-cyan-500/60 text-cyan-200'
            }`}
          >
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Celebration Reaction Discovery Modal */}
      {reactionModalData && (
        <ReactionModal
          compound={reactionModalData.compound}
          completedTask={reactionModalData.completedTask}
          isFirstDiscovery={reactionModalData.isFirstDiscovery}
          onClose={() => setReactionModalData(null)}
        />
      )}

      {/* Reset Experiment Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-100">
              Reset Chemical Research?
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              This will clear your synthesized compounds, reset completed research tasks, and restore
              your elemental shelf back to the original starter elements (H, O, C, N).
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleResetProgress}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition shadow-lg shadow-rose-600/30"
              >
                Reset Experiment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
