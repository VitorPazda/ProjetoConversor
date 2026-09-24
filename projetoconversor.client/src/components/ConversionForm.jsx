import { useState } from 'react';
import FileUpload from './FileUpload';

function ConversionForm({ userId }) {
    const [file, setFile] = useState(null);
    const [bank, setBank] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleConvert = async (e) => {
        e.preventDefault();
        
        if (!file) {
            setMessage({ text: 'Selecione um arquivo PDF.', type: 'error' });
            return;
        }
        if (!bank) {
            setMessage({ text: 'Selecione o banco de origem.', type: 'error' });
            return;
        }

        setLoading(true);
        setMessage({ text: '', type: '' });

        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('bank', bank);
        formData.append('file', file);

        try {
            const response = await fetch('/api/conversions/convert', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Não foi possível converter o arquivo.');
            }

            // Download file
            const blob = await response.blob();
            
            // Extract filename from Content-Disposition if available
            let filename = 'extrato.ofx';
            const disposition = response.headers.get('Content-Disposition');
            if (disposition && disposition.indexOf('filename=') !== -1) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) {
                    filename = matches[1].replace(/['"]/g, '');
                }
            }

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            setMessage({ text: 'Arquivo convertido com sucesso!', type: 'success' });
            setFile(null);
            setBank('');
        } catch (err) {
            setMessage({ text: err.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleConvert} style={styles.form}>
            <div style={styles.section}>
                <label style={styles.label}>1. Arquivo do Extrato (PDF)</label>
                <FileUpload file={file} onFileSelect={setFile} />
            </div>

            <div style={styles.section}>
                <label style={styles.label}>2. Selecione o Banco</label>
                <select 
                    value={bank} 
                    onChange={(e) => setBank(e.target.value)}
                    style={styles.select}
                >
                    <option value="" disabled>Selecione...</option>
                    <option value="Sicoob">Sicoob</option>
                    <option value="Itau">Itaú</option>
                </select>
            </div>

            {message.text && (
                <div style={{
                    ...styles.messageBox, 
                    backgroundColor: message.type === 'error' ? 'rgba(243, 139, 168, 0.15)' : 'rgba(57, 168, 107, 0.15)',
                    color: message.type === 'error' ? '#f38ba8' : 'var(--color-primary-light)',
                    borderColor: message.type === 'error' ? '#f38ba8' : 'var(--color-primary-light)'
                }}>
                    {message.text}
                </div>
            )}

            <button 
                type="submit" 
                disabled={loading} 
                style={loading ? { ...styles.button, opacity: 0.7 } : styles.button}
            >
                {loading ? 'Convertendo...' : 'Converter para OFX'}
            </button>
        </form>
    );
}

const styles = {
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
    },
    section: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
    },
    label: {
        fontSize: '1rem',
        fontWeight: '600',
        color: 'var(--color-text)',
    },
    select: {
        padding: '0.9rem 1rem',
        borderRadius: '8px',
        border: '1px solid #313244',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        color: 'var(--color-text)',
        fontSize: '0.95rem',
        outline: 'none',
        transition: 'border-color 0.2s',
        cursor: 'pointer',
    },
    button: {
        padding: '1rem',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: 'var(--color-primary)',
        color: '#ffffff',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        marginTop: '1rem',
    },
    messageBox: {
        padding: '1rem',
        borderRadius: '8px',
        border: '1px solid',
        textAlign: 'center',
        fontSize: '0.95rem',
        fontWeight: '500',
    }
};

export default ConversionForm;
