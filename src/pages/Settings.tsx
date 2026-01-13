import { useState } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Save, ArrowLeft } from 'lucide-react';

export default function Settings() {
    const { user, updateUser } = useStore();
    const navigate = useNavigate();

    const [name, setName] = useState(user?.name || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (!user) return;

        if (password && password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        const updates: { name?: string; password?: string } = {};
        if (name !== user.name) updates.name = name;
        if (password) updates.password = password;

        if (Object.keys(updates).length === 0) {
            setMessage({ type: 'error', text: 'No changes detected' });
            return;
        }

        const success = await updateUser(user.id, updates);
        if (success) {
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setPassword('');
            setConfirmPassword('');
        } else {
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <button
                onClick={() => navigate(user?.role === 'courier' ? '/courier/dashboard' : '/client/dashboard')}
                style={{
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    marginBottom: '1rem',
                    padding: 0
                }}
            >
                <ArrowLeft size={20} />
                Back to Dashboard
            </button>

            <div className="card" style={{ padding: '2rem' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0 }}>
                    <User size={24} />
                    Account Settings
                </h2>

                {message && (
                    <div style={{
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        backgroundColor: message.type === 'success' ? '#DEF7EC' : '#FDE8E8',
                        color: message.type === 'success' ? '#03543F' : '#9B1C1C',
                        border: `1px solid ${message.type === 'success' ? '#84E1BC' : '#F8B4B4'}`
                    }}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{ width: '100%', paddingLeft: '40px' }}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', marginTop: 0, marginBottom: '1rem' }}>Change Password</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Leave blank if you don't want to change it.</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>New Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{ width: '100%', paddingLeft: '40px' }}
                                        placeholder="Enter new password"
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Confirm New Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        style={{ width: '100%', paddingLeft: '40px' }}
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                        <Save size={20} />
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}
