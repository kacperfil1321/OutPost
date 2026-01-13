import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../store';

export default function ClientLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const login = useStore((state) => state.login);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = await login(email, password, 'client');
        if (success) {
            navigate('/client/dashboard');
        } else {
            setError('Login failed. Check your email, password, or connection.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
            <h2>Client Login</h2>
            {error && <div style={{ color: 'var(--error)', marginBottom: '1rem' }}>{error}</div>}
            <form onSubmit={handleLogin} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                    type="email"
                    placeholder="Enter email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="primary">Login</button>
            </form>
            <p style={{ marginTop: '1rem' }}>
                New here? <Link to="/client/register">Create an account</Link>
            </p>
        </div>
    );
}
