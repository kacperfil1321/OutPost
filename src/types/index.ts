export type UserRole = 'client' | 'courier';

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
}

export type PackageStatus = 'created' | 'picked_up' | 'in_transit' | 'delivered' | 'collected';

export interface PackageHistoryEvent {
    status: PackageStatus;
    timestamp: string;
    location?: string;
}

export interface Package {
    id: number;
    trackingNumber: string; // simpler display ID
    pickupCode: string; // for client to collect
    senderId: number; // User ID
    senderEmail?: string; // Sender's email fetched from relation
    receiverEmail: string; // For simplicity, just email
    lockerId: string; // Source Locker ID
    destinationLockerId?: string; // Destination Locker ID
    size: 'S' | 'M' | 'L';
    status: PackageStatus;
    history: PackageHistoryEvent[];
    createdAt: string;
}

export interface Locker {
    id: string;
    location_name: string; // Changed from location to match DB
    address: string;
    small_slots: number;
    medium_slots: number;
    large_slots: number;
    coordinates: [number, number]; // [lat, lng]
    courierId?: number; // Assigned Courier ID
}
