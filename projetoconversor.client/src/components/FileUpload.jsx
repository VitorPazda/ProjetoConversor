import { UploadCloud, File } from 'lucide-react';
import { useRef } from 'react';

function FileUpload({ file, onFileSelect }) {
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const selected = e.target.files[0];
            if (selected.type === 'application/pdf' || selected.name.toLowerCase().endsWith('.pdf')) {
                onFileSelect(selected);
            } else {
                alert("Por favor, selecione apenas arquivos PDF.");
            }
        }
    };

    return (
        <div 
            style={styles.container}
            onClick={() => fileInputRef.current?.click()}
        >
            <input 
                type="file" 
                accept="application/pdf" 
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileChange}
            />
            {file ? (
                <div style={styles.fileDisplay}>
                    <File size={32} style={{ color: 'var(--color-primary-light)' }} />
                    <span style={styles.fileName}>{file.name}</span>
                    <span style={styles.changeText}>Clique para trocar o arquivo</span>
                </div>
            ) : (
                <div style={styles.uploadPrompt}>
                    <UploadCloud size={40} style={{ color: 'var(--color-text-secondary)' }} />
                    <span style={styles.uploadText}>Clique para selecionar um PDF</span>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        border: '2px dashed #313244',
        borderRadius: '12px',
        padding: '2rem',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        transition: 'all 0.2s',
        minHeight: '160px',
    },
    uploadPrompt: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
    },
    uploadText: {
        color: 'var(--color-text-secondary)',
        fontWeight: '500',
    },
    fileDisplay: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.8rem',
    },
    fileName: {
        color: 'var(--color-text)',
        fontWeight: '600',
        fontSize: '1.1rem',
    },
    changeText: {
        color: 'var(--color-primary-light)',
        fontSize: '0.85rem',
        marginTop: '0.5rem',
    }
};

export default FileUpload;
