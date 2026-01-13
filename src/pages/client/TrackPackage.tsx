import { useState, useEffect } from 'react';
import { useStore } from '../../store';
import MapComponent from '../../components/common/MapComponent';
import type { Locker } from '../../types';

export default function TrackPackage() {
    const { packages, lockers } = useStore();
    const [trackingNum, setTrackingNum] = useState('');
    const [foundPackage, setFoundPackage] = useState<any>(null);
    const [displayLockers, setDisplayLockers] = useState<Locker[]>([]);

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        const pkg = packages.find(p => p.trackingNumber === trackingNum);
        setFoundPackage(pkg || null);
    };

    useEffect(() => {
        if (!foundPackage) {
            setDisplayLockers([]);
            return;
        }

        const source = lockers.find(l => l.id === foundPackage.lockerId);
        const dest = lockers.find(l => l.id === foundPackage.destinationLockerId);

        if (!source) return;

        if (foundPackage.status === 'created' || foundPackage.status === 'picked_up') {
            setDisplayLockers([source]);
        } else if (foundPackage.status === 'in_transit') {
            if (source && dest) {
                // Generate a random position between 20% and 80% of the path
                const progress = 0.2 + Math.random() * 0.6;
                const lat = source.coordinates[0] + (dest.coordinates[0] - source.coordinates[0]) * progress;
                const lng = source.coordinates[1] + (dest.coordinates[1] - source.coordinates[1]) * progress;

                setDisplayLockers([{
                    id: 'in-transit',
                    location_name: 'In Transit',
                    address: `On the way to ${dest.location_name}`,
                    coordinates: [lat, lng],
                    small_slots: 0,
                    medium_slots: 0,
                    large_slots: 0
                }]);
            } else {
                setDisplayLockers([source]);
            }
        } else if (foundPackage.status === 'delivered' || foundPackage.status === 'collected') {
            if (dest) setDisplayLockers([dest]);
        } else {
            // Default
            setDisplayLockers([source]);
        }

    }, [foundPackage, lockers]);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h2>Track Package</h2>
                <form onSubmit={handleTrack} style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        value={trackingNum}
                        onChange={e => setTrackingNum(e.target.value)}
                        placeholder="Enter tracking number (e.g. TRK-001-...)"
                        style={{ flex: 1 }}
                    />
                    <button type="submit" className="primary">Track</button>
                </form>
            </div>

            {foundPackage && (
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div>
                            <h3 style={{ margin: 0 }}>Status: {foundPackage.status.replace('_', ' ').toUpperCase()}</h3>
                            <p style={{ margin: '0.5rem 0 0', color: 'var(--text-secondary)' }}>
                                From: {foundPackage.lockerId} &rarr; To: {foundPackage.destinationLockerId}
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ display: 'block', fontWeight: 'bold', fontSize: '1.2rem' }}>{foundPackage.pickupCode}</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pickup Code</span>
                        </div>
                    </div>

                    <div style={{ height: '400px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                        {displayLockers.length > 0 ? (
                            <MapComponent lockers={displayLockers} />
                        ) : (
                            <p style={{ textAlign: 'center', padding: '2rem' }}>Location details unavailable.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
