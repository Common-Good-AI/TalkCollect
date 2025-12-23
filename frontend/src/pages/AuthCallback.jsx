import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const code = searchParams.get('code');

    useEffect(() => {
        const exchangeCode = async () => {
            if (code) {
                try {
                    const response = await api.get(`/auth/callback?code=${code}`);
                    const { access_token, user } = response.data;

                    localStorage.setItem('token', access_token);
                    localStorage.setItem('user', JSON.stringify(user));

                    navigate('/dashboard');
                } catch (error) {
                    console.error("Auth callback failed", error);
                    navigate('/');
                }
            }
        };
        exchangeCode();
    }, [code, navigate]);

    return (
        <div className="container" style={{ marginTop: '100px', textAlign: 'center' }}>
            <h2>Authenticating...</h2>
        </div>
    );
};

export default AuthCallback;
