import { useState, useEffect } from 'react';
import { useStore } from '../../store';
import { useNavigate } from 'react-router-dom';
import MapComponent from '../../components/common/MapComponent';
import { calculateDistance, calculatePrice } from '../../lib/utils';


export default function SendPackage() {
    const { user, addPackage, lockers, checkUserExists } = useStore();
    const navigate = useNavigate();
    const [receiverEmail, setReceiverEmail] = useState('');
    const [size, setSize] = useState('S');
    const [sourceLocker, setSourceLocker] = useState('');
    const [destLocker, setDestLocker] = useState('');
    const [estimatedPrice, setEstimatedPrice] = useState(10);
    const [successData, setSuccessData] = useState<{ trackingNumber: string; pickupCode: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Effect to calculate price whenever relevant state changes
    useEffect(() => {
        if (sourceLocker && destLocker) {
            const source = lockers.find(l => l.id === sourceLocker);
            const dest = lockers.find(l => l.id === destLocker);

            if (source && dest) {
                const distance = calculateDistance(
                    source.coordinates[0], source.coordinates[1],
                    dest.coordinates[0], dest.coordinates[1]
                );
                const price = calculatePrice(size, distance);
                setEstimatedPrice(price);
            }
        } else {
            // Default base price if not fully selected
            setEstimatedPrice(calculatePrice(size, 0));
        }
    }, [size, sourceLocker, destLocker, lockers]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!sourceLocker || !destLocker) {
            setError('Please select both source and destination lockers.');
            return;
        }

        if (sourceLocker === destLocker) {
            setError('Source and destination lockers cannot be the same. Please select different lockers.');
            return;
        }

        const receiverExists = await checkUserExists(receiverEmail);
        if (!receiverExists) {
            setError('Receiver with this email does not exist in our system.');
            return;
        }

        const trackingNumber = 'OP' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        const pickupCode = Math.floor(Math.random() * 9000 + 1000).toString();

        await addPackage({
            trackingNumber,
            pickupCode,
            senderId: user?.id || 0, // Fallback if mocking
            receiverEmail,
            lockerId: sourceLocker,
            destinationLockerId: destLocker,
            size: size as 'S' | 'M' | 'L',
            status: 'created',
            history: [] // Init empty
        });

        setSuccessData({ trackingNumber, pickupCode });
        // Removed navigate and alert
    };

    if (successData) {
        return (
            <div style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center', padding: '2rem', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--bg-secondary)' }}>
                <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Package Registered Successfully!</h2>
                <p>Your package is ready to be dropped off.</p>

                <div style={{ margin: '2rem 0', padding: '1.5rem', background: 'var(--bg-main)', borderRadius: '8px', border: '1px dashed var(--text-secondary)' }}>
                    <p style={{ margin: '0.5rem 0' }}><strong>Tracking Number:</strong></p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 1rem 0' }}>{successData.trackingNumber}</p>

                    <p style={{ margin: '0.5rem 0' }}><strong>Pickup Code (for Recipient):</strong></p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{successData.pickupCode}</p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button onClick={() => navigate('/client/dashboard')} className="primary">
                        Go to Dashboard
                    </button>
                    <button onClick={() => {
                        setSuccessData(null);
                        setSourceLocker('');
                        setDestLocker('');
                        setReceiverEmail('');
                        setSize('S');
                        setError(null);
                    }} style={{ background: 'transparent', border: '1px solid var(--text-main)', color: 'var(--text-main)' }}>
                        Send Another
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div style={{ order: 2 }}>
                <h2 style={{ marginBottom: '1rem' }}>Select Lockers on Map</h2>
                <div style={{ height: '500px', width: '100%' }}>
                    <MapComponent
                        lockers={lockers}
                        onSelectSource={setSourceLocker}
                        onSelectDestination={setDestLocker}
                    />
                </div>
                <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <p>Click on a locker pin to select it as Source or Destination.</p>
                </div>
            </div>

            <div style={{ order: 1 }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Send a Package</h2>
                <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {error && (
                        <div style={{
                            padding: '1rem',
                            backgroundColor: 'rgba(255, 0, 0, 0.1)',
                            border: '1px solid red',
                            borderRadius: '8px',
                            color: 'red',
                            fontWeight: 'bold'
                        }}>
                            {error}
                        </div>
                    )}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Receiver Email</label>
                        <input
                            type="email"
                            value={receiverEmail}
                            onChange={e => setReceiverEmail(e.target.value)}
                            required
                            placeholder="recipient@example.com"
                            style={{ width: '100%', padding: '0.8rem' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Package Size</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {['S', 'M', 'L'].map(s => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setSize(s)}
                                    style={{
                                        flex: 1,
                                        backgroundColor: size === s ? 'var(--primary)' : 'var(--bg-secondary)',
                                        color: size === s ? '#000' : 'var(--text-main)',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Source Locker (Drop-off)</label>
                        <select
                            value={sourceLocker}
                            onChange={e => setSourceLocker(e.target.value)}
                            required
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
                        >
                            <option value="">-- Select Source Locker --</option>
                            {lockers.map(l => (
                                <option key={l.id} value={l.id}>{l.location_name} ({l.address})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Destination Locker</label>
                        <select
                            value={destLocker}
                            onChange={e => setDestLocker(e.target.value)}
                            required
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
                        >
                            <option value="">-- Select Destination Locker --</option>
                            {lockers.map(l => (
                                <option key={l.id} value={l.id}>{l.location_name} ({l.address})</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
                        <p style={{ margin: 0, fontSize: '1.2rem' }}><strong>Estimated Cost:</strong> {estimatedPrice.toFixed(2)} PLN</p>
                        <small style={{ color: 'var(--text-secondary)' }}>Size {size} + Distance Fee</small>
                    </div>

                    <button type="submit" className="primary" style={{ padding: '1rem', fontSize: '1.1rem' }}>
                        Generate Label & Send
                    </button>
                </form>
            </div>
        </div>
    );
}
