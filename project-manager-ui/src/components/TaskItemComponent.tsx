import React from 'react';
import api from '../services/apiService';
import { Task } from '../services/projectService';

interface TaskItemComponentProps {
    task: Task;
    onTaskUpdated: () => void;
}

const TaskItemComponent: React.FC<TaskItemComponentProps> = ({ task, onTaskUpdated }) => {
    const handleToggle = async () => {
        try {
            const updateDto = {
                title: task.title,
                dueDate: task.dueDate,
                isCompleted: !task.isCompleted
            };
            await api.put(`/tasks/${task.id}`, updateDto);
            onTaskUpdated();
        } catch (error) {
            console.error('Error toggling task:', error);
            alert('Failed to toggle task status.');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete task: "${task.title}"?`)) return;
        try {
            await api.delete(`/tasks/${task.id}`);
            onTaskUpdated();
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task.');
        }
    };

    const getDependencies = (jsonString: string | undefined) => {
        if (!jsonString || jsonString === '[]') return 'None';
        try {
            const deps = JSON.parse(jsonString);
            const displayDeps = deps.slice(0, 3).join(', ');
            return deps.length > 3 ? `${displayDeps}, ...` : displayDeps;
        } catch {
            return 'Error parsing';
        }
    };

    const getDueDate = (date: string | undefined) => {
        if (!date) return 'No Due Date';
        try {
            return `Due: ${new Date(date).toLocaleDateString()}`;
        } catch {
            return `Due: ${date}`;
        }
    };

    return (
        <li className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
            <div className="task-info">
                <span className="task-title" onClick={handleToggle}>
                    {task.title}
                </span>
                <span className="task-due-date">
                    {getDueDate(task.dueDate)}
                </span>
                <span className="task-dependencies">
                </span>
            </div>
            <button 
                onClick={handleDelete} 
                className="delete-task-button"
            >
                Delete
            </button>
        </li>
    );
};

export default TaskItemComponent;
