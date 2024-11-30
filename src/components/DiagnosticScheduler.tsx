'use client';

import React, { useState } from 'react';
import { useDiagnosticScheduler } from '../hooks/useDiagnosticScheduler';
import type { ScheduledTask } from '../services/DiagnosticSchedulerService';

interface TaskCardProps {
  task: ScheduledTask;
  onEnable: (id: string) => void;
  onDisable: (id: string) => void;
  onUpdateFrequency: (id: string, frequency: number) => void;
  onRemove: (id: string) => void;
  formatNextRun: (id: string) => string;
  frequencyOptions: { label: string; value: number; }[];
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEnable,
  onDisable,
  onUpdateFrequency,
  onRemove,
  formatNextRun,
  frequencyOptions
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'performance':
        return 'blue';
      case 'security':
        return 'green';
      case 'error':
        return 'red';
      default:
        return 'gray';
    }
  };

  const selectId = `frequency-${task.id}`;

  return (
    <div className={`p-4 bg-white rounded-lg shadow border-l-4 border-${getTypeColor(task.type)}-500`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{task.name}</h3>
          <p className="text-sm text-gray-600">Next run: {formatNextRun(task.id)}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex flex-col">
            <label htmlFor={selectId} className="sr-only">
              Task Frequency
            </label>
            <select
              id={selectId}
              value={task.frequency}
              onChange={(e) => onUpdateFrequency(task.id, Number(e.target.value))}
              className="text-sm border rounded p-1"
              aria-label="Select task frequency"
            >
              {frequencyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => task.isEnabled ? onDisable(task.id) : onEnable(task.id)}
            className={`px-3 py-1 rounded text-sm ${
              task.isEnabled
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
            aria-label={task.isEnabled ? 'Disable task' : 'Enable task'}
          >
            {task.isEnabled ? 'Disable' : 'Enable'}
          </button>
          <button
            onClick={() => onRemove(task.id)}
            className="p-1 text-gray-500 hover:text-red-500"
            aria-label={`Remove ${task.name} task`}
          >
            ×
          </button>
        </div>
      </div>
      <div className="mt-2">
        <span className={`inline-block px-2 py-1 text-xs rounded-full bg-${getTypeColor(task.type)}-100 text-${getTypeColor(task.type)}-800`}>
          {task.type}
        </span>
      </div>
    </div>
  );
};

interface NewTaskFormProps {
  onSubmit: (task: Omit<ScheduledTask, 'lastRun' | 'nextRun'>) => void;
  frequencyOptions: { label: string; value: number; }[];
}

const NewTaskForm: React.FC<NewTaskFormProps> = ({ onSubmit, frequencyOptions }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'performance' | 'security' | 'error'>('performance');
  const [frequency, setFrequency] = useState(frequencyOptions[0].value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: `${type}-${Date.now()}`,
      name,
      type,
      frequency,
      isEnabled: true
    });
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow">
      <div className="space-y-4">
        <div>
          <label htmlFor="task-name" className="block text-sm font-medium text-gray-700">
            Task Name
          </label>
          <input
            id="task-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            placeholder="Enter task name"
            aria-label="Task name"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="task-type" className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              id="task-type"
              value={type}
              onChange={(e) => setType(e.target.value as 'performance' | 'security' | 'error')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              aria-label="Task type"
            >
              <option value="performance">Performance</option>
              <option value="security">Security</option>
              <option value="error">Error</option>
            </select>
          </div>
          <div>
            <label htmlFor="task-frequency" className="block text-sm font-medium text-gray-700">
              Frequency
            </label>
            <select
              id="task-frequency"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              aria-label="Task frequency"
            >
              {frequencyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Add new diagnostic task"
        >
          Add Task
        </button>
      </div>
    </form>
  );
};

export const DiagnosticScheduler: React.FC = () => {
  const {
    tasks,
    isInitialized,
    addTask,
    removeTask,
    enableTask,
    disableTask,
    updateTaskFrequency,
    formatNextRun,
    getFrequencyOptions
  } = useDiagnosticScheduler({
    onTaskComplete: (task) => {
      console.log('Task completed:', task);
    },
    onError: (error) => {
      console.error('Scheduler error:', error);
    }
  });

  const [showNewTaskForm, setShowNewTaskForm] = useState(false);

  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Initializing scheduler...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Diagnostic Tasks</h2>
        <button
          onClick={() => setShowNewTaskForm(!showNewTaskForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          aria-label={showNewTaskForm ? 'Cancel new task' : 'Create new task'}
        >
          {showNewTaskForm ? 'Cancel' : 'New Task'}
        </button>
      </div>

      {showNewTaskForm && (
        <div className="mb-6">
          <NewTaskForm
            onSubmit={(task) => {
              addTask(task as ScheduledTask);
              setShowNewTaskForm(false);
            }}
            frequencyOptions={getFrequencyOptions()}
          />
        </div>
      )}

      <div className="space-y-4">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEnable={enableTask}
            onDisable={disableTask}
            onUpdateFrequency={updateTaskFrequency}
            onRemove={removeTask}
            formatNextRun={formatNextRun}
            frequencyOptions={getFrequencyOptions()}
          />
        ))}
        {tasks.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No diagnostic tasks scheduled
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosticScheduler;
