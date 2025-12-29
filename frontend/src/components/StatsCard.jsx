const StatsCard = ({ title, value, icon, color }) => {
    return (
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
                background: `rgba(${color}, 0.2)`,
                padding: '1rem',
                borderRadius: '12px',
                color: `rgb(${color})`
            }}>
                {icon}
            </div>
            <div>
                <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    {title}
                </h3>
                <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {value}
                </p>
            </div>
        </div>
    );
};

export default StatsCard;
