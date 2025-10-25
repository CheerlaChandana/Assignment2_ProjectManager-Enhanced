import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectDetails, Project } from '../services/projectService';
import TaskForm from '../components/TaskForm';
import TaskItemComponent from '../components/TaskItemComponent';
import api from '../services/apiService';

interface ScheduleResponse {
    recommendedOrder: string[];
}

const ProjectDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [scheduleOutput, setScheduleOutput] = useState<ScheduleResponse | null>(null);
    const [scheduleError, setScheduleError] = useState<string | null>(null);
    const [schedulingLoading, setSchedulingLoading] = useState(false);

    const fetchProject = async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getProjectDetails(id);
            setProject(data);
        } catch (err: any) {
            console.error('Error fetching project details:', err);
            setError('Project not found or you do not have permission.');
        } finally {
            setLoading(false);
        }
    };

    const handleSchedule = async () => {
        setScheduleOutput(null);
        setScheduleError(null);
        setSchedulingLoading(true);
        
        try {
            const response = await api.post<ScheduleResponse>(
                `/v1/scheduler/projects/${id}/schedule`
            );
            setScheduleOutput(response.data);
        } catch (err: any) {
            console.error('Scheduling failed:', err);
            if (err.response && err.response.data && err.response.status === 400) {
                setScheduleError(err.response.data.error);
            } else {
                setScheduleError('Could not generate schedule. API server error.');
            }
        } finally {
            setSchedulingLoading(false);
        }
    };

    useEffect(() => {
        fetchProject();
    }, [id]);

    if (loading) {
        return <div className="loading-state">Loading project details...</div>;
    }

    if (error || !project) {
        return (
            <div className="error-state">
                {error || 'No project data available.'} 
                <Link to="/dashboard">Go to Dashboard</Link>
            </div>
        );
    }

    const totalTasks = project.tasks?.length || 0;
    const completedTasks = project.tasks?.filter(t => t.isCompleted).length || 0;
    const activeTasks = totalTasks - completedTasks;

    return (
        <div className="project-details-container">
            <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
            
            <header className="project-header">
                <h1>{project.title}</h1>
                <p className="project-description">{project.description || 'No description provided.'}</p>
                <div className="task-stats">
                    <span>Total: {totalTasks}</span>
                    <span>Active: {activeTasks}</span>
                    <span>Completed: {completedTasks}</span>
                </div>
            </header>

            <section className="task-form-section">
                <TaskForm projectId={project.id} onTaskAdded={fetchProject} />
            </section>

            <section className="task-list-section">
                <h2>Tasks</h2>
                {project.tasks && project.tasks.length > 0 ? (
                    <ul className="task-list">
                        {project.tasks
                            .sort((a, b) => (a.isCompleted === b.isCompleted ? 0 : a.isCompleted ? 1 : -1))
                            .map(task => (
                                <TaskItemComponent 
                                    key={task.id} 
                                    task={task} 
                                    onTaskUpdated={fetchProject} 
                                />
                        ))}
                    </ul>
                ) : (
                    <p className="no-tasks">No tasks in this project yet. Add one above!</p>
                )}
            </section>

            <section className="scheduler-section">
                <h2>⭐ Generate Optimal Schedule</h2>
                <p>This runs the Topological Sort algorithm on your existing tasks and dependencies.</p>
                <button onClick={handleSchedule} disabled={schedulingLoading || totalTasks === 0}>
                    {schedulingLoading ? 'Analyzing Dependencies...' : 'Generate Recommended Schedule'}
                </button>

                {scheduleError && <p className="schedule-error-message">Error: {scheduleError}</p>}

                {scheduleOutput && (
                    <div className="schedule-output">
                        <h3>Recommended Order:</h3>
                        <ol>
                            {scheduleOutput.recommendedOrder.map((taskTitle, index) => (
                                <li key={index}>{taskTitle}</li>
                            ))}
                        </ol>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ProjectDetailsPage;
