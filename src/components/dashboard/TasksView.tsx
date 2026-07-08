import React, { useState } from "react";
import { Plus, Sparkles, ChevronLeft, ChevronRight, CheckCircle2, Trash2, Zap, LayoutGrid, CheckSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { KanbanTask } from "../../types";

interface TasksViewProps {
  tasks: KanbanTask[];
  onUpdateTasks: (updatedTasks: KanbanTask[]) => void;
}

export default function TasksView({
  tasks,
  onUpdateTasks,
}: TasksViewProps) {
  const [goalInput, setGoalInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  // Task operation handlers
  const handleMoveTask = (id: string, direction: "left" | "right") => {
    const nextTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      
      let nextStatus = task.status;
      if (task.status === "todo" && direction === "right") nextStatus = "in_progress";
      else if (task.status === "in_progress") {
        if (direction === "left") nextStatus = "todo";
        else if (direction === "right") nextStatus = "completed";
      } else if (task.status === "completed" && direction === "left") nextStatus = "in_progress";

      return { ...task, status: nextStatus };
    });
    onUpdateTasks(nextTasks);
  };

  const handleDeleteTask = (id: string) => {
    onUpdateTasks(tasks.filter((t) => t.id !== id));
  };

  const handleAddCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: KanbanTask = {
      id: "task_" + Date.now(),
      title: newTaskTitle.trim(),
      description: "Custom user task",
      status: "todo",
      priority: "medium",
      dueDate: "As Scheduled",
    };

    onUpdateTasks([...tasks, newTask]);
    setNewTaskTitle("");
    setIsAddFormOpen(false);
  };

  // Draft checklist using Gemini server-side API!
  const handleDraftChecklist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalInput.trim()) return;

    setAiLoading(true);
    try {
      const response = await fetch("/api/gemini/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: goalInput.trim() }),
      });
      const data = await response.json();
      
      if (data.tasks && Array.isArray(data.tasks)) {
        const generatedTasks: KanbanTask[] = data.tasks.map((taskStr: string, idx: number) => ({
          id: "task_ai_" + Date.now() + "_" + idx,
          title: taskStr,
          description: `AI-generated roadmap item for: ${goalInput}`,
          status: "todo",
          priority: "high",
          dueDate: "Sprint target",
        }));
        
        onUpdateTasks([...tasks, ...generatedTasks]);
        setGoalInput("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  // Organize tasks by column
  const todoTasks = tasks.filter((t) => t.status === "todo");
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  return (
    <div className="flex flex-col gap-6">
      
      {/* Sub header block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/5">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-violet font-semibold">OPERATIONAL FLOW</span>
          <h2 className="font-display font-bold text-2xl text-white">High-Performance Kanban Board</h2>
        </div>
        <button
          onClick={() => setIsAddFormOpen(!isAddFormOpen)}
          className="btn bg-gradient-to-r from-violet to-blue hover:scale-[1.01] text-white text-xs font-semibold py-2 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add Custom Task
        </button>
      </div>

      {/* Add Task Collapsible Form */}
      <AnimatePresence>
        {isAddFormOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleAddCustomTask} className="glass p-4.5 rounded-xl bg-white/2 border border-white/5 flex gap-3 max-w-xl">
              <input 
                type="text"
                placeholder="Enter workspace task title (e.g., Deliver vlog rough edit to client)..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet"
                required
              />
              <button
                type="submit"
                className="btn bg-violet text-white text-xs font-bold py-2.5 px-5 rounded-xl cursor-pointer hover:bg-violet/80"
              >
                Add Task
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kanban Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* TO DO COLUMN */}
        <div className="glass p-4.5 rounded-2xl bg-white/2 border border-white/5 flex flex-col gap-4">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-xs font-bold text-white tracking-wide">TO DO</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/5 text-slate border border-white/10">
              {todoTasks.length}
            </span>
          </div>

          <div className="flex flex-col gap-3 min-h-[160px]">
            {todoTasks.length === 0 ? (
              <div className="p-8 text-center bg-black/20 border border-dashed border-white/5 rounded-xl text-[11px] text-slate/70">
                No items to do. Add a task above.
              </div>
            ) : (
              todoTasks.map((task) => (
                <div key={task.id} className="p-3.5 bg-black/40 border border-white/5 rounded-xl hover:border-white/10 transition-colors flex flex-col gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white leading-snug">{task.title}</span>
                    <span className="text-[10px] text-slate/80 font-mono mt-1">{task.dueDate}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2.5 border-t border-white/5">
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1.5 text-slate/50 hover:text-red-400 cursor-pointer"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveTask(task.id, "right")}
                      className="p-1.5 bg-white/5 border border-white/10 text-slate hover:text-white rounded-lg cursor-pointer"
                      title="Move to In Progress"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* IN PROGRESS COLUMN */}
        <div className="glass p-4.5 rounded-2xl bg-white/2 border border-white/5 flex flex-col gap-4">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-xs font-bold text-blue-400 tracking-wide">IN PROGRESS</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {inProgressTasks.length}
            </span>
          </div>

          <div className="flex flex-col gap-3 min-h-[160px]">
            {inProgressTasks.length === 0 ? (
              <div className="p-8 text-center bg-black/20 border border-dashed border-white/5 rounded-xl text-[11px] text-slate/70">
                No tasks currently in progress.
              </div>
            ) : (
              inProgressTasks.map((task) => (
                <div key={task.id} className="p-3.5 bg-black/40 border border-white/5 rounded-xl hover:border-white/10 transition-colors flex flex-col gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white leading-snug">{task.title}</span>
                    <span className="text-[10px] text-slate/80 font-mono mt-1">{task.dueDate}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2.5 border-t border-white/5">
                    <button
                      onClick={() => handleMoveTask(task.id, "left")}
                      className="p-1.5 bg-white/5 border border-white/10 text-slate hover:text-white rounded-lg cursor-pointer"
                      title="Move to To Do"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1.5 text-slate/50 hover:text-red-400 cursor-pointer"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveTask(task.id, "right")}
                      className="p-1.5 bg-white/5 border border-white/10 text-slate hover:text-white rounded-lg cursor-pointer"
                      title="Move to Completed"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COMPLETED COLUMN */}
        <div className="glass p-4.5 rounded-2xl bg-white/2 border border-white/5 flex flex-col gap-4">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-xs font-bold text-emerald-400 tracking-wide">COMPLETED</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {completedTasks.length}
            </span>
          </div>

          <div className="flex flex-col gap-3 min-h-[160px]">
            {completedTasks.length === 0 ? (
              <div className="p-8 text-center bg-black/20 border border-dashed border-white/5 rounded-xl text-[11px] text-slate/70">
                No tasks completed yet.
              </div>
            ) : (
              completedTasks.map((task) => (
                <div key={task.id} className="p-3.5 bg-black/40 border border-white/5 rounded-xl hover:border-white/10 transition-colors flex flex-col gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white/50 line-through leading-snug">{task.title}</span>
                    <span className="text-[10px] text-slate/40 font-mono mt-1">{task.dueDate}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2.5 border-t border-white/5">
                    <button
                      onClick={() => handleMoveTask(task.id, "left")}
                      className="p-1.5 bg-white/5 border border-white/10 text-slate hover:text-white rounded-lg cursor-pointer"
                      title="Move to In Progress"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1.5 text-slate/50 hover:text-red-400 cursor-pointer"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-1.5" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Card 2: OPRYX AI TASK SUGGESTER */}
      <div className="glass p-6 rounded-2xl bg-white/5 border border-white/5">
        <div className="flex items-center gap-2 pb-3 border-b border-white/5 mb-4">
          <Sparkles className="w-5 h-5 text-violet animate-pulse" />
          <h3 className="font-display font-bold text-sm text-white">OPRYX AI Task Suggester</h3>
        </div>
        <p className="text-xs text-slate max-w-xl leading-relaxed mb-4">
          Have a campaign goal but unsure of the operational roadmap? Describe it below and OPRYX AI will draft the ideal checklist.
        </p>

        <form onSubmit={handleDraftChecklist} className="flex flex-col gap-3 max-w-xl">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate font-semibold uppercase tracking-wider">What is the goal?</label>
            <input 
              type="text"
              placeholder="Shoot premium 4k b-roll shots of Tokyo streets for Japan travel series"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-violet font-mono"
              required
            />
          </div>

          <button
            type="submit"
            disabled={aiLoading}
            className="btn self-start bg-gradient-to-r from-violet to-blue hover:scale-[1.01] active:scale-[0.99] transition-transform text-white text-xs font-semibold py-2.5 px-5 rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {aiLoading ? (
              <>
                <div className="w-3 h-3 rounded-full border border-white border-t-transparent animate-spin" />
                <span>Consulting Models...</span>
              </>
            ) : (
              <>
                <CheckSquare className="w-4 h-4" />
                <span>Draft Checklist</span>
              </>
            )}
          </button>
        </form>
      </div>

    </div>
  );
}
