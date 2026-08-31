import { useEffect, useState } from 'react';
import { BonsaiTask, BranchId, seedTasks } from './bonsai-data';

const STORAGE_KEY = 'bonsai-os-tasks-v2';

function readTasks(): BonsaiTask[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return seedTasks;
    const value = JSON.parse(saved) as unknown;
    return Array.isArray(value) ? (value as BonsaiTask[]) : seedTasks;
  } catch {
    return seedTasks;
  }
}

export function useBonsaiTasks() {
  const [tasks, setTasks] = useState<BonsaiTask[]>(readTasks);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: { title: string; branch: BranchId; note: string }) => {
    const next: BonsaiTask = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    setTasks((current) => [next, ...current]);
    return next;
  };

  const updateTask = (id: string, patch: Pick<BonsaiTask, 'title' | 'branch' | 'note'>) => {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, ...patch } : task)));
  };

  const completeTask = (id: string) => {
    setTasks((current) => current.map((task) => (
      task.id === id ? { ...task, completedAt: new Date().toISOString() } : task
    )));
  };

  const restoreTask = (id: string) => {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, completedAt: null } : task)));
  };

  const deleteTask = (id: string) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  };

  return { tasks, addTask, updateTask, completeTask, restoreTask, deleteTask };
}
