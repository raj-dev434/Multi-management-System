import { useState, useEffect } from 'react';
import { Package, Plus, UserCheck, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../api';

const Badminton = () => {
    const [activeTab, setActiveTab] = useState('inventory');
    const [inventory, setInventory] = useState([]);
    const [fees, setFees] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState(''); // 'addItem', 'sellItem', 'addFee'

    // Form States
    const [newItem, setNewItem] = useState({ itemName: '', quantity: 0, details: '' });
    const [sellRequest, setSellRequest] = useState({ stockId: '', quantity: 1, soldTo: '' });
    const [newFee, setNewFee] = useState({
        playerName: '', amount: 0, status: 'PAID',
        paymentDate: new Date().toISOString().split('T')[0],
        month: 'JANUARY', year: 2024,
        feeType: 'BATCH', durationHours: 1, courtNumber: ''
    });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            if (activeTab === 'inventory') {
                const res = await api.get('/badminton/stock');
                setInventory(res.data);
            } else {
                const res = await api.get('/player/fees');
                setFees(res.data);
            }
        } catch (err) { console.error("Fetch error", err); }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            await api.post('/badminton/stock', newItem);
            setShowModal(false);
            setNewItem({ itemName: '', quantity: 0, details: '' });
            fetchData();
        } catch (err) { alert('Failed to add item'); }
    };

    const handleSellStock = async (e) => {
        e.preventDefault();
        try {
            await api.post('/badminton/stock/sell', sellRequest);
            setShowModal(false);
            setSellRequest({ stockId: '', quantity: 1, soldTo: '' });
            fetchData();
            alert('Stock Sold Successfully');
        } catch (err) { alert(`Failed to sell stock: ${err.response?.data?.message || err.message}`); }
    };

    const handleAddFee = async (e) => {
        e.preventDefault();
        try {
            await api.post('/player/fee', newFee);
            setShowModal(false);
            fetchData();
        } catch (err) { alert('Failed to add fee'); }
    };

    const openModal = (mode, item = null) => {
        setModalMode(mode);
        if (mode === 'sellItem' && item) {
            setSellRequest({ ...sellRequest, stockId: item.id });
        }
        setShowModal(true);
    };

    const totalIncome = fees.reduce((sum, fee) => sum + (fee.amount || 0), 0);

    return (
        <div className="layout-container">
            <Navbar />
            <div className="content-wrapper">
                <div className="page-header">
                    <h1>Badminton Management</h1>

                    {activeTab === 'fees' && (
                        <div className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                            <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Total Income:</span>
                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#22c55e' }}>₹{totalIncome.toLocaleString()}</span>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {activeTab === 'inventory' ? (
                            <button className="btn btn-primary" onClick={() => openModal('addItem')}>
                                <Plus size={18} /> Add Stock
                            </button>
                        ) : (
                            <button className="btn btn-primary" onClick={() => openModal('addFee')}>
                                <Plus size={18} /> Collect Fee
                            </button>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                    <button className={`btn ${activeTab === 'inventory' ? 'btn-primary' : ''}`} style={activeTab !== 'inventory' ? { background: 'transparent' } : {}} onClick={() => setActiveTab('inventory')}>
                        <Package size={18} /> Inventory
                    </button>
                    <button className={`btn ${activeTab === 'fees' ? 'btn-primary' : ''}`} style={activeTab !== 'fees' ? { background: 'transparent' } : {}} onClick={() => setActiveTab('fees')}>
                        <UserCheck size={18} /> Rentals & Fees
                    </button>
                </div>

                {/* Content */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    {activeTab === 'inventory' ? (
                        <table>
                            <thead><tr><th>Item Name</th><th>Quantity</th><th>Details</th><th>Action</th></tr></thead>
                            <tbody>
                                {inventory.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.itemName}</td>
                                        <td style={{ color: item.quantity < 5 ? 'red' : 'inherit', fontWeight: 'bold' }}>{item.quantity}</td>
                                        <td>{item.details}</td>
                                        <td>
                                            <button className="btn" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', background: 'rgba(255,255,255,0.1)' }} onClick={() => openModal('sellItem', item)}>
                                                Sell / Out
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {inventory.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center' }}>No items found.</td></tr>}
                            </tbody>
                        </table>
                    ) : (
                        <table>
                            <thead><tr><th>Date</th><th>Player / Guest</th><th>Type</th><th>Details</th><th>Amount</th><th>Status</th></tr></thead>
                            <tbody>
                                {fees.map(fee => (
                                    <tr key={fee.id}>
                                        <td>{fee.paymentDate}</td>
                                        <td>{fee.playerName}</td>
                                        <td>
                                            <span style={{ fontSize: '0.8rem', padding: '2px 6px', borderRadius: '4px', background: fee.feeType === 'GUEST' ? '#eab30833' : '#3b82f633', color: fee.feeType === 'GUEST' ? '#eab308' : '#3b82f6' }}>
                                                {fee.feeType}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '0.9rem', color: '#ccc' }}>
                                            {fee.feeType === 'GUEST' ? `${fee.durationHours} Hrs (Court ${fee.courtNumber || '-'})` : `${fee.month} ${fee.year}`}
                                        </td>
                                        <td style={{ fontWeight: 'bold' }}>₹{fee.amount}</td>
                                        <td><span style={{ color: '#22c55e' }}>{fee.status}</span></td>
                                    </tr>
                                ))}
                                {fees.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center' }}>No fee records found.</td></tr>}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Modals */}
                {showModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                        <div className="glass-panel" style={{ padding: '2rem', width: '450px', background: '#0f172a' }}>
                            <h2 style={{ marginTop: 0 }}>
                                {modalMode === 'addItem' ? 'Add Inventory' : modalMode === 'sellItem' ? 'Sell Stock' : 'Collect Fee'}
                            </h2>

                            {modalMode === 'addItem' && (
                                <form onSubmit={handleAddItem}>
                                    <div style={{ marginBottom: '1rem' }}><label>Item Name</label><input className="glass-input" value={newItem.itemName} onChange={e => setNewItem({ ...newItem, itemName: e.target.value })} required /></div>
                                    <div style={{ marginBottom: '1rem' }}><label>Quantity</label><input type="number" className="glass-input" value={newItem.quantity} onChange={e => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })} required /></div>
                                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save</button>
                                    <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ width: '100%', marginTop: '0.5rem' }}>Cancel</button>
                                </form>
                            )}

                            {modalMode === 'sellItem' && (
                                <form onSubmit={handleSellStock}>
                                    <div style={{ marginBottom: '1rem' }}><label>Quantity to Sell</label><input type="number" className="glass-input" value={sellRequest.quantity} onChange={e => setSellRequest({ ...sellRequest, quantity: parseInt(e.target.value) })} required /></div>
                                    <div style={{ marginBottom: '1rem' }}><label>Sold To (Player/Batch Name)</label><input className="glass-input" value={sellRequest.soldTo} onChange={e => setSellRequest({ ...sellRequest, soldTo: e.target.value })} required placeholder="e.g., Morning Batch" /></div>
                                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Confirm Sale</button>
                                    <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ width: '100%', marginTop: '0.5rem' }}>Cancel</button>
                                </form>
                            )}

                            {modalMode === 'addFee' && (
                                <form onSubmit={handleAddFee}>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label>Fee Type</label>
                                        <select className="glass-input" value={newFee.feeType} onChange={e => setNewFee({ ...newFee, feeType: e.target.value })}>
                                            <option value="BATCH" style={{ color: 'black' }}>Monthly Batch Fee</option>
                                            <option value="GUEST" style={{ color: 'black' }}>Guest Court Rental</option>
                                            <option value="COACHING" style={{ color: 'black' }}>Coaching Fee</option>
                                        </select>
                                    </div>

                                    <div style={{ marginBottom: '1rem' }}><label>Player / Guest Name</label><input className="glass-input" value={newFee.playerName} onChange={e => setNewFee({ ...newFee, playerName: e.target.value })} required /></div>

                                    {newFee.feeType === 'GUEST' ? (
                                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                            <div style={{ flex: 1 }}><label>Duration (Hrs)</label><input type="number" step="0.5" className="glass-input" value={newFee.durationHours} onChange={e => setNewFee({ ...newFee, durationHours: parseFloat(e.target.value) })} /></div>
                                            <div style={{ flex: 1 }}><label>Court No</label><input className="glass-input" value={newFee.courtNumber} onChange={e => setNewFee({ ...newFee, courtNumber: e.target.value })} placeholder="e.g. 1" /></div>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                            <div style={{ flex: 1 }}>
                                                <label>Month</label>
                                                <select className="glass-input" value={newFee.month} onChange={e => setNewFee({ ...newFee, month: e.target.value })}>
                                                    {['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL'].map(m => <option key={m} value={m} style={{ color: 'black' }}>{m}</option>)}
                                                </select>
                                            </div>
                                            <div style={{ flex: 1 }}><label>Year</label><input type="number" className="glass-input" value={newFee.year} onChange={e => setNewFee({ ...newFee, year: parseInt(e.target.value) })} /></div>
                                        </div>
                                    )}

                                    <div style={{ marginBottom: '1rem' }}><label>Amount (₹)</label><input type="number" className="glass-input" value={newFee.amount} onChange={e => setNewFee({ ...newFee, amount: parseFloat(e.target.value) })} required /></div>
                                    <div style={{ marginBottom: '1rem' }}><label>Date</label><input type="date" className="glass-input" value={newFee.paymentDate} onChange={e => setNewFee({ ...newFee, paymentDate: e.target.value })} required /></div>

                                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Collect Payment</button>
                                    <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ width: '100%', marginTop: '0.5rem' }}>Cancel</button>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Badminton;
