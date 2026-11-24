import { UploadCloud, File, X } from 'lucide-react';
import { useRef, useState } from 'react';

function FileUpload({ file, onFileSelect }) {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const validateAndSelect = (selectedFile) => {
        if (!selectedFile) return;
        if (selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf')) {
            onFileSelect(selectedFile);
        } else {
            alert('Por favor, selecione apenas arquivos PDF.');
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            validateAndSelect(e.target.files[0]);
        }
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragging) setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Evita piscar quando passa por cima dos elementos filhos
        if (e.currentTarget.contains(e.relatedTarget)) return;
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            validateAndSelect(e.dataTransfer.files[0]);
        }
    };

    const handleRemoveFile = (e) => {
        e.stopPropagation();
        onFileSelect(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const containerStyle = {
        ...styles.container,
        ...(isDragging ? styles.containerDragging : {})
    };

    return (
        <div 
            style={containerStyle}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
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
                    <div style={styles.fileIconWrapper}>
                        <File size={36} style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <span style={styles.fileName}>{file.name}</span>
                    <span style={styles.fileSize}>
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                        <span style={styles.changeText}>Clique ou arraste outro PDF para trocar</span>
                        <button 
                            type="button" 
                            onClick={handleRemoveFile}
                            style={styles.removeBtn}
                            title="Remover arquivo"
                        >
                            <X size={14} /> Remover
                        </button>
                    </div>
                </div>
            ) : (
                <div style={styles.uploadPrompt}>
                    <div style={{
                        ...styles.iconCircle,
                        backgroundColor: isDragging ? 'rgba(57, 168, 107, 0.2)' : 'rgba(255, 255, 255, 0.05)'
                    }}>
                        <UploadCloud 
                            size={36} 
                            style={{ 
                                color: isDragging ? 'var(--color-primary-light)' : 'var(--color-text-secondary)',
                                transition: 'color 0.2s'
                            }} 
                        />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <span style={{
                            ...styles.uploadTitle,
                            color: isDragging ? 'var(--color-primary-light)' : 'var(--color-text)'
                        }}>
                            {isDragging ? 'Solte o arquivo PDF aqui' : 'Arraste e solte o extrato PDF aqui'}
                        </span>
                        <p style={styles.uploadSubtitle}>
                            ou <span style={styles.browseLink}>clique para selecionar do computador</span>
                        </p>
                    </div>
                    <span style={styles.fileHint}>Suporta arquivos PDF de até 10MB</span>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        border: '2px dashed #3e4058',
        borderRadius: '14px',
        padding: '2.5rem 1.5rem',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        transition: 'all 0.2s ease-in-out',
        minHeight: '200px',
        userSelect: 'none',
    },
    containerDragging: {
        borderColor: 'var(--color-primary)',
        backgroundColor: 'rgba(57, 168, 107, 0.08)',
        transform: 'scale(1.01)',
    },
    uploadPrompt: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
    },
    iconCircle: {
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '0.25rem',
        transition: 'all 0.2s',
    },
    uploadTitle: {
        fontSize: '1.05rem',
        fontWeight: '600',
        display: 'block',
        marginBottom: '0.25rem',
        transition: 'color 0.2s',
    },
    uploadSubtitle: {
        margin: 0,
        fontSize: '0.9rem',
        color: 'var(--color-text-secondary)',
    },
    browseLink: {
        color: 'var(--color-primary-light)',
        fontWeight: '500',
        textDecoration: 'underline',
    },
    fileHint: {
        fontSize: '0.8rem',
        color: '#6c7086',
        marginTop: '0.25rem',
    },
    fileDisplay: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
    },
    fileIconWrapper: {
        width: '60px',
        height: '60px',
        borderRadius: '12px',
        backgroundColor: 'rgba(57, 168, 107, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '0.25rem',
    },
    fileName: {
        color: 'var(--color-text)',
        fontWeight: '600',
        fontSize: '1.1rem',
        textAlign: 'center',
        wordBreak: 'break-all',
        maxWidth: '400px',
    },
    fileSize: {
        color: 'var(--color-text-secondary)',
        fontSize: '0.85rem',
    },
    changeText: {
        color: 'var(--color-text-secondary)',
        fontSize: '0.85rem',
    },
    removeBtn: {
        background: 'rgba(243, 139, 168, 0.15)',
        border: '1px solid rgba(243, 139, 168, 0.3)',
        color: '#f38ba8',
        borderRadius: '6px',
        padding: '0.25rem 0.6rem',
        fontSize: '0.8rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.3rem',
        transition: 'background 0.2s',
    }
};

export default FileUpload;
