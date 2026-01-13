export default function Logo() {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 900, fontSize: '1.5rem', color: 'var(--primary)' }}>
            <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'var(--primary)',
                color: 'black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px'
            }}>
                OP
            </div>
            <span style={{ color: 'var(--text-main)' }}>OutPost</span>
        </div>
    );
}
