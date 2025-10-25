import React, { useState } from 'react';
import api from '../services/apiService';

interface TaskFormProps {
    projectId: string;
    onTaskAdded: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ projectId, onTaskAdded }) => {
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [dependenciesInput, setDependenciesInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!title.trim()) return;

        setIsLoading(true);
        try {
            const dependenciesArray = dependenciesInput
                .split(',')
                .map(s => s.trim())
                .filter(s => s.length > 0);

            const data = {
                title,
                dueDate: dueDate ? new Date(dueDate).toISOString() : null,
                dependenciesJson: JSON.stringify(dependenciesArray),
            };
            
            await api.post(`/projects/${projectId}/tasks`, data);
            
            setTitle('');
            setDueDate('');
            setDependenciesInput('');
            onTaskAdded();
        } catch (error) {
            console.error('Error adding task:', error);
            setError('Failed to add task.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <h3>Add New Task</h3>
            {error && <p className="error-message">{error}</p>}
            <div className="task-input-group">
                <input
                    type="text"
                    placeholder="Task Title (Required)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
            </div>
            <input
                type="text"
                placeholder="Dependencies (e.g., Task A, Task B)"
                value={dependenciesInput}
                onChange={(e) => setDependenciesInput(e.target.value)}
                className="dependency-input"
            />
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Adding...' : 'Add Task'}
            </button>
        </form>
    );
};

export default TaskForm;
