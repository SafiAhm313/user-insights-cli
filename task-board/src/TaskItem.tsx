import type { Task } from './types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <li className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-left" onClick={() => onToggle(task.id)}>
        <span className="checkbox">{task.completed ? '✓' : ''}</span>
        <span className="task-title">{task.title}</span>
      </div>
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </li>
  );
}

export default TaskItem;