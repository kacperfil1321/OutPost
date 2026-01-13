import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Package, Locker, User, PackageStatus } from '../types';
import { supabase } from '../lib/supabase';

interface AppState {
    user: User | null;
    packages: Package[];
    lockers: Locker[];
    couriers: User[];

    // Async Actions
    login: (email: string, password: string, role: 'client' | 'courier') => Promise<boolean>;
    register: (name: string, email: string, password: string, role: 'client' | 'courier') => Promise<boolean>;
    logout: () => void;

    fetchData: () => Promise<void>;
    addPackage: (pkg: Omit<Package, 'id' | 'createdAt'>) => Promise<void>;
    updatePackageStatus: (id: number, status: PackageStatus) => Promise<void>; // id is number in DB
    checkUserExists: (email: string) => Promise<boolean>;
    submitIssueReport: (report: { userId: number; trackingNumber: string; issueType: string; description: string; }) => Promise<boolean>;
    updateUser: (id: number, updates: { name?: string; password?: string }) => Promise<boolean>;
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            user: null,
            packages: [],
            lockers: [],
            couriers: [],

            login: async (email, password, role) => {
                // Check credentials against DB
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('email', email)
                    .eq('role', role)
                    .eq('password_hash', password) // Comparing plain text for prototype simplicity per user request
                    .single();

                if (error || !data) {
                    console.error('Login failed:', error);
                    return false;
                }

                set({ user: data as User });
                get().fetchData(); // Load data on login
                return true;
            },

            register: async (name, email, password, role) => {
                const { error } = await supabase
                    .from('users')
                    .insert([{ name, email, role, password_hash: password }]); // Store actual password

                if (error) {
                    console.error('Registration failed:', error);
                    return false;
                }
                return true;
            },

            logout: () => {
                set({ user: null, packages: [] });
                localStorage.removeItem('outpost-storage'); // Clear storage
            },

            fetchData: async () => {
                // Fetch all Couriers for ranking
                const { data: couriersData } = await supabase.from('users').select('*').eq('role', 'courier');
                if (couriersData) {
                    set({ couriers: couriersData as User[] });
                }

                // Fetch Lockers
                const { data: lockersData, error: lockerError } = await supabase.from('lockers').select('*');

                if (lockerError) {
                    console.error('Error fetching lockers:', lockerError);
                }

                if (lockersData) {
                    console.log('Fetched lockers:', lockersData);
                    // Map DB fields to Type if needed, or assume match if we were careful
                    // DB has lat/long columns, Type has coordinates array
                    const mappedLockers = lockersData.map((l: any) => ({
                        ...l,
                        coordinates: [Number(l.latitude), Number(l.longitude)],
                        courierId: l.courier_id
                    }));
                    set({ lockers: mappedLockers });
                }

                // Fetch Packages with Sender Email
                const { data: packagesData, error: packageError } = await supabase
                    .from('packages')
                    .select('*, sender:sender_id(email)')
                    .order('created_at', { ascending: false });

                if (packageError) {
                    console.error('Error fetching packages:', packageError);
                }

                if (packagesData) {
                    // Map DB fields to Type if needed, or assume match if we were careful
                    // DB has lat/long columns, Type has coordinates array
                    // We need to map.
                    const mappedPackages = packagesData.map((p: any) => ({
                        id: p.id,
                        trackingNumber: p.tracking_number,
                        pickupCode: p.pickup_code,
                        senderId: p.sender_id,
                        senderEmail: p.sender?.email, // Map sender email
                        receiverEmail: p.receiver_email,
                        lockerId: p.locker_id,
                        destinationLockerId: p.destination_locker_id,
                        size: p.size,
                        status: p.status,
                        history: [], // Fetch history separately if needed
                        createdAt: p.created_at
                    }));
                    set({ packages: mappedPackages });
                }
            },

            addPackage: async (pkg) => {
                // DB Insert
                const { error } = await supabase.from('packages').insert([{
                    tracking_number: pkg.trackingNumber,
                    pickup_code: pkg.pickupCode,
                    sender_id: pkg.senderId,
                    receiver_email: pkg.receiverEmail,
                    locker_id: pkg.lockerId,
                    destination_locker_id: pkg.destinationLockerId,
                    size: pkg.size,
                    status: 'created'
                }]);

                if (error) {
                    console.error('Error adding package:', error);
                    alert('Error creating package: ' + error.message);
                }

                if (!error) {
                    get().fetchData();
                }
            },

            updatePackageStatus: async (id, status) => {
                await supabase.from('packages').update({ status }).eq('id', id);
                get().fetchData();
            },

            checkUserExists: async (email: string) => {
                const { count, error } = await supabase
                    .from('users')
                    .select('*', { count: 'exact', head: true })
                    .eq('email', email);

                if (error) {
                    console.error('Error checking user:', error);
                    return false;
                }

                return count !== null && count > 0;
            },

            submitIssueReport: async (report) => {
                const { error } = await supabase
                    .from('issue_reports')
                    .insert([{
                        user_id: report.userId,
                        tracking_number: report.trackingNumber,
                        issue_type: report.issueType,
                        description: report.description,
                        status: 'open'
                    }]);

                if (error) {
                    console.error('Error submitting report:', error);
                    return false;
                }
                return true;
            },

            updateUser: async (id, val) => {
                const dbUpdates: any = {};
                if (val.name) dbUpdates.name = val.name;
                if (val.password) dbUpdates.password_hash = val.password;

                const { error } = await supabase.from('users').update(dbUpdates).eq('id', id);

                if (error) {
                    console.error('Update failed:', error);
                    return false;
                }

                // Update local state
                const currentUser = get().user;
                if (currentUser && currentUser.id === id) {
                    set({ user: { ...currentUser, name: val.name || currentUser.name } });
                }

                return true;
            }
        }),
        {
            name: 'outpost-storage',
            partialize: (state) => ({ user: state.user }),
        }
    )
);
