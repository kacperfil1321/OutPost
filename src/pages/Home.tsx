import { Link, Navigate } from 'react-router-dom';
import { Package, Truck } from 'lucide-react';
import { useStore } from '../store';

export default function Home() {
    const user = useStore((state) => state.user);

    if (user) {
        if (user.role === 'client') {
            return <Navigate to="/client/dashboard" replace />;
        }
        if (user.role === 'courier') {
            return <Navigate to="/courier/dashboard" replace />;
        }
    }

    return (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Fast Delivery, Happy People.</h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
                Welcome to OutPost. Choose your portal to get started.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <Link to="/client/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'transform 0.2s' }}>
                        <div style={{ padding: '2rem', backgroundColor: 'var(--bg-main)', borderRadius: '50%' }}>
                            <Package size={48} color="var(--primary)" />
                        </div>
                        <h2>Client Zone</h2>
                        <p>Send packages, track deliveries, and find lockers near you.</p>
                        <button className="primary" style={{ width: '100%' }}>Enter as Client</button>
                    </div>
                </Link>

                <Link to="/courier/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'transform 0.2s' }}>
                        <div style={{ padding: '2rem', backgroundColor: 'var(--bg-main)', borderRadius: '50%' }}>
                            <Truck size={48} color="var(--primary)" />
                        </div>
                        <h2>Courier Zone</h2>
                        <p>Manage deliveries, check locker status, and optimize your route.</p>
                        <button className="primary" style={{ width: '100%' }}>Enter as Courier</button>
                    </div>
                </Link>
            </div>
        </div>
    );
}
