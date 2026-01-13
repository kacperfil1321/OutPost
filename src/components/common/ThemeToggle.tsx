import { useEffect, useState } from 'react';
import { Moon, Sun, Eye } from 'lucide-react';

export default function ThemeToggle() {
    const [mode, setMode] = useState<'light' | 'dark' | 'contrast'>('light');

    useEffect(() => {
        // Clear all theme classes first
        document.body.classList.remove('light', 'dark', 'contrast');

        // Apply new class
        document.body.classList.add(mode);

        // Note: If we wanted "System" as a default, we'd handle it differently, 
        // but here the buttons explicitly set 'light', 'dark' or 'contrast'.
    }, [mode]);

    const getButtonStyle = (btnMode: string) => ({
        backgroundColor: mode === btnMode ? 'var(--primary)' : 'var(--bg-secondary)',
        color: mode === btnMode ? '#000' : 'var(--text-main)',
        borderColor: mode === btnMode ? 'var(--primary)' : 'transparent'
    });

    return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setMode('light')} title="Light Mode" style={getButtonStyle('light')}>
                <Sun size={18} />
            </button>
            <button onClick={() => setMode('dark')} title="Dark Mode (System)" style={getButtonStyle('dark')}>
                <Moon size={18} />
            </button>
            <button onClick={() => setMode('contrast')} title="High Contrast" style={getButtonStyle('contrast')}>
                <Eye size={18} />
            </button>
        </div>
    );
}
