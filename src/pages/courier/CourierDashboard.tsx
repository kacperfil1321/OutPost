import { useState } from 'react';
import { useStore } from '../../store';
import PackageList from './PackageList';
import LockerMap from './LockerMap';
import { Package, CheckCircle, Clock, TrendingUp, Truck, Trophy } from 'lucide-react';

export default function CourierDashboard() {
    const { packages, lockers, user, couriers } = useStore();
    const [activeTab, setActiveTab] = useState<'overview' | 'packages' | 'map'>('overview');

    const myPackages = packages.filter(p => {
        const locker = lockers.find(l => l.id === p.lockerId);
        return locker?.courierId === user?.id;
    });

    const delivered = myPackages.filter(p => p.status === 'delivered' || p.status === 'collected').length;
    const pending = myPackages.filter(p => p.status !== 'delivered' && p.status !== 'collected').length;
    const totalPackages = myPackages.length;
    const efficiency = totalPackages > 0 ? Math.round((delivered / totalPackages) * 100) : 0;

    const leaderboard = couriers.map(c => {
        const courierLockers = lockers.filter(l => l.courierId === c.id).map(l => l.id);
        const courierPackages = packages.filter(p => courierLockers.includes(p.lockerId));

        const cDelivered = courierPackages.filter(p => p.status === 'delivered' || p.status === 'collected').length;
        const cTotal = courierPackages.length;
        const cEfficiency = cTotal > 0 ? Math.round((cDelivered / cTotal) * 100) : 0;

        return {
            id: c.id,
            name: c.name,
            score: cDelivered,
            efficiency: cEfficiency
        };
    })
        .sort((a, b) => b.score - a.score || b.efficiency - a.efficiency)
        .map((item, index) => ({ ...item, rank: index + 1 }))
        .slice(0, 5);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Courier Panel</h1>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className={activeTab === 'overview' ? 'primary' : ''} onClick={() => setActiveTab('overview')}>Overview</button>
                    <button className={activeTab === 'packages' ? 'primary' : ''} onClick={() => setActiveTab('packages')}>Packages</button>
                    <button className={activeTab === 'map' ? 'primary' : ''} onClick={() => setActiveTab('map')}>Map</button>
                </div>
            </div>

            {activeTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Welcome Banner */}
                    <div className="card" style={{
                        background: 'linear-gradient(135deg, var(--primary) 0%, #FFF59D 100%)',
                        border: 'none',
                        padding: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div>
                            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#1A1A1A' }}>Welcome back, Courier!</h2>
                            <p style={{ fontSize: '1.1rem', color: '#333' }}>You have <strong>{pending}</strong> packages pending delivery today.</p>
                        </div>
                        <Truck size={64} color="#1A1A1A" style={{ opacity: 0.8 }} />
                    </div>

                    {/* Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: '#EFF6FF' }}>
                                    <Package size={24} color="#2563EB" />
                                </div>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total</span>
                            </div>
                            <h3 style={{ fontSize: '2rem', margin: '0.5rem 0 0 0' }}>{totalPackages}</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>All time Assigned</p>
                        </div>

                        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: '#DCFCE7' }}>
                                    <CheckCircle size={24} color="#16A34A" />
                                </div>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Delivered</span>
                            </div>
                            <h3 style={{ fontSize: '2rem', margin: '0.5rem 0 0 0' }}>{delivered}</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>Completed jobs</p>
                        </div>

                        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: '#FEF3C7' }}>
                                    <Clock size={24} color="#D97706" />
                                </div>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Pending</span>
                            </div>
                            <h3 style={{ fontSize: '2rem', margin: '0.5rem 0 0 0' }}>{pending}</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>To be delivered</p>
                        </div>

                        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: '#F3E8FF' }}>
                                    <TrendingUp size={24} color="#9333EA" />
                                </div>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Efficiency</span>
                            </div>
                            <h3 style={{ fontSize: '2rem', margin: '0.5rem 0 0 0' }}>{efficiency}%</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>Completion rate</p>
                        </div>
                    </div>

                    {/* Courier Ranking */}
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Trophy size={24} color="#EAB308" />
                            Courier Ranking
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {leaderboard.map((courier) => (
                                <div key={courier.rank} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem',
                                    backgroundColor: courier.rank === 1 ? '#FEF9C3' : 'var(--bg-secondary)',
                                    color: courier.rank === 1 ? '#1F2937' : 'inherit',
                                    borderRadius: '8px',
                                    border: courier.rank === 1 ? '1px solid #EAB308' : 'none'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span style={{
                                            fontWeight: 'bold',
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '50%',
                                            backgroundColor: courier.rank <= 3 ? '#fff' : 'transparent',
                                            color: courier.rank <= 3 ? '#1F2937' : 'var(--text-primary)',
                                            fontSize: '0.9rem'
                                        }}>#{courier.rank}</span>
                                        <span style={{ fontWeight: 600 }}>{courier.name} {courier.id === user?.id ? '(You)' : ''}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem' }}>
                                        <span><strong>{courier.score}</strong> pkgs</span>
                                        <span style={{ color: courier.rank === 1 ? '#166534' : (courier.efficiency > 95 ? 'var(--success)' : 'var(--text-secondary)') }}>
                                            {courier.efficiency}% eff
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'packages' && <PackageList />}
            {activeTab === 'map' && <LockerMap />}
        </div>
    );
}
