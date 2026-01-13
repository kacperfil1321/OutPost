import { useStore } from '../../store';
import MapComponent from '../../components/common/MapComponent';

export default function LockerMap() {
    const { lockers } = useStore();

    return (
        <div className="card" style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '1rem' }}>Locker Locations & Occupancy</h3>
            <div style={{ flex: 1 }}>
                <MapComponent lockers={lockers} />
            </div>
        </div>
    );
}
