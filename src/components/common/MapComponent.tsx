import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Locker } from '../../types';
import { Icon } from 'leaflet';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

// Fix leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = new Icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

type MapProps = {
    lockers: Locker[];
    onSelectSource?: (id: string) => void;
    onSelectDestination?: (id: string) => void;
    route?: [number, number][];
};

function MapBounds({ lockers }: { lockers: Locker[] }) {
    const map = useMap();

    useEffect(() => {
        if (lockers.length > 0) {
            const bounds = lockers.map(l => l.coordinates);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [lockers, map]);

    return null;
}

export default function MapComponent({ lockers, onSelectSource, onSelectDestination, route }: MapProps) {
    return (
        <MapContainer center={[52.0, 19.0]} zoom={6} style={{ height: '100%', width: '100%', borderRadius: '12px' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {lockers.map(locker => (
                <Marker key={locker.id} position={locker.coordinates} icon={DefaultIcon}>
                    <Popup>
                        <strong>{locker.location_name}</strong><br />
                        {locker.address}<br />
                        <small>Small: {locker.small_slots} | Med: {locker.medium_slots} | Lrg: {locker.large_slots}</small>
                        <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            {onSelectSource && (
                                <button
                                    onClick={() => onSelectSource(locker.id)}
                                    style={{
                                        padding: '0.25rem 0.5rem',
                                        backgroundColor: 'var(--primary)',
                                        color: '#000',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Select as Source
                                </button>
                            )}
                            {onSelectDestination && (
                                <button
                                    onClick={() => onSelectDestination(locker.id)}
                                    style={{
                                        padding: '0.25rem 0.5rem',
                                        backgroundColor: 'var(--text-main)',
                                        color: 'var(--bg-main)',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Select as Destination
                                </button>
                            )}
                        </div>
                    </Popup>
                </Marker>
            ))}
            {route && <Polyline positions={route} color="blue" />}
            <MapBounds lockers={lockers} />
        </MapContainer>
    );
}
