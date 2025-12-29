import { useState, useEffect } from 'react';
import { Package, MapPin, ArrowRightLeft, Plus, Users, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../api';

const Stocks = () => {
    const [activeTab, setActiveTab] = useState('list');
    const [stocks, setStocks] = useState([]);
    const [items, setItems] = useState([]);
    const [locations, setLocations] = useState([]);
    const [parties, setParties] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [stockSearchQuery, setStockSearchQuery] = useState('');

    // Cart & Batch State
    const [cart, setCart] = useState([]);
    const [batchPartyId, setBatchPartyId] = useState('');
    const [batchType, setBatchType] = useState('IN');

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('');


    // Forms
    const [moveRequest, setMoveRequest] = useState({ itemId: '', storageLocationId: '', quantity: 1, movementDate: '', remarks: '' });
    const [newItem, setNewItem] = useState({ name: '', category: 'General', description: '' });
    const [newLocation, setNewLocation] = useState({ name: '', address: '' });
    const [newParty, setNewParty] = useState({ name: '', type: 'SUPPLIER', location: '', address: '' });

    useEffect(() => {
        if (activeTab === 'list' || modalMode === 'move') {
            fetchStocks();
            fetchMetadata();
        } else if (activeTab === 'search') {
            // Do nothing, wait for search
        } else {
            fetchMetadata();
        }
    }, [activeTab, modalMode]);

    const fetchStocks = async () => {
        try {
            const res = await api.get('/stock/current-all');
            setStocks(res.data);
        } catch (err) { console.error("Stock fetch error", err); }
    };

    const fetchMetadata = async () => {
        try {
            const [itemsRes, locsRes, partiesRes] = await Promise.all([
                api.get('/stock/items'),
                api.get('/stock/locations'),
                api.get('/parties')
            ]);
            setItems(itemsRes.data);
            setLocations(locsRes.data);
            setParties(partiesRes.data);
        } catch (err) { console.error("Metadata error", err); }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const res = await api.get(`/stock/search?partyName=${searchQuery}`);
            setSearchResults(res.data);
        } catch (err) { alert(`Search failed: ${err.response?.data?.message || err.message}`); }
    };

    // --- Batch Logic ---
    const addToCart = () => {
        if (!moveRequest.itemId || !moveRequest.storageLocationId || !moveRequest.quantity) {
            alert("Please fill Item, Rack and Quantity");
            return;
        }
        const item = items.find(i => i.id == moveRequest.itemId);
        const loc = locations.find(l => l.id == moveRequest.storageLocationId);

        setCart([...cart, {
            ...moveRequest,
            itemName: item?.name,
            locationName: loc?.name,
            movementDate: moveRequest.movementDate,
            remarks: moveRequest.remarks
        }]);
        // Reset Item Selection
        setMoveRequest({ ...moveRequest, itemId: '', storageLocationId: '', quantity: 1, remarks: '' });
    };

    const removeFromCart = (index) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    const handleBatchSubmit = async (e) => {
        e.preventDefault();
        if (cart.length === 0) { alert("Cart is empty!"); return; }
        if (!batchPartyId) { alert("Please select a Party"); return; }

        try {
            const payload = cart.map(item => ({
                ...item,
                partyId: batchPartyId,
                movementType: batchType,
                employeeName: 'Admin'
            }));

            await api.post('/stock/batch-move', payload);
            setShowModal(false);
            setCart([]);
            fetchStocks();
            alert('Batch Transaction Successful!');
        } catch (err) { alert(`Batch Failed: ${err.response?.data?.message || err.message}`); }
    };
    // -------------------

    const handleCreateItem = async (e) => {
        e.preventDefault();
        try { await api.post('/stock/items', newItem); setShowModal(false); fetchMetadata(); }
        catch (err) { alert(`Create Item failed: ${err.response?.data?.message || err.message}`); }
    };
    const handleCreateLocation = async (e) => {
        e.preventDefault();
        try { await api.post('/stock/locations', newLocation); setShowModal(false); fetchMetadata(); }
        catch (err) { alert(`Create Rack failed: ${err.response?.data?.message || err.message}`); }
    };
    const handleCreateParty = async (e) => {
        e.preventDefault();
        try { await api.post('/parties', newParty); setShowModal(false); fetchMetadata(); }
        catch (err) { alert(`Create Party failed: ${err.response?.data?.message || err.message}`); }
    };

    const openModal = (mode) => {
        setModalMode(mode);
        // Clear cart when opening stock move
        if (mode === 'move') {
            setCart([]);
            setBatchPartyId('');
        }
        fetchMetadata();
        setShowModal(true);
    };

    const suppliers = parties.filter(p => p.type === 'SUPPLIER');
    const customers = parties.filter(p => p.type === 'CUSTOMER');

    return (
        <div className="layout-container">
            <Navbar />
            <div className="content-wrapper">
                <div className="page-header">
                    <h1>Pump & Injector Stock</h1>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-primary" onClick={() => openModal('move')}>
                            <ArrowRightLeft size={18} /> Stock In/Out
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', overflowX: 'auto' }}>
                    <button className={`btn ${activeTab === 'list' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('list')} style={activeTab !== 'list' ? { background: 'transparent' } : {}}>
                        <Package size={18} /> Current Stock
                    </button>
                    <button className={`btn ${activeTab === 'search' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('search')} style={activeTab !== 'search' ? { background: 'transparent' } : {}}>
                        <Search size={18} /> Search History
                    </button>
                    <button className={`btn ${activeTab === 'items' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('items')} style={activeTab !== 'items' ? { background: 'transparent' } : {}}>
                        <Plus size={18} /> Items
                    </button>
                    <button className={`btn ${activeTab === 'locations' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('locations')} style={activeTab !== 'locations' ? { background: 'transparent' } : {}}>
                        <MapPin size={18} /> Racks
                    </button>
                    <button className={`btn ${activeTab === 'parties' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('parties')} style={activeTab !== 'parties' ? { background: 'transparent' } : {}}>
                        <Users size={18} /> Parties
                    </button>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>

                    {activeTab === 'list' && (
                        <div>
                            <div style={{ marginBottom: '1rem' }}>
                                <input
                                    className="glass-input"
                                    placeholder="Search by Item or Rack..."
                                    value={stockSearchQuery}
                                    onChange={e => setStockSearchQuery(e.target.value)}
                                    style={{ width: '100%', maxWidth: '400px' }}
                                />
                            </div>
                            <table>
                                <thead><tr><th>Item</th><th>Rack/Location</th><th>Quantity</th></tr></thead>
                                <tbody>
                                    {stocks.filter(stock =>
                                        stock.itemName.toLowerCase().includes(stockSearchQuery.toLowerCase()) ||
                                        stock.storageLocationName.toLowerCase().includes(stockSearchQuery.toLowerCase())
                                    ).map((stock, i) => (
                                        <tr key={i}>
                                            <td>{stock.itemName}</td>
                                            <td>{stock.storageLocationName}</td>
                                            <td style={{ fontWeight: 'bold', color: stock.currentQuantity > 0 ? 'var(--success)' : 'var(--danger)' }}>{stock.currentQuantity}</td>
                                        </tr>
                                    ))}
                                    {stocks.filter(stock =>
                                        stock.itemName.toLowerCase().includes(stockSearchQuery.toLowerCase()) ||
                                        stock.storageLocationName.toLowerCase().includes(stockSearchQuery.toLowerCase())
                                    ).length === 0 && <tr><td colSpan="3" style={{ textAlign: 'center' }}>No stock found.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'search' && (
                        <div>
                            <form onSubmit={handleSearch} style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                                <input className="glass-input" placeholder="Enter Customer or Supplier Name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ flex: 1 }} />
                                <button type="submit" className="btn btn-primary">Search</button>
                            </form>
                            <table>
                                <thead><tr><th>Date</th><th>Type</th><th>Item</th><th>Qty</th><th>Party</th><th>Remarks</th></tr></thead>
                                <tbody>
                                    {searchResults.map(m => (
                                        <tr key={m.id}>
                                            <td>{m.movementDate}</td>
                                            <td style={{ color: m.movementType === 'IN' ? 'var(--success)' : 'var(--danger)' }}>{m.movementType}</td>
                                            <td>{m.storageStock?.item?.name}</td>
                                            <td>{m.quantity}</td>
                                            <td>{m.party?.name}</td>
                                            <td style={{ opacity: 0.7, fontSize: '0.9rem' }}>{m.remarks}</td>
                                        </tr>
                                    ))}
                                    {searchResults.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center' }}>No history found.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'parties' && (
                        <div>
                            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                                <button className="btn btn-primary" onClick={() => openModal('newParty')}>+ New Party</button>
                            </div>
                            <table>
                                <thead><tr><th>Name</th><th>Type</th><th>Location</th></tr></thead>
                                <tbody>
                                    {parties.map(p => <tr key={p.id}><td>{p.name}</td><td>{p.type}</td><td>{p.location}</td></tr>)}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Simplified Metadata Views */}
                    {(activeTab === 'items' || activeTab === 'locations') && (
                        <div>
                            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                                <button className="btn btn-primary" onClick={() => openModal(activeTab === 'items' ? 'newItem' : 'newLocation')}>+ New {activeTab === 'items' ? 'Item' : 'Location'}</button>
                            </div>
                            <p>Use the button above to add definitions.</p>
                            {activeTab === 'items' ? (
                                <table><thead><tr><th>Name</th></tr></thead><tbody>{items.map(i => <tr key={i.id}><td>{i.name}</td></tr>)}</tbody></table>
                            ) : (
                                <table><thead><tr><th>Name</th></tr></thead><tbody>{locations.map(l => <tr key={l.id}><td>{l.name}</td></tr>)}</tbody></table>
                            )}
                        </div>
                    )}
                </div>

                {/* Modal */}
                {showModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                    }}>
                        <div className="glass-panel" style={{ padding: '2rem', width: '500px', background: '#0f172a', maxHeight: '90vh', overflowY: 'auto' }}>
                            <h2 style={{ marginTop: 0 }}>
                                {modalMode === 'move' ? 'Stock Movement' : modalMode === 'newItem' ? 'New Item' : modalMode === 'newLocation' ? 'New Rack' : 'New Party'}
                            </h2>

                            {modalMode === 'move' && (
                                <div>
                                    {/* Header: Global Settings */}
                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #333' }}>
                                        <div style={{ flex: 1 }}>
                                            <label>Action</label>
                                            <select className="glass-input" value={batchType} onChange={e => setBatchType(e.target.value)}>
                                                <option value="IN" style={{ color: 'black' }}>STOCK IN (From Supplier)</option>
                                                <option value="OUT" style={{ color: 'black' }}>STOCK OUT (To Customer)</option>
                                            </select>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label>{batchType === 'IN' ? 'Select Supplier' : 'Select Customer'}</label>
                                            <select className="glass-input" value={batchPartyId} onChange={e => setBatchPartyId(e.target.value)}>
                                                <option value="">Select...</option>
                                                {(batchType === 'IN' ? suppliers : customers).map(p => (
                                                    <option key={p.id} value={p.id} style={{ color: 'black' }}>{p.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Add Item Form */}
                                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <div style={{ flex: 2 }}>
                                                <label style={{ fontSize: '0.8rem' }}>Item</label>
                                                <select className="glass-input" value={moveRequest.itemId} onChange={e => setMoveRequest({ ...moveRequest, itemId: e.target.value })}>
                                                    <option value="">Select Item...</option>
                                                    {items.map(i => <option key={i.id} value={i.id} style={{ color: 'black' }}>{i.name}</option>)}
                                                </select>
                                            </div>
                                            <div style={{ flex: 2 }}>
                                                <label style={{ fontSize: '0.8rem' }}>Rack</label>
                                                <select className="glass-input" value={moveRequest.storageLocationId} onChange={e => setMoveRequest({ ...moveRequest, storageLocationId: e.target.value })}>
                                                    <option value="">Select Location...</option>
                                                    {locations.map(l => <option key={l.id} value={l.id} style={{ color: 'black' }}>{l.name}</option>)}
                                                </select>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ fontSize: '0.8rem' }}>Qty</label>
                                                <input type="number" step="0.5" className="glass-input" value={moveRequest.quantity} onChange={e => setMoveRequest({ ...moveRequest, quantity: parseFloat(e.target.value) })} />
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ fontSize: '0.8rem' }}>Date (Optional)</label>
                                                <input type="date" className="glass-input" value={moveRequest.movementDate} onChange={e => setMoveRequest({ ...moveRequest, movementDate: e.target.value })} />
                                            </div>
                                            <div style={{ flex: 2 }}>
                                                <label style={{ fontSize: '0.8rem' }}>Remarks</label>
                                                <input type="text" className="glass-input" placeholder="e.g. Old Stock" value={moveRequest.remarks} onChange={e => setMoveRequest({ ...moveRequest, remarks: e.target.value })} />
                                            </div>
                                        </div>
                                        <button type="button" className="btn btn-primary" onClick={addToCart} style={{ width: '100%' }}>+ Add to List</button>
                                    </div>

                                    {/* Cart List */}
                                    <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '1rem', border: '1px solid #333', borderRadius: '4px' }}>
                                        <table style={{ fontSize: '0.9rem', width: '100%', borderCollapse: 'collapse' }}>
                                            <thead style={{ background: 'rgba(255,255,255,0.1)' }}>
                                                <tr><th style={{ padding: '0.5rem' }}>Item</th><th>Rack</th><th>Qty</th><th></th></tr>
                                            </thead>
                                            <tbody>
                                                {cart.map((c, idx) => (
                                                    <tr key={idx} style={{ borderBottom: '1px solid #333' }}>
                                                        <td style={{ padding: '0.5rem' }}>{c.itemName}</td>
                                                        <td>{c.locationName}</td>
                                                        <td>{c.quantity}</td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            <button onClick={() => removeFromCart(idx)} style={{ color: '#ff6b6b', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {cart.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: '1rem', opacity: 0.5 }}>No items added yet.</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Footer */}
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button type="button" className="btn btn-primary" onClick={handleBatchSubmit} style={{ flex: 1 }}>Confirm Batch Transaction</button>
                                        <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
                                    </div>
                                </div>
                            )}

                            {modalMode === 'newParty' && (
                                <form onSubmit={handleCreateParty}>
                                    <div style={{ marginBottom: '1rem' }}><label>Name</label><input className="glass-input" value={newParty.name} onChange={e => setNewParty({ ...newParty, name: e.target.value })} required /></div>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label>Type</label>
                                        <select className="glass-input" value={newParty.type} onChange={e => setNewParty({ ...newParty, type: e.target.value })}>
                                            <option value="SUPPLIER" style={{ color: 'black' }}>Supplier</option>
                                            <option value="CUSTOMER" style={{ color: 'black' }}>Customer</option>
                                        </select>
                                    </div>
                                    <div style={{ marginBottom: '1rem' }}><label>Location</label><input className="glass-input" value={newParty.location} onChange={e => setNewParty({ ...newParty, location: e.target.value })} /></div>
                                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Party</button>
                                    <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ width: '100%', marginTop: '0.5rem' }}>Cancel</button>
                                </form>
                            )}

                            {modalMode === 'newItem' && (
                                <form onSubmit={handleCreateItem}>
                                    <div style={{ marginBottom: '1rem' }}><label>Name</label><input className="glass-input" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} required /></div>
                                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Item</button>
                                    <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ width: '100%', marginTop: '0.5rem' }}>Cancel</button>
                                </form>
                            )}
                            {modalMode === 'newLocation' && (
                                <form onSubmit={handleCreateLocation}>
                                    <div style={{ marginBottom: '1rem' }}><label>Rack Name</label><input className="glass-input" value={newLocation.name} onChange={e => setNewLocation({ ...newLocation, name: e.target.value })} required /></div>
                                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Rack</button>
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

export default Stocks;
