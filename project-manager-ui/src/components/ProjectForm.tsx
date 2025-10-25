import React, { useState } from 'react';
import { createProject } from '../services/projectService';

interface ProjectFormProps {
    onProjectCreated: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onProjectCreated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsLoading(true);
        try {
            await createProject({ title, description });
            setTitle('');
            setDescription('');
            onProjectCreated(); 
        } catch (error) {
            console.error('Error creating project:', error);
            alert('Failed to create project.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="project-form">
            <h2>Add New Project</h2>
            <input
                type="text"
                placeholder="Project Title (Required)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <textarea
                placeholder="Description (Optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Project'}
            </button>
        </form>
    );
};

export default ProjectForm;