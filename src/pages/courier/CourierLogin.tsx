import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';

export default function CourierLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const login = useStore((state) => state.login);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = await login(email, password, 'courier');
        if (success) {
            navigate('/courier/dashboard');
        } else {
            setError('Login failed. Check your email, password, or connection.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
            <h2>Courier Login</h2>
            {error && <div style={{ color: 'var(--error)', marginBottom: '1rem' }}>{error}</div>}
            <form onSubmit={handleLogin} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                    type="email"
                    placeholder="Courier ID (Email)..."
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
        </div>
    );
}
