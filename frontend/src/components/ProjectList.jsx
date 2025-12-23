import React from 'react';
import { Folder, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectList = ({ projects }) => {
    if (!projects.length) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: '48px', color: 'var(--color-text-secondary)' }}>
                <p>No projects yet. Create one to get started.</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {projects.map((project) => (
                <Link key={project.id} to={`/project/${project.id}`} style={{ textDecoration: 'none' }}>
                    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                            <div style={{
                                backgroundColor: 'hsla(var(--color-primary), 0.1)',
                                padding: '12px',
                                borderRadius: 'var(--radius-md)',
                                marginRight: '16px'
                            }}>
                                <Folder size={24} color="hsl(var(--color-primary))" />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{project.name}</h3>
                        </div>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'auto' }}>
                            Created: {new Date(project.created_at).toLocaleDateString()}
                        </p>
                        <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', color: 'hsl(var(--color-primary))', fontWeight: 600 }}>
                            Manage <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default ProjectList;
