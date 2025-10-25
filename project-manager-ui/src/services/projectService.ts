import api from './apiService';

export interface Project {
  id: string;
  title: string;
  description: string;
  creationDate: string;
  tasks?: Task[]; 
}

export interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  dueDate?: string;
  projectId: string;
}

interface CreateProjectDto {
    title: string;
    description: string;
}

export const getProjects = async (): Promise<Project[]> => {
    const response = await api.get('/projects');
    return response.data;
};

export const createProject = async (data: CreateProjectDto): Promise<Project> => {
    const response = await api.post('/projects', data);
    return response.data;
};

export const getProjectDetails = async (id: string): Promise<Project> => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
};

export const deleteProject = async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
};
