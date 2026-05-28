import React from 'react';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { 
  Paperclip, 
  MessageSquare, 
  Clock, 
  PlusCircle, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

// Draggable Task Card Component
const DraggableTaskCard = ({ task, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task._id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.35 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => onClick(task)}
      className="p-4 rounded-xl bg-white dark:bg-dark-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow hover:border-brand-500/50 dark:hover:border-brand-500/40 cursor-grab active:cursor-grabbing transition-colors duration-150 relative group"
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className={`inline-block px-1.5 py-0.5 text-[9px] font-bold rounded uppercase ${
          task.priority === 'High' 
            ? 'bg-rose-500/10 text-rose-500' 
            : task.priority === 'Medium' 
            ? 'bg-amber-500/10 text-amber-500' 
            : 'bg-emerald-500/10 text-emerald-500'
        }`}>
          {task.priority}
        </span>
        
        {/* Due Date Indicator */}
        {task.dueDate && (
          <div className="flex items-center gap-1 text-[9px] text-slate-450 dark:text-slate-500">
            <Clock className="w-3 h-3" />
            <span>{new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
          </div>
        )}
      </div>

      <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-100 group-hover:text-brand-500 transition truncate pr-4">
        {task.title}
      </h4>

      {task.description && (
        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Task card footer detail elements */}
      <div className="flex items-center justify-between border-t border-slate-150 dark:border-slate-800/40 mt-3 pt-2.5 text-[9px] text-slate-400">
        <div className="flex items-center gap-2">
          {/* File attachments count */}
          {task.attachments?.length > 0 && (
            <div className="flex items-center gap-0.5" title="Attachments">
              <Paperclip className="w-3 h-3 text-slate-450" />
              <span>{task.attachments.length}</span>
            </div>
          )}
        </div>

        {/* Card Assignee circle */}
        <div className="flex items-center gap-1.5">
          {task.assignedUser ? (
            <div 
              className="w-5 h-5 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center text-[8px] uppercase select-none ring-1 ring-slate-200 dark:ring-slate-800"
              title={`Assigned to ${task.assignedUser.name}`}
            >
              {task.assignedUser.name.slice(0, 2)}
            </div>
          ) : (
            <span className="text-[8px] text-slate-400 font-medium">Unassigned</span>
          )}
        </div>
      </div>
    </div>
  );
};

// Droppable Column Component
const DroppableColumn = ({ title, status, tasks, onCardClick, openCreateModal }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div 
      ref={setNodeRef}
      className={`flex flex-col w-full min-w-[260px] max-w-[320px] rounded-2xl p-4 transition-all duration-200 ${
        isOver 
          ? 'bg-brand-500/10 border-2 border-dashed border-brand-500/30' 
          : 'bg-slate-100/60 dark:bg-dark-900/25 border border-slate-200/50 dark:border-slate-800/30'
      }`}
    >
      {/* Column title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${
            status === 'Todo' 
              ? 'bg-slate-400' 
              : status === 'In Progress' 
              ? 'bg-brand-500 glow-brand' 
              : status === 'Review' 
              ? 'bg-amber-500' 
              : 'bg-emerald-500'
          }`} />
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-350">
            {title}
          </h3>
          <span className="px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-dark-850 text-[10px] font-bold text-slate-500 dark:text-slate-400">
            {tasks.length}
          </span>
        </div>
        
        <button
          onClick={() => openCreateModal(status)}
          className="p-1 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-850 text-slate-500 dark:text-slate-400"
          title="Add task to this column"
        >
          <PlusCircle className="w-4 h-4" />
        </button>
      </div>

      {/* Column Cards scroll list */}
      <div className="flex-1 overflow-y-auto space-y-3.5 max-h-[60vh] pr-1">
        {tasks.map((task) => (
          <DraggableTaskCard key={task._id} task={task} onClick={onCardClick} />
        ))}
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center p-6 border border-dashed border-slate-250 dark:border-slate-800/40 rounded-xl text-center text-slate-400 h-28">
            <span className="text-[10px]">No cards here</span>
            <button
              onClick={() => openCreateModal(status)}
              className="text-[9px] text-brand-500 hover:underline mt-1 font-bold"
            >
              Add first card
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Board Component
const KanbanBoard = ({ tasks, onTaskMoved, onTaskClicked, openCreateModal }) => {
  const columns = [
    { title: 'To Do', status: 'Todo' },
    { title: 'In Progress', status: 'In Progress' },
    { title: 'Review', status: 'Review' },
    { title: 'Completed', status: 'Completed' },
  ];

  // Configure pointers (enables links clicking inside draggable items without dragging them!)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // requires dragging 8px before activation
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    // Check if task is moved to a new column
    const taskObj = tasks.find(t => t._id === taskId);
    if (taskObj && taskObj.status !== newStatus) {
      onTaskMoved(taskId, newStatus);
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-4 pt-2">
        {columns.map((col) => (
          <DroppableColumn
            key={col.status}
            title={col.title}
            status={col.status}
            tasks={tasks.filter((t) => t.status === col.status)}
            onCardClick={onTaskClicked}
            openCreateModal={openCreateModal}
          />
        ))}
      </div>
    </DndContext>
  );
};

export default KanbanBoard;
