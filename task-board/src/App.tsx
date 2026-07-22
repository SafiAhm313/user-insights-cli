import { useState, useEffect } from 'react';
import type { Task, Filter } from './types';
import TaskInput from './TaskInput';
import TaskList from './TaskList';
import FilterBar from './FilterBar';
import './App.css';

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { id: '1', title: 'Learn React props', completed: false, createdAt: Date.now() },
      { id: '2', title: 'Learn useState', completed: true, createdAt: Date.now() },
    ];
  });
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  function handleAddTask(title: string) {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: Date.now(),
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  }

  function handleToggle(id: string) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function handleDelete(id: string) {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const totalCount = tasks.length;
  const activeCount = tasks.filter((task) => !task.completed).length;
  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <div>
      <h1>Task Board</h1>
      <TaskInput onAddTask={handleAddTask} />
      <FilterBar currentFilter={filter} onFilterChange={setFilter} />
      <p className="task-counts">
        Total: {totalCount} | Active: {activeCount} | Completed: {completedCount}
      </p>
      {filteredTasks.length === 0 ? (
        <p className="empty-state">No tasks here yet.</p>
      ) : (
        <TaskList tasks={filteredTasks} onToggle={handleToggle} onDelete={handleDelete} />
      )}
    </div>
  );
}

export default App;