import { useState } from 'react';
import { useStore } from '../../store';

export default function ReceivePackage() {
    const { packages, updatePackageStatus } = useStore();
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');

    const handlePickup = (e: React.FormEvent) => {
        e.preventDefault();
        const pkg = packages.find(p => p.pickupCode === code && p.status === 'delivered');

        if (pkg) {
            updatePackageStatus(pkg.id, 'collected');
            setMessage(`Success! Package ${pkg.trackingNumber} collected.`);
            setCode('');
        } else {
            setMessage('Invalid code or package not ready for pickup.');
        }
    };

    return (
        <div className="card" style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
            <h2>Receive Package</h2>
            <p>Enter your 4-digit pickup code</p>

            <form onSubmit={handlePickup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                    type="text"
                    maxLength={4}
                    placeholder="XXXX"
                    style={{ fontSize: '2rem', textAlign: 'center', letterSpacing: '0.5rem' }}
                    value={code}
                    onChange={e => setCode(e.target.value)}
                />
                <button type="submit" className="primary">Open Locker</button>
            </form>

            {message && <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>{message}</p>}
        </div>
    );
}
