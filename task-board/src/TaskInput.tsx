import { useState } from 'react';

interface TaskInputProps {
  onAddTask: (title: string) => void;
}

function TaskInput({ onAddTask }: TaskInputProps) {
  const [title, setTitle] = useState('');

  function handleSubmit() {
    const trimmed = title.trim();
    if (trimmed === '') {
      return;
    }
    onAddTask(trimmed);
    setTitle('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }

  return (
    <div className="task-input">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a new task..."
      />
      <button type="button" onClick={handleSubmit}>
        Add
      </button>
    </div>
  );
}

export default TaskInput;