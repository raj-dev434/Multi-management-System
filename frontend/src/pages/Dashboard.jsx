import { useEffect, useState } from 'react';
import { Package, Activity, DollarSign, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import api from '../api';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalStockItems: 0,
        totalBadmintonItems: 0,
        totalPlayerFeesCollected: 0,
        recentStockMovements: [],
        lowStockItems: [],
        recentFees: []
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/report/dashboard');
                setStats(response.data);
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="layout-container">
            <Navbar />
            <div className="content-wrapper">
                <h1 className="page-header">Dashboard Overview</h1>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    <StatsCard
                        title="Mechanical Stock"
                        value={loading ? "..." : stats.totalStockItems}
                        icon={<Package size={24} />}
                        color="99, 102, 241"
                    />
                    <StatsCard
                        title="Badminton Items"
                        value={loading ? "..." : stats.totalBadmintonItems}
                        icon={<Activity size={24} />}
                        color="34, 197, 94"
                    />
                    <StatsCard
                        title="Fees Collected"
                        value={loading ? "..." : `₹${stats.totalPlayerFeesCollected?.toLocaleString()}`}
                        icon={<DollarSign size={24} />}
                        color="239, 68, 68"
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>

                    {/* Low Stock Alert */}
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#f59e0b' }}>
                            <AlertTriangle size={20} />
                            <h3 style={{ margin: 0 }}>Low Stock Alerts</h3>
                        </div>
                        {loading ? <p>Loading...</p> : (
                            <table style={{ width: '100%', fontSize: '0.9rem' }}>
                                <thead><tr><th>Item</th><th>Rack</th><th>Qty</th></tr></thead>
                                <tbody>
                                    {stats.lowStockItems?.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.item?.name}</td>
                                            <td>{item.storageLocation?.name}</td>
                                            <td style={{ color: 'red', fontWeight: 'bold' }}>{item.currentQuantity}</td>
                                        </tr>
                                    ))}
                                    {stats.lowStockItems?.length === 0 && <tr><td colSpan="3" style={{ textAlign: 'center', opacity: 0.5 }}>No items low on stock.</td></tr>}
                                </tbody>
                            </table>
                        )}
                        <button className="btn" style={{ marginTop: '1rem', width: '100%', fontSize: '0.8rem' }} onClick={() => navigate('/stock')}>Manage Stock</button>
                    </div>

                    {/* Top Selling Items (Pie Chart) */}
                    <div className="glass-panel" style={{ padding: '1.5rem', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#8b5cf6' }}>
                            <TrendingUp size={20} />
                            <h3 style={{ margin: 0 }}>Top Selling Items</h3>
                        </div>
                        <div style={{ flex: 1, position: 'relative' }}>
                            {loading ? <p>Loading...</p> : (
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={stats.topSellingItems || []}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="quantity"
                                            nameKey="itemName"
                                        >
                                            {(stats.topSellingItems || []).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'][index % 5]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                            {(!stats.topSellingItems || stats.topSellingItems.length === 0) && !loading && (
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 0.5 }}>
                                    No sales data yet
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#3b82f6' }}>
                            <Clock size={20} />
                            <h3 style={{ margin: 0 }}>Recent Activity</h3>
                        </div>
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {loading ? <p>Loading...</p> : (
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {stats.recentFees?.map(fee => (
                                        <li key={`fee-${fee.id}`} style={{ marginBottom: '0.8rem', paddingBottom: '0.8rem', borderBottom: '1px solid #333', fontSize: '0.9rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: '#22c55e' }}>+ ₹{fee.amount} ({fee.feeType || 'FEE'})</span>
                                                <span style={{ opacity: 0.5, fontSize: '0.8rem' }}>{fee.paymentDate}</span>
                                            </div>
                                            <div style={{ opacity: 0.8 }}>From: {fee.playerName}</div>
                                        </li>
                                    ))}
                                    {stats.recentStockMovements?.map(mov => (
                                        <li key={`mov-${mov.id}`} style={{ marginBottom: '0.8rem', paddingBottom: '0.8rem', borderBottom: '1px solid #333', fontSize: '0.9rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: mov.movementType === 'IN' ? '#22c55e' : '#ef4444' }}>
                                                    {mov.movementType} {mov.quantity} Qty
                                                </span>
                                                <span style={{ opacity: 0.5, fontSize: '0.8rem' }}>{mov.movementDate}</span>
                                            </div>
                                            <div style={{ opacity: 0.8 }}>{mov.storageStock?.item?.name} ({mov.party?.name || 'Adjustment'})</div>
                                        </li>
                                    ))}
                                    {!stats.recentFees?.length && !stats.recentStockMovements?.length && <p style={{ opacity: 0.5, textAlign: 'center' }}>No recent activity.</p>}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <TrendingUp color="var(--accent-color)" />
                        <h2>Quick Actions</h2>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-primary" onClick={() => navigate('/stock')}>+ Add Stock</button>
                        <button className="btn btn-primary" onClick={() => navigate('/badminton')}>+ Collect Fee</button>
                        <button className="btn" onClick={() => navigate('/reports')}>View Reports</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
