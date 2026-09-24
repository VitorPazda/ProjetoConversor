import { useOutletContext } from 'react-router-dom';
import ConversionForm from '../components/ConversionForm';

function Dashboard() {
    const [user] = useOutletContext();

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Conversor de PDF para OFX</h1>
                <p style={styles.subtitle}>Converta seus extratos bancários em poucos passos.</p>
            </header>
            
            <div style={styles.content}>
                <div style={styles.card}>
                    <ConversionForm userId={user?.id} />
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem',
        maxWidth: '700px',
        margin: '0 auto',
        paddingTop: '1rem',
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    title: {
        margin: 0,
        fontSize: '2rem',
        fontWeight: '700',
    },
    subtitle: {
        margin: 0,
        color: 'var(--color-text-secondary)',
        fontSize: '1.1rem',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    card: {
        backgroundColor: 'var(--color-surface)',
        padding: '2.5rem',
        borderRadius: '16px',
        border: '1px solid #313244',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    }
};

export default Dashboard;
