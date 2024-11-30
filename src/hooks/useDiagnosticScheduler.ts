import { useState, useEffect, useCallback } from 'react';
import { diagnosticSchedulerService, ScheduledTask } from '../services/DiagnosticSchedulerService';

interface UseDiagnosticSchedulerOptions {
  onTaskComplete?: (task: ScheduledTask) => void;
  onError?: (error: Error) => void;
}

export function useDiagnosticScheduler(options: UseDiagnosticSchedulerOptions = {}) {
  const { onTaskComplete, onError } = options;

  const [tasks, setTasks] = useState<ScheduledTask[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize tasks
    setTasks(diagnosticSchedulerService.getAllTasks());
    setIsInitialized(true);

    // Add listener for task updates
    const handleTaskUpdate = (task: ScheduledTask) => {
      setTasks(diagnosticSchedulerService.getAllTasks());
      onTaskComplete?.(task);
    };

    diagnosticSchedulerService.addListener(handleTaskUpdate);

    return () => {
      diagnosticSchedulerService.removeListener(handleTaskUpdate);
    };
  }, [onTaskComplete]);

  const addTask = useCallback((task: ScheduledTask) => {
    try {
      diagnosticSchedulerService.addTask(task);
      setTasks(diagnosticSchedulerService.getAllTasks());
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to add task');
      onError?.(err);
      console.error('Failed to add diagnostic task:', error);
    }
  }, [onError]);

  const removeTask = useCallback((taskId: string) => {
    try {
      diagnosticSchedulerService.removeTask(taskId);
      setTasks(diagnosticSchedulerService.getAllTasks());
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to remove task');
      onError?.(err);
      console.error('Failed to remove diagnostic task:', error);
    }
  }, [onError]);

  const enableTask = useCallback((taskId: string) => {
    try {
      diagnosticSchedulerService.enableTask(taskId);
      setTasks(diagnosticSchedulerService.getAllTasks());
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to enable task');
      onError?.(err);
      console.error('Failed to enable diagnostic task:', error);
    }
  }, [onError]);

  const disableTask = useCallback((taskId: string) => {
    try {
      diagnosticSchedulerService.disableTask(taskId);
      setTasks(diagnosticSchedulerService.getAllTasks());
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to disable task');
      onError?.(err);
      console.error('Failed to disable diagnostic task:', error);
    }
  }, [onError]);

  const updateTaskFrequency = useCallback((taskId: string, frequency: number) => {
    try {
      diagnosticSchedulerService.updateTaskFrequency(taskId, frequency);
      setTasks(diagnosticSchedulerService.getAllTasks());
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to update task frequency');
      onError?.(err);
      console.error('Failed to update task frequency:', error);
    }
  }, [onError]);

  const getTaskStatus = useCallback((taskId: string) => {
    return diagnosticSchedulerService.getTaskStatus(taskId);
  }, []);

  const formatNextRun = useCallback((taskId: string): string => {
    const nextRun = diagnosticSchedulerService.getNextScheduledRun(taskId);
    if (!nextRun) return 'Not scheduled';
    
    const now = new Date();
    const diff = nextRun.getTime() - now.getTime();
    
    if (diff < 0) return 'Overdue';
    if (diff < 60000) return 'Less than a minute';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours`;
    return `${Math.floor(diff / 86400000)} days`;
  }, []);

  const getFrequencyOptions = useCallback(() => {
    return [
      { label: '1 minute', value: 60 * 1000 },
      { label: '5 minutes', value: 5 * 60 * 1000 },
      { label: '15 minutes', value: 15 * 60 * 1000 },
      { label: '30 minutes', value: 30 * 60 * 1000 },
      { label: '1 hour', value: 60 * 60 * 1000 },
      { label: '6 hours', value: 6 * 60 * 60 * 1000 },
      { label: '12 hours', value: 12 * 60 * 60 * 1000 },
      { label: '24 hours', value: 24 * 60 * 60 * 1000 }
    ];
  }, []);

  return {
    tasks,
    isInitialized,
    addTask,
    removeTask,
    enableTask,
    disableTask,
    updateTaskFrequency,
    getTaskStatus,
    formatNextRun,
    getFrequencyOptions
  };
}

export default useDiagnosticScheduler;
