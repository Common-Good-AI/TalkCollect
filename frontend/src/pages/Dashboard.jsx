import React, { useEffect, useState } from 'react';
import api from '../api';
import ProjectList from '../components/ProjectList';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects/');
            setProjects(response.data);
        } catch (error) {
            console.error("Failed to fetch projects", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreateProject = async (e) => {
        e.preventDefault();
        if (!newProjectName.trim()) return;

        try {
            await api.post('/projects/', { name: newProjectName });
            setNewProjectName('');
            setShowCreate(false);
            fetchProjects();
        } catch (error) {
            console.error("Failed to create project", error);
        }
    };

    return (
        <div className="container" style={{ padding: '48px 20px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
                <div>
                    <h1 style={{ marginBottom: '8px' }}>Welcome, {user.name}</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Manage your TalkCollect projects</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
                    <Plus size={20} style={{ marginRight: '8px' }} /> New Project
                </button>
            </header>

            {showCreate && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
                }}>
                    <div className="card" style={{ width: '400px' }}>
                        <h2 style={{ marginBottom: '24px' }}>Create New Project</h2>
                        <form onSubmit={handleCreateProject}>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Project Name</label>
                                <input
                                    className="input"
                                    value={newProjectName}
                                    onChange={(e) => setNewProjectName(e.target.value)}
                                    placeholder="e.g. Annual Conference"
                                    autoFocus
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn" style={{ backgroundColor: 'transparent', color: 'var(--color-text)' }} onClick={() => setShowCreate(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {loading ? <p>Loading projects...</p> : <ProjectList projects={projects} />}
        </div>
    );
};

export default Dashboard;
