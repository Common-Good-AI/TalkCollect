import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { Mic, Square, Save, Upload, Users } from 'lucide-react';

const RecordingPage = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [groups, setGroups] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');
    const [transcript, setTranscript] = useState('');

    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                const projRes = await api.get(`/projects/${projectId}`);
                setProject(projRes.data);
                const groupsRes = await api.get(`/projects/${projectId}/groups`);
                setGroups(groupsRes.data);
            } catch (error) {
                console.error("Failed to load project data", error);
            }
        };
        fetchProjectData();
    }, [projectId]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/mp3' }); // Note: Default might be webm
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                setAudioBlob(blob);

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone", err);
            alert("Could not access microphone. Please allow permissions.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleUpload = async () => {
        if (!audioBlob) return;
        setUploading(true);
        setUploadStatus('Uploading and Transcribing...');

        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.mp3'); // Filename is important for backend extension check
        formData.append('project_id', projectId);
        if (selectedGroupId) {
            formData.append('group_id', selectedGroupId);
        }

        try {
            const response = await api.post('/recordings/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUploadStatus('Success!');
            setTranscript(response.data.transcript);
        } catch (error) {
            console.error("Upload failed", error);
            setUploadStatus('Failed to upload.');
        } finally {
            setUploading(false);
        }
    };

    if (!project) return <div className="container" style={{ padding: '40px' }}>Loading...</div>;

    return (
        <div className="container" style={{ padding: '24px 20px', maxWidth: '600px' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{project.name}</h1>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>Record your conversation</p>

            <div className="card" style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                    <Users size={16} style={{ display: 'inline', marginRight: '8px' }} />
                    Select Group (Optional)
                </label>
                <select
                    className="input"
                    value={selectedGroupId}
                    onChange={(e) => setSelectedGroupId(e.target.value)}
                    disabled={isRecording}
                >
                    <option value="">-- Individual / No Group --</option>
                    {groups.map(g => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                </select>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px' }}>
                {!audioUrl ? (
                    <>
                        <button
                            onClick={isRecording ? stopRecording : startRecording}
                            style={{
                                width: '80px', height: '80px', borderRadius: '50%',
                                backgroundColor: isRecording ? 'var(--color-error)' : 'hsl(var(--color-primary))',
                                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                transition: 'all 0.2s'
                            }}
                        >
                            {isRecording ? <Square size={32} fill="currentColor" /> : <Mic size={32} />}
                        </button>
                        <p style={{ fontWeight: 600, fontSize: '1.2rem' }}>
                            {isRecording ? 'Recording in progress...' : 'Tap to Record'}
                        </p>
                    </>
                ) : (
                    <div style={{ width: '100%' }}>
                        <audio src={audioUrl} controls style={{ width: '100%', marginBottom: '24px' }} />

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button className="btn"
                                onClick={() => { setAudioUrl(null); setAudioBlob(null); setTranscript(''); setUploadStatus(''); }}
                                style={{ flex: 1, backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
                            >
                                Discard
                            </button>
                            <button className="btn btn-primary" onClick={handleUpload} disabled={uploading} style={{ flex: 1 }}>
                                {uploading ? 'Processing...' : (
                                    <><Upload size={18} style={{ marginRight: '8px' }} /> Submit Recording</>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {uploadStatus && (
                <div className="card" style={{ marginTop: '24px', backgroundColor: uploadStatus.includes('Success') ? 'rgba(0,255,100,0.1)' : 'var(--color-surface)' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>{uploadStatus}</h3>
                    {transcript && (
                        <div style={{ maxHeight: '200px', overflowY: 'auto', padding: '12px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                            <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>{transcript}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default RecordingPage;
