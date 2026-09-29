import React, { useState, useEffect } from 'react';
import { Download, Clock, CheckCircle2, XCircle } from 'lucide-react';

function ConversionsHistory({ user }) {
    const [conversions, setConversions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchConversions();
    }, [user]);

    const fetchConversions = async () => {
        try {
            if (!user) return;
            const response = await fetch(`/api/conversions/user/${user.idUser}`);
            if (!response.ok) {
                throw new Error('Falha ao carregar o histórico');
            }
            const data = await response.json();
            setConversions(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (id, date) => {
        const downloadUrl = `/api/conversions/download/${id}`;
        const a = document.createElement('a');
        a.href = downloadUrl;
        const formattedDate = new Date(date).toLocaleDateString('pt-BR').replace(/\//g, '-');
        a.download = `${formattedDate}.ofx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <Clock size={32} color="var(--color-primary)" />
                    <h1 style={styles.title}>Meu Histórico</h1>
                </div>
                <p style={styles.subtitle}>Veja todas as suas conversões passadas e baixe os arquivos OFX.</p>
            </header>

            <div style={styles.content}>
                {error && <div style={styles.errorBox}>{error}</div>}

                <div style={styles.card}>
                    {loading ? (
                        <p style={{ textAlign: 'center', padding: '2rem' }}>Carregando histórico...</p>
                    ) : (
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Data e Hora</th>
                                    <th style={styles.th}>Banco</th>
                                    <th style={styles.th}>Arquivo Original</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={{...styles.th, textAlign: 'right'}}>Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {conversions.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>
                                            Nenhuma conversão encontrada.
                                        </td>
                                    </tr>
                                ) : (
                                    conversions.map(conv => {
                                        const isSuccess = conv.status === 'Success';
                                        return (
                                            <tr key={conv.idConversion} style={styles.tr}>
                                                <td style={styles.td}>
                                                    <div style={styles.dateCell}>
                                                        <span style={styles.dateMain}>{new Date(conv.date).toLocaleDateString('pt-BR')}</span>
                                                        <span style={styles.dateSub}>{new Date(conv.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                </td>
                                                <td style={styles.td}>
                                                    <span style={styles.bankTag}>{conv.bank}</span>
                                                </td>
                                                <td style={styles.td}>
                                                    <span style={styles.fileName}>{conv.fileName}</span>
                                                </td>
                                                <td style={styles.td}>
                                                    <span style={isSuccess ? styles.badgeSuccess : styles.badgeError}>
                                                        {isSuccess ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                                                        {isSuccess ? 'Sucesso' : 'Falha'}
                                                    </span>
                                                </td>
                                                <td style={{...styles.td, textAlign: 'right'}}>
                                                    {isSuccess && (
                                                        <button 
                                                            onClick={() => handleDownload(conv.idConversion, conv.date)}
                                                            style={styles.downloadBtn}
                                                            onMouseOver={(e) => {
                                                                e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                                                                e.currentTarget.style.color = '#ffffff';
                                                            }}
                                                            onMouseOut={(e) => {
                                                                e.currentTarget.style.backgroundColor = 'rgba(1, 106, 50, 0.15)';
                                                                e.currentTarget.style.color = 'var(--color-primary-light)';
                                                            }}
                                                            title="Baixar OFX"
                                                        >
                                                            <Download size={16} /> Baixar
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    )}
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
        maxWidth: '1000px',
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
        color: 'var(--color-text)',
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
        overflowX: 'auto',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        textAlign: 'left',
        padding: '1rem',
        borderBottom: '1px solid #313244',
        color: 'var(--color-text-secondary)',
        fontWeight: '600',
    },
    td: {
        padding: '1rem',
        borderBottom: '1px solid #313244',
        verticalAlign: 'middle',
    },
    tr: {
        transition: 'background-color 0.2s',
    },
    dateCell: {
        display: 'flex',
        flexDirection: 'column',
    },
    dateMain: {
        fontWeight: '500',
        color: 'var(--color-text)',
    },
    dateSub: {
        fontSize: '0.8rem',
        color: 'var(--color-text-secondary)',
    },
    bankTag: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        color: 'var(--color-text-secondary)',
        padding: '0.4rem 0.8rem',
        borderRadius: '6px',
        fontSize: '0.85rem',
        fontWeight: '500',
    },
    fileName: {
        color: 'var(--color-text)',
        fontSize: '0.95rem',
    },
    badgeSuccess: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        backgroundColor: 'rgba(1, 106, 50, 0.2)',
        color: '#4ade80',
        padding: '0.4rem 0.8rem',
        borderRadius: '20px',
        fontSize: '0.85rem',
        fontWeight: '600',
    },
    badgeError: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        backgroundColor: 'rgba(243, 139, 168, 0.15)',
        color: '#f38ba8',
        padding: '0.4rem 0.8rem',
        borderRadius: '20px',
        fontSize: '0.85rem',
        fontWeight: '600',
    },
    downloadBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.6rem 1rem',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: 'rgba(1, 106, 50, 0.15)',
        color: 'var(--color-primary-light)',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    errorBox: {
        backgroundColor: 'rgba(243, 139, 168, 0.15)',
        color: '#f38ba8',
        border: '1px solid #f38ba8',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1rem',
    }
};

export default ConversionsHistory;
