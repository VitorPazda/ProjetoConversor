import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';

function Layout({ user, onLogout }) {
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div style={styles.container}>
            <Sidebar user={user} onLogout={onLogout} />
            <main style={styles.main}>
                <Outlet context={[user]} />
            </main>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
    },
    main: {
        flex: 1,
        overflowY: 'auto',
        padding: '2rem',
        backgroundColor: 'var(--color-background)',
    }
};

export default Layout;
