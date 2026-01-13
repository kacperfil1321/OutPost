import { useState } from 'react';
import { useStore } from '../../store';
import { Link } from 'react-router-dom';
import { Package, Send, Search, ArrowRight, ArrowLeft } from 'lucide-react';

const PackageItem = ({ p, type }: { p: any, type: 'sent' | 'received' }) => {
    const [showCode, setShowCode] = useState(false);

    const statusConfig: Record<string, { bg: string; color: string }> = {
        created: { bg: '#E2E8F0', color: '#1F2937' },
        picked_up: { bg: '#DBEAFE', color: '#1E40AF' },
        in_transit: { bg: '#FEF3C7', color: '#92400E' },
        delivered: { bg: '#D1FAE5', color: '#065F46' },
        collected: { bg: '#F3E8FF', color: '#6B21A8' }
    };
    const style = statusConfig[p.status] || { bg: '#E5E7EB', color: '#374151' };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            padding: '1rem',
            borderBottom: '1px solid var(--border)',
            position: 'relative'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>{p.trackingNumber}</span>
                <span style={{
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    backgroundColor: style.bg,
                    color: style.color,
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase'
                }}>
                    {p.status.replace('_', ' ')}
                </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <strong>{new Date(p.createdAt).toLocaleDateString()}</strong>
                    {type === 'sent' ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
                    <span>{type === 'sent' ? `To: ${p.receiverEmail}` : `From: ${p.senderEmail || 'Unknown Sender'}`}</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                    <span>{p.lockerId} &rarr; {p.destinationLockerId || '?'}</span>
                    <span>Size: {p.size || '-'}</span>
                </div>

                {type === 'received' && (
                    <div style={{ marginTop: '0.5rem', borderTop: '1px dashed var(--border)', paddingTop: '0.5rem' }}>
                        {showCode ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text-main)' }}>{p.pickupCode}</span>
                                <button
                                    onClick={() => setShowCode(false)}
                                    style={{
                                        fontSize: '0.75rem', padding: '2px 8px', background: 'transparent',
                                        border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer', color: 'var(--text-secondary)'
                                    }}
                                >
                                    Hide
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowCode(true)}
                                style={{
                                    fontSize: '0.8rem', padding: '4px 10px', backgroundColor: 'var(--primary)',
                                    border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, color: '#000'
                                }}
                            >
                                Show Pickup Code
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default function ClientDashboard() {
    const { user, packages } = useStore();
    const [sentFilter, setSentFilter] = useState('all');
    const [receivedFilter, setReceivedFilter] = useState('all');

    const packagesToPickup = packages.filter(p => p.receiverEmail === user?.email && p.status === 'delivered').length;

    const sentPackages = packages
        .filter(p => p.senderId === user?.id)
        .filter(p => sentFilter === 'all' || p.status === sentFilter)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const receivedPackages = packages
        .filter(p => p.receiverEmail === user?.email)
        .filter(p => receivedFilter === 'all' || p.status === receivedFilter)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const FilterSelect = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '0.85rem', width: 'auto', maxWidth: '140px' }}
        >
            <option value="all">All</option>
            <option value="created">Created</option>
            <option value="picked_up">Picked Up</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="collected">Collected</option>
        </select>
    );

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ marginBottom: '0.5rem' }}>Welcome, {user?.name || 'Guest'}</h1>
                <p style={{ color: 'var(--text-main)', fontSize: '1.1rem' }}>
                    You have <strong style={{ color: packagesToPickup > 0 ? 'var(--primary)' : 'inherit' }}>{packagesToPickup}</strong> package(s) ready to pick up.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                <Link to="/client/send" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer', transition: '0.2s', height: '100%' }}>
                        <div style={{ marginBottom: '1rem', color: 'var(--primary)' }}><Send size={40} /></div>
                        <h3>Send Package</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Create a new shipment</p>
                    </div>
                </Link>

                <Link to="/client/receive" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer', transition: '0.2s', height: '100%' }}>
                        <div style={{ marginBottom: '1rem', color: 'var(--primary)' }}><Package size={40} /></div>
                        <h3>Receive Package</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Pickup with code</p>
                    </div>
                </Link>

                <Link to="/client/track" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer', transition: '0.2s', height: '100%' }}>
                        <div style={{ marginBottom: '1rem', color: 'var(--primary)' }}><Search size={40} /></div>
                        <h3>Track & Find</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Locate your parcel</p>
                    </div>
                </Link>
            </div>

            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <Link to="/client/support" style={{ flex: 1, textDecoration: 'none', minWidth: '200px' }}><button style={{ width: '100%' }}>Support & Ratings</button></Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                {/* Outgoing Column */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                            <Send size={24} />
                            Sent
                        </h2>
                        <FilterSelect value={sentFilter} onChange={setSentFilter} />
                    </div>
                    <div className="card" style={{ minHeight: '300px', padding: 0, overflow: 'hidden' }}>
                        {sentPackages.length === 0 ? (
                            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No sent packages.</p>
                        ) : (
                            sentPackages.map(p => <PackageItem key={p.id} p={p} type="sent" />)
                        )}
                    </div>
                </div>

                {/* Incoming Column */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                            <Package size={24} />
                            Received
                        </h2>
                        <FilterSelect value={receivedFilter} onChange={setReceivedFilter} />
                    </div>
                    <div className="card" style={{ minHeight: '300px', padding: 0, overflow: 'hidden' }}>
                        {receivedPackages.length === 0 ? (
                            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No received packages.</p>
                        ) : (
                            receivedPackages.map(p => <PackageItem key={p.id} p={p} type="received" />)
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
