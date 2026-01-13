import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store';

export default function ClientRegister() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const register = useStore((state) => state.register);

    // We don't auto-redirect immediately so user can read the message
    // const navigate = useNavigate(); 

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = await register(formData.name, formData.email, formData.password, 'client');
        if (success) {
            setSuccessMsg('Registration successful! You can now login.');
            setFormData({ name: '', email: '', password: '' });
        } else {
            setError('Registration failed. Try again.');
        }
    };

    if (successMsg) {
        return (
            <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
                <h2>Client Registration</h2>
                <div className="card" style={{ padding: '2rem' }}>
                    <div style={{ color: 'var(--success)', marginBottom: '1rem', fontWeight: 'bold' }}>
                        {successMsg}
                    </div>
                    <Link to="/client/login"><button className="primary">Go to Login</button></Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
            <h2>Client Registration</h2>
            {error && <div style={{ color: 'var(--error)', marginBottom: '1rem' }}>{error}</div>}
            <form onSubmit={handleRegister} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
                <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />
                <button type="submit" className="primary">Register</button>
            </form>
            <p style={{ marginTop: '1rem' }}>
                Already have an account? <Link to="/client/login">Login here</Link>
            </p>
        </div>
    );
}
