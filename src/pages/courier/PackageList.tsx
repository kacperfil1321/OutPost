import { useState, useEffect } from 'react';
import { useStore } from '../../store';
import type { PackageStatus, Locker } from '../../types';
import MapComponent from '../../components/common/MapComponent';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function PackageList() {
    const { packages, updatePackageStatus, lockers, user } = useStore();
    const [filter, setFilter] = useState<PackageStatus | 'all'>('all');
    const [expandedPackageId, setExpandedPackageId] = useState<number | null>(null);
    const [routeData, setRouteData] = useState<Record<number, [number, number][]>>({});

    const filteredPackages = packages.filter(p => {
        // Status Filter
        if (filter !== 'all' && p.status !== filter) return false;

        // Restriction: Couriers can only see packages from THEIR assigned source lockers
        const locker = lockers.find(l => l.id === p.lockerId);
        return locker?.courierId === user?.id; // Must own the source locker
    });

    const toggleExpand = (id: number) => {
        setExpandedPackageId(expandedPackageId === id ? null : id);
    };

    useEffect(() => {
        const fetchRoute = async (pkgId: number) => {
            if (expandedPackageId !== pkgId) return;
            if (routeData[pkgId]) return; // Already have it

            const pkg = packages.find(p => p.id === pkgId);
            if (!pkg) return;

            const sourceLocker = lockers.find(l => l.id === pkg.lockerId);
            const destLocker = lockers.find(l => l.id === pkg.destinationLockerId);

            if (sourceLocker && destLocker) {
                // Fetch from OSRM
                // OSRM expects lon,lat
                const start = `${sourceLocker.coordinates[1]},${sourceLocker.coordinates[0]}`;
                const end = `${destLocker.coordinates[1]},${destLocker.coordinates[0]}`;

                try {
                    const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`);
                    const data = await response.json();
                    if (data.routes && data.routes.length > 0) {
                        const coords = data.routes[0].geometry.coordinates;
                        // OSRM returns [lon, lat], Leaflet wants [lat, lon]
                        const routeCoords = coords.map((c: any) => [c[1], c[0]] as [number, number]);
                        setRouteData(prev => ({ ...prev, [pkgId]: routeCoords }));
                    }
                } catch (e) {
                    console.error("Failed to fetch route", e);
                }
            }
        };

        if (expandedPackageId !== null) {
            fetchRoute(expandedPackageId);
        }
    }, [expandedPackageId, packages, lockers, routeData]);

    const StatusBadge = ({ status }: { status: string }) => {
        const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
            created: { label: 'Created', bg: '#E2E8F0', color: '#1F2937' },
            picked_up: { label: 'Picked Up', bg: '#DBEAFE', color: '#1E40AF' },
            in_transit: { label: 'In Transit', bg: '#FEF3C7', color: '#92400E' },
            delivered: { label: 'Delivered', bg: '#D1FAE5', color: '#065F46' },
            collected: { label: 'Collected', bg: '#F3E8FF', color: '#6B21A8' }
        };

        const config = statusConfig[status] || { label: status, bg: '#E5E7EB', color: '#374151' };

        return (
            <span style={{
                backgroundColor: config.bg,
                color: config.color,
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }}>
                {config.label}
            </span>
        );
    };

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Package List</h3>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    style={{ width: 'auto' }}
                >
                    <option value="all">All Statuses</option>
                    <option value="created">Created (To Pickup)</option>
                    <option value="picked_up">Picked Up</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {filteredPackages.map(pkg => {
                    const isExpanded = expandedPackageId === pkg.id;
                    const sourceLocker = lockers.find(l => l.id === pkg.lockerId);
                    const destLocker = lockers.find(l => l.id === pkg.destinationLockerId);

                    const mapLockers: Locker[] = [];
                    if (sourceLocker) mapLockers.push(sourceLocker);
                    if (destLocker) mapLockers.push(destLocker);

                    const route = routeData[pkg.id] || ((sourceLocker && destLocker)
                        ? [sourceLocker.coordinates, destLocker.coordinates]
                        : []);

                    return (
                        <div key={pkg.id} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.8rem',
                                backgroundColor: isExpanded ? 'var(--bg-secondary)' : 'transparent',
                                cursor: 'pointer'
                            }} onClick={() => toggleExpand(pkg.id)}>
                                <div style={{ flex: 1, marginRight: '1rem' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{pkg.trackingNumber}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                                        <div><strong>From:</strong> {pkg.lockerId}</div>
                                        <div><strong>To:</strong> {pkg.destinationLockerId || 'N/A'}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <StatusBadge status={pkg.status} />
                                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                            </div>

                            {isExpanded && (
                                <div style={{ padding: '1rem', borderTop: '1px solid var(--border)' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                        <div>
                                            <strong>Sender:</strong> {pkg.senderEmail || 'Unknown'}
                                        </div>
                                        <div>
                                            <strong>Receiver:</strong> {pkg.receiverEmail}
                                        </div>
                                        <div>
                                            <strong>Size:</strong> {pkg.size}
                                        </div>
                                        <div>
                                            <strong>Pickup Code:</strong> {pkg.pickupCode}
                                        </div>
                                    </div>

                                    <div style={{ height: '300px', width: '100%', marginBottom: '1rem' }}>
                                        {mapLockers.length > 0 ? (
                                            <MapComponent key={`${pkg.id}-${pkg.status}`} lockers={mapLockers} route={route} />
                                        ) : (
                                            <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Location details unavailable.</p>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                        {pkg.status === 'created' && (
                                            <button className="primary" onClick={(e) => { e.stopPropagation(); updatePackageStatus(pkg.id, 'picked_up'); }}>Pick Up</button>
                                        )}
                                        {pkg.status === 'picked_up' && (
                                            <button className="primary" onClick={(e) => { e.stopPropagation(); updatePackageStatus(pkg.id, 'in_transit'); }}>To Transit</button>
                                        )}
                                        {pkg.status === 'in_transit' && (
                                            <button className="primary" onClick={(e) => { e.stopPropagation(); updatePackageStatus(pkg.id, 'delivered'); }}>Deliver</button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
                {filteredPackages.length === 0 && <p>No packages found.</p>}
            </div>
        </div>
    );
}
