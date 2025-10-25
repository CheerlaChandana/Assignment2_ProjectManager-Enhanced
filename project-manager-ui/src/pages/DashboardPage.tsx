import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProjects, deleteProject, Project } from '../services/projectService';
import { logout } from '../services/authService';
import ProjectForm from '../components/ProjectForm';

const DashboardPage = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const data = await getProjects();
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
            alert('Could not fetch projects. Check your token/API status.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            await deleteProject(id);
            fetchProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Failed to delete project.');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return <div className="loading-state">Loading projects...</div>;
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Project Dashboard</h1>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </header>
            
            <ProjectForm onProjectCreated={fetchProjects} />
            
            <section className="project-list-section">
                <h2>Your Projects ({projects.length})</h2>
                {projects.length === 0 ? (
                    <p className="no-projects">You have no projects yet. Create one above!</p>
                ) : (
                    <ul className="project-list">
                        {projects.map(project => (
                            <li key={project.id} className="project-item">
                                <Link to={`/project/${project.id}`} className="project-title-link">
                                    {project.title}
                                </Link>
                                <span className="project-date">
                                    Created: {new Date(project.creationDate).toLocaleDateString()}
                                </span>
                                <button 
                                    onClick={() => handleDelete(project.id)} 
                                    className="delete-button"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
};

export default DashboardPage;
