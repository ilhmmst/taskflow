import { useRef } from 'react';
import gsap from 'gsap';
import { Pencil, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    createdAt: string;
  };
  isSelected: boolean;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const TaskCard = ({
  task,
  isSelected,
  onSelect,
  onToggle,
  onEdit,
  onDelete,
}: TaskCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, { scale: 1.02, duration: 0.15, ease: 'power1.out' });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, { scale: 1, duration: 0.15, ease: 'power1.out' });
  };

  // Build root class: selected overrides completed/pending background and border
  const rootBg = isSelected
    ? 'bg-secondary/10 border-secondary'
    : task.completed
      ? 'bg-third/40 border-third/60'
      : 'bg-fourty border-third';

  return (
    <div
      ref={cardRef}
      className={`task-card rounded-xl border p-5 flex flex-col gap-4 cursor-pointer transition-colors duration-150 ${rootBg}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header row — checkbox + status indicator */}
      <div className="flex items-center justify-between">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(task.id)}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 cursor-pointer accent-secondary rounded"
          aria-label={`Pilih tugas ${task.title}`}
        />

        {/* Status indicator — circular button to toggle */}
        <button
          onClick={() => onToggle(task.id)}
          aria-label={task.completed ? 'Tandai belum selesai' : 'Tandai selesai'}
          className="cursor-pointer flex items-center gap-1.5 font-subHeading text-xs transition-opacity hover:opacity-70"
        >
          <span
            className={`w-3 h-3 rounded-full inline-block ${task.completed ? 'bg-primary' : 'bg-third border border-third/60'
              }`}
          />
          <span className={task.completed ? 'text-primary' : 'text-primary/50'}>
            {task.completed ? 'Selesai' : 'Belum'}
          </span>
        </button>
      </div>

      {/* Content area */}
      <div className="flex flex-col gap-1 flex-1">
        <h3
          className={`break-words font-heading text-2xl uppercase leading-snug text-primary ${task.completed ? 'line-through opacity-50' : ''
            }`}
        >
          {task.title}
        </h3>

        {task.description && (
          <p
            className={`break-words font-subHeading text-sm opacity-70 text-primary ${task.completed ? 'line-through' : ''
              }`}
          >
            {task.description}
          </p>
        )}

      </div>

      {/* Action row */}
      <div className="flex justify-between items-center border-t border-current/10 pt-2">
        <p className="font-subHeading text-xs text-primary/40 mt-2">
          {formatDate(task.createdAt)}
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onEdit(task.id)}
            aria-label="Edit tugas"
            className="flex items-center gap-1 font-subHeading text-xs text-primary/60 hover:text-primary rounded-lg transition cursor-pointer"
          >
            <Pencil size={13} />
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            aria-label="Hapus tugas"
            className="flex items-center gap-1 font-subHeading text-xs text-primary/60 hover:text-red-500 rounded-lg transition cursor-pointer"
          >
            <Trash2 size={13} />
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};
