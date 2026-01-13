import { useStore } from '../../store';

export default function History() {
    const { user, packages } = useStore();
    // In a real app, we'd filter by user ID properly
    const myPackages = packages.filter(p => p.receiverEmail === (user?.email || 'client@example.com') || p.senderId === (user?.id || 'u1'));

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1>Package History</h1>
            <div className="card">
                {myPackages.length === 0 ? (
                    <p>No history available.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '1rem' }}>Tracking #</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem' }}>Last Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myPackages.map(pkg => (
                                <tr key={pkg.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem' }}>{pkg.trackingNumber}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            backgroundColor: 'var(--bg-main)',
                                            border: '1px solid var(--border)'
                                        }}>
                                            {pkg.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {new Date(pkg.history[pkg.history.length - 1].timestamp).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
