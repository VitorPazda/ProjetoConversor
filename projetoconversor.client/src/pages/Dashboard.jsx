import { useOutletContext } from 'react-router-dom';
import { FileUp } from 'lucide-react';
import ConversionForm from '../components/ConversionForm';

function Dashboard() {
    const [user] = useOutletContext();

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <FileUp size={32} color="var(--color-primary)" />
                    <h1 style={styles.title}>Conversor de PDF para OFX</h1>
                </div>
                <p style={styles.subtitle}>Converta seus extratos bancários em poucos passos.</p>
            </header>
            
            <div style={styles.content}>
                <ConversionForm userId={user?.idUser} />
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem',
        maxWidth: '1200px',
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
    }
};

export default Dashboard;
