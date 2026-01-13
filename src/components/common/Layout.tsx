import { useEffect } from 'react';

import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { useStore } from '../../store';
import { Settings } from 'lucide-react';

export default function Layout() {
    const { user, logout, fetchData } = useStore();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isClient = location.pathname.startsWith('/client');
    const isCourier = location.pathname.startsWith('/courier');

    return (
        <div style={{ maxWidth: '95%', margin: '0 auto', padding: '1rem' }}>
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 0',
                marginBottom: '2rem',
                borderBottom: '1px solid var(--border)'
            }}>
                <Link to={user ? (user.role === 'client' ? '/client/dashboard' : '/courier/dashboard') : '/'} style={{ textDecoration: 'none' }}>
                    <Logo />
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <ThemeToggle />
                    {user ? (
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <span>Hello, {user.name}</span>
                            <button onClick={() => navigate(`/${user.role}/settings`)} style={{ padding: '0.4rem', display: 'flex', alignItems: 'center' }} title="Settings">
                                <Settings size={18} />
                            </button>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {!isClient && !isCourier && (
                                <>
                                    <Link to="/client/login"><button>Client Zone</button></Link>
                                    <Link to="/courier/login"><button className="primary">Courier Zone</button></Link>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </header>

            <main>
                <Outlet />
            </main>

            <footer style={{ marginTop: '3rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                &copy; 2026 OutPost. All rights reserved.
            </footer>
        </div>
    );
}
