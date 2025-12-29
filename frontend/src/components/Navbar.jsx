import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Activity, FileText, LogOut } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className="navbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.25rem' }}>
                <Activity color="#6366f1" />
                NDS AND NBA MANGEMENT
            </div>
            <div className="nav-links">
                <Link to="/" className={`nav-link ${isActive('/')}`}>
                    <LayoutDashboard size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} /> Dashboard
                </Link>
                <Link to="/stock" className={`nav-link ${isActive('/stock')}`}>
                    <Package size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} /> Stock
                </Link>
                <Link to="/badminton" className={`nav-link ${isActive('/badminton')}`}>
                    <Activity size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} /> Badminton
                </Link>
                <Link to="/reports" className={`nav-link ${isActive('/reports')}`}>
                    <FileText size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} /> Reports
                </Link>
            </div>
            <button onClick={handleLogout} className="btn" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
                <LogOut size={18} /> Logout
            </button>
        </nav>
    );
};

export default Navbar;
