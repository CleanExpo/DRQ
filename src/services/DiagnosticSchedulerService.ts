import { diagnosticService } from './DiagnosticService';

export interface ScheduledTask {
  id: string;
  name: string;
  frequency: number; // in milliseconds
  lastRun: number;
  nextRun: number;
  isEnabled: boolean;
  type: 'performance' | 'security' | 'error';
  condition?: () => boolean;
}

class DiagnosticSchedulerService {
  private static instance: DiagnosticSchedulerService;
  private tasks: Map<string, ScheduledTask> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private listeners: Set<(task: ScheduledTask) => void> = new Set();

  private constructor() {
    // Initialize with default tasks
    this.addTask({
      id: 'performance-check',
      name: 'Performance Monitoring',
      frequency: 5 * 60 * 1000, // 5 minutes
      lastRun: 0,
      nextRun: Date.now(),
      isEnabled: true,
      type: 'performance'
    });

    this.addTask({
      id: 'error-check',
      name: 'Error Analysis',
      frequency: 15 * 60 * 1000, // 15 minutes
      lastRun: 0,
      nextRun: Date.now(),
      isEnabled: true,
      type: 'error'
    });

    this.addTask({
      id: 'security-check',
      name: 'Security Analysis',
      frequency: 30 * 60 * 1000, // 30 minutes
      lastRun: 0,
      nextRun: Date.now(),
      isEnabled: true,
      type: 'security'
    });
  }

  public static getInstance(): DiagnosticSchedulerService {
    if (!DiagnosticSchedulerService.instance) {
      DiagnosticSchedulerService.instance = new DiagnosticSchedulerService();
    }
    return DiagnosticSchedulerService.instance;
  }

  public addTask(task: ScheduledTask): void {
    this.tasks.set(task.id, task);
    if (task.isEnabled) {
      this.scheduleTask(task);
    }
  }

  public removeTask(taskId: string): void {
    const interval = this.intervals.get(taskId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(taskId);
    }
    this.tasks.delete(taskId);
  }

  public enableTask(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (task) {
      task.isEnabled = true;
      this.scheduleTask(task);
    }
  }

  public disableTask(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (task) {
      task.isEnabled = false;
      const interval = this.intervals.get(taskId);
      if (interval) {
        clearInterval(interval);
        this.intervals.delete(taskId);
      }
    }
  }

  public getTask(taskId: string): ScheduledTask | undefined {
    return this.tasks.get(taskId);
  }

  public getAllTasks(): ScheduledTask[] {
    return Array.from(this.tasks.values());
  }

  public addListener(listener: (task: ScheduledTask) => void): void {
    this.listeners.add(listener);
  }

  public removeListener(listener: (task: ScheduledTask) => void): void {
    this.listeners.delete(listener);
  }

  private async executeTask(task: ScheduledTask): Promise<void> {
    if (!task.isEnabled) return;
    if (task.condition && !task.condition()) return;

    try {
      switch (task.type) {
        case 'performance':
          await diagnosticService.collectPerformanceMetrics();
          break;
        case 'error':
          await diagnosticService.analyzeLighthouseError();
          break;
        case 'security':
          // Assuming security analysis is part of lighthouse error analysis
          await diagnosticService.analyzeLighthouseError();
          break;
      }

      task.lastRun = Date.now();
      task.nextRun = Date.now() + task.frequency;

      // Notify listeners
      this.listeners.forEach(listener => listener(task));
    } catch (error) {
      console.error(`Failed to execute diagnostic task ${task.id}:`, error);
    }
  }

  private scheduleTask(task: ScheduledTask): void {
    // Clear existing interval if any
    const existingInterval = this.intervals.get(task.id);
    if (existingInterval) {
      clearInterval(existingInterval);
    }

    // Execute immediately if never run before
    if (task.lastRun === 0) {
      this.executeTask(task);
    }

    // Schedule regular execution
    const interval = setInterval(() => {
      this.executeTask(task);
    }, task.frequency);

    this.intervals.set(task.id, interval);
  }

  public updateTaskFrequency(taskId: string, frequency: number): void {
    const task = this.tasks.get(taskId);
    if (task) {
      task.frequency = frequency;
      if (task.isEnabled) {
        this.scheduleTask(task); // This will clear the old interval and create a new one
      }
    }
  }

  public getNextScheduledRun(taskId: string): Date | null {
    const task = this.tasks.get(taskId);
    return task ? new Date(task.nextRun) : null;
  }

  public getTaskStatus(taskId: string): {
    isEnabled: boolean;
    lastRun: Date | null;
    nextRun: Date | null;
  } | null {
    const task = this.tasks.get(taskId);
    if (!task) return null;

    return {
      isEnabled: task.isEnabled,
      lastRun: task.lastRun ? new Date(task.lastRun) : null,
      nextRun: new Date(task.nextRun)
    };
  }
}

export const diagnosticSchedulerService = DiagnosticSchedulerService.getInstance();
export default DiagnosticSchedulerService;
