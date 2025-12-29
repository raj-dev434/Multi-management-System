import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';
import { Download, Calendar, Filter } from 'lucide-react';

const Reports = () => {
    const [activeTab, setActiveTab] = useState('stock');
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [data, setData] = useState([]);

    // Filters
    const [parties, setParties] = useState([]);
    const [selectedParty, setSelectedParty] = useState('');
    const [feeType, setFeeType] = useState('');

    useEffect(() => {
        // Fetch parties for filter
        api.get('/parties').then(res => setParties(res.data)).catch(console.error);
    }, []);

    useEffect(() => {
        fetchReport();
    }, [activeTab, startDate, endDate, selectedParty, feeType]);

    const fetchReport = async () => {
        try {
            let res;
            if (activeTab === 'stock') {
                res = await api.get(`/report/stock-movements?startDate=${startDate}&endDate=${endDate}&partyId=${selectedParty}`);
            } else if (activeTab === 'badminton') {
                res = await api.get(`/report/badminton-movements?startDate=${startDate}&endDate=${endDate}`);
            } else {
                res = await api.get(`/report/player-fees?startDate=${startDate}&endDate=${endDate}&feeType=${feeType}`);
            }
            setData(res.data);
        } catch (err) {
            console.error("Report fetch error", err);
            setData([]);
        }
    };

    const downloadCSV = () => {
        if (!data.length) return alert("No data to download");

        let headers = [];
        let rows = [];

        if (activeTab === 'stock') {
            headers = ['Date', 'Type', 'Item', 'Quantity', 'Party', 'Location'];
            rows = data.map(d => [
                d.movementDate,
                d.movementType,
                d.storageStock?.item?.name || '-',
                d.quantity,
                d.party?.name || '-',
                d.storageStock?.storageLocation?.name || '-'
            ]);
        } else if (activeTab === 'badminton') {
            headers = ['Date', 'Type', 'Quantity', 'Sold To'];
            rows = data.map(d => [
                d.date,
                d.type,
                d.quantity,
                d.soldTo || '-'
            ]);
        } else {
            headers = ['Date', 'Player', 'Type', 'Amount', 'Status', 'Details'];
            rows = data.map(d => [
                d.paymentDate,
                d.playerName,
                d.feeType || 'BATCH',
                d.amount,
                d.status,
                d.feeType === 'GUEST' ? `${d.durationHours} hrs (Ct ${d.courtNumber})` : `${d.month} ${d.year}`
            ]);
        }

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(item => `"${item}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${activeTab}_report_${startDate}_to_${endDate}.csv`;
        a.click();
    };

    return (
        <div className="layout-container">
            <Navbar />
            <div className="content-wrapper">
                <div className="page-header">
                    <h1>Reports & Analytics</h1>
                    <button className="btn btn-primary" onClick={downloadCSV}>
                        <Download size={18} /> Download CSV
                    </button>
                </div>

                {/* Filters */}
                <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'end' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem' }}>Start Date</label>
                        <input type="date" className="glass-input" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem' }}>End Date</label>
                        <input type="date" className="glass-input" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    </div>

                    {activeTab === 'stock' && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem' }}>Filter by Party</label>
                            <select className="glass-input" value={selectedParty} onChange={e => setSelectedParty(e.target.value)} style={{ minWidth: '200px' }}>
                                <option value="">All Parties</option>
                                {parties.map(p => <option key={p.id} value={p.id} style={{ color: 'black' }}>{p.name}</option>)}
                            </select>
                        </div>
                    )}

                    {activeTab === 'fees' && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem' }}>Fee Type</label>
                            <select className="glass-input" value={feeType} onChange={e => setFeeType(e.target.value)} style={{ minWidth: '200px' }}>
                                <option value="" style={{ color: 'black' }}>All Types</option>
                                <option value="BATCH" style={{ color: 'black' }}>Batch Fee</option>
                                <option value="GUEST" style={{ color: 'black' }}>Guest Rental</option>
                                <option value="COACHING" style={{ color: 'black' }}>Coaching</option>
                            </select>
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                    {['stock', 'badminton', 'fees'].map(tab => (
                        <button
                            key={tab}
                            className={`btn ${activeTab === tab ? 'btn-primary' : ''}`}
                            style={activeTab !== tab ? { background: 'transparent', capitalize: 'true' } : {}}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)} Report
                        </button>
                    ))}
                </div>

                {/* Data Table */}
                <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
                    <table>
                        <thead>
                            {activeTab === 'stock' && <tr><th>Date</th><th>Type</th><th>Item</th><th>Quantity</th><th>Party</th><th>Location</th></tr>}
                            {activeTab === 'badminton' && <tr><th>Date</th><th>Type</th><th>Quantity</th><th>Sold To / Details</th></tr>}
                            {activeTab === 'fees' && <tr><th>Date</th><th>Player</th><th>Type</th><th>Amount</th><th>Status</th><th>Details</th></tr>}
                        </thead>
                        <tbody>
                            {data.map((d, i) => (
                                <tr key={i}>
                                    {activeTab === 'stock' && <>
                                        <td>{d.movementDate}</td>
                                        <td style={{ color: d.movementType === 'IN' ? 'var(--success)' : 'var(--danger)' }}>{d.movementType}</td>
                                        <td>{d.storageStock?.item?.name}</td>
                                        <td>{d.quantity}</td>
                                        <td>{d.party?.name || '-'}</td>
                                        <td>{d.storageStock?.storageLocation?.name}</td>
                                    </>}
                                    {activeTab === 'badminton' && <>
                                        <td>{d.date}</td>
                                        <td style={{ color: d.type === 'IN' ? 'var(--success)' : 'var(--danger)' }}>{d.type}</td>
                                        <td>{d.quantity}</td>
                                        <td>{d.soldTo || '-'}</td>
                                    </>}
                                    {activeTab === 'fees' && <>
                                        <td>{d.paymentDate}</td>
                                        <td>{d.playerName}</td>
                                        <td><span className="badge">{d.feeType || 'BATCH'}</span></td>
                                        <td>{d.amount}</td>
                                        <td>{d.status}</td>
                                        <td style={{ fontSize: '0.85rem', color: '#ccc' }}>
                                            {d.feeType === 'GUEST' ? `${d.durationHours} hrs (Ct ${d.courtNumber})` : `${d.month} ${d.year}`}
                                        </td>
                                    </>}
                                </tr>
                            ))}
                            {data.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No records found for selected period.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reports;
