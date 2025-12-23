import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Layout } from 'lucide-react';

const Login = () => {
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await api.get('/auth/login');
            window.location.href = response.data.url;
        } catch (error) {
            console.error("Login failed", error);
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
                    <Layout size={48} color="hsl(260, 100%, 65%)" />
                </div>
                <h1 style={{ fontSize: '2rem', marginBottom: '16px' }}>TalkCollect</h1>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '32px' }}>
                    Record, Transcribe, and Collect conversations seamlessly.
                </p>
                <button className="btn btn-primary" onClick={handleLogin} disabled={loading} style={{ width: '100%' }}>
                    {loading ? 'Redirecting...' : 'Login with Google'}
                </button>
            </div>
        </div>
    );
};

export default Login;
