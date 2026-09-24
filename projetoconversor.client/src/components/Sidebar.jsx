import { NavLink } from 'react-router-dom';
import { FileUp, Users, LogOut, User } from 'lucide-react';

function Sidebar({ user, onLogout }) {
    return (
        <aside style={styles.sidebar}>
            <div style={styles.header}>
                <div style={styles.logo}>
                    <span style={styles.logoIcon}>OFX</span>
                    <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Conversor</h2>
                </div>
            </div>

            <nav style={styles.nav}>
                <NavLink 
                    to="/dashboard" 
                    style={({ isActive }) => isActive ? { ...styles.link, ...styles.activeLink } : styles.link}
                >
                    <FileUp size={20} />
                    <span>Conversão</span>
                </NavLink>

                {user?.accountType === 'Administrator' && (
                    <NavLink 
                        to="/users" 
                        style={({ isActive }) => isActive ? { ...styles.link, ...styles.activeLink } : styles.link}
                    >
                        <Users size={20} />
                        <span>Usuários</span>
                    </NavLink>
                )}
            </nav>

            <div style={styles.footer}>
                <div style={styles.userInfo}>
                    <User size={20} style={{ color: 'var(--color-primary-light)' }} />
                    <div style={styles.userDetails}>
                        <span style={styles.userName}>{user?.name}</span>
                        <span style={styles.userType}>{user?.accountType}</span>
                    </div>
                </div>
                <button onClick={onLogout} style={styles.logoutBtn} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(243, 139, 168, 0.1)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <LogOut size={20} />
                    <span>Sair</span>
                </button>
            </div>
        </aside>
    );
}

const styles = {
    sidebar: {
        width: '260px',
        backgroundColor: 'var(--color-surface)',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #313244',
        height: '100vh',
    },
    header: {
        padding: '1.5rem',
        borderBottom: '1px solid #313244',
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        color: 'var(--color-primary-light)',
    },
    logoIcon: {
        backgroundColor: 'var(--color-primary)',
        color: '#fff',
        padding: '0.4rem 0.6rem',
        borderRadius: '6px',
        fontWeight: 'bold',
        fontSize: '0.9rem',
    },
    nav: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 1rem',
        gap: '0.5rem',
    },
    link: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.8rem 1rem',
        borderRadius: '8px',
        color: 'var(--color-text-secondary)',
        transition: 'all 0.2s',
        fontWeight: '500',
    },
    activeLink: {
        backgroundColor: 'rgba(1, 106, 50, 0.15)',
        color: 'var(--color-primary-light)',
    },
    footer: {
        padding: '1.5rem 1rem',
        borderTop: '1px solid #313244',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        padding: '0 0.5rem',
    },
    userDetails: {
        display: 'flex',
        flexDirection: 'column',
    },
    userName: {
        fontWeight: '600',
        fontSize: '0.95rem',
        color: 'var(--color-text)',
    },
    userType: {
        fontSize: '0.75rem',
        color: 'var(--color-text-secondary)',
    },
    logoutBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.8rem 1rem',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: 'transparent',
        color: '#f38ba8',
        fontSize: '0.95rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        textAlign: 'left',
    }
};

export default Sidebar;
