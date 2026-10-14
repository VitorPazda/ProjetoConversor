import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, FileText, CheckCircle2, AlertCircle, Clock, Download, RefreshCw } from 'lucide-react';
import FileUpload from './FileUpload';
import './conversion.css';

const TIPS = [
    {
        id: 1,
        title: 'Use extratos completos em PDF',
        desc: 'Para maior precisão na conversão, utilize o arquivo completo.'
    },
    {
        id: 2,
        title: 'Verifique se o PDF está legível',
        desc: 'O texto deve estar nítido e sem imagens desfocadas.'
    },
    {
        id: 3,
        title: 'Selecione o banco correto',
        desc: 'Escolha o banco correspondente ao seu extrato.'
    },
    {
        id: 4,
        title: 'Fique atento ao formato',
        desc: 'Apenas arquivos em PDF são aceitos (até 10MB).'
    }
];

function ConversionForm({ userId }) {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [bank, setBank] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    // Estado para conversões recentes reais
    const [recentConversions, setRecentConversions] = useState([]);
    const [loadingRecent, setLoadingRecent] = useState(true);

    const fetchRecentConversions = useCallback(async () => {
        if (!userId) {
            setLoadingRecent(false);
            return;
        }

        setLoadingRecent(true);
        try {
            const response = await fetch(`/api/conversions/user/${userId}`);
            if (!response.ok) {
                throw new Error('Falha ao carregar as conversões recentes.');
            }
            const data = await response.json();
            const sorted = Array.isArray(data)
                ? [...data].sort((a, b) => new Date(b.date) - new Date(a.date))
                : [];
            setRecentConversions(sorted.slice(0, 5));
        } catch (err) {
            console.error('Erro ao buscar conversões recentes:', err);
            setRecentConversions([]);
        } finally {
            setLoadingRecent(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchRecentConversions();
    }, [fetchRecentConversions]);

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
                fetchRecentConversions();
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
            fetchRecentConversions();
        } catch (err) {
            setMessage({ text: err.message, type: 'error' });
            fetchRecentConversions();
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (id, date) => {
        const downloadUrl = `/api/conversions/download/${id}`;
        const a = document.createElement('a');
        a.href = downloadUrl;
        const formattedDate = date 
            ? new Date(date).toLocaleDateString('pt-BR').replace(/\//g, '-') 
            : 'extrato';
        a.download = `${formattedDate}.ofx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const hours = String(d.getHours()).padStart(2, '0');
            const minutes = String(d.getMinutes()).padStart(2, '0');
            return `${day}/${month} ${hours}:${minutes}`;
        } catch {
            return dateStr;
        }
    };

    const renderStatusBadge = (status) => {
        const normalized = (status || '').toLowerCase();

        if (normalized === 'success' || normalized === 'sucesso') {
            return (
                <span className="status-badge sucesso">
                    <CheckCircle2 size={13} />
                    Sucesso
                </span>
            );
        }
        if (normalized === 'processing' || normalized === 'processando' || normalized === 'process.') {
            return (
                <span className="status-badge process">
                    <Clock size={13} />
                    Processando
                </span>
            );
        }
        return (
            <span className="status-badge erro">
                <AlertCircle size={13} />
                Falha
            </span>
        );
    };

    return (
        <div className="conversion-layout">
            {/* Top row: formulário (65%) e dicas (35%) */}
            <div className="conversion-top-row">
                <div className="conversion-card">
                    <form onSubmit={handleConvert} className="conversion-form">
                        <div className="conversion-form-section">
                            <label className="conversion-label">1. Arquivo do Extrato (PDF)</label>
                            <FileUpload file={file} onFileSelect={setFile} />
                        </div>

                        <div className="conversion-form-section">
                            <label className="conversion-label">2. Selecione o Banco</label>
                            <select 
                                value={bank} 
                                onChange={(e) => setBank(e.target.value)}
                                className="conversion-select"
                            >
                                <option value="" disabled>Selecione...</option>
                                <option value="Sicoob">Sicoob</option>
                                <option value="Itau">Itaú</option>
                            </select>
                        </div>

                        {message.text && (
                            <div className={`conversion-message-box ${message.type === 'error' ? 'error' : 'success'}`}>
                                {message.text}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="conversion-submit-button"
                        >
                            {loading ? 'Convertendo...' : 'Converter para OFX'}
                        </button>
                    </form>
                </div>

                {/* Painel de Dicas */}
                <div className="conversion-card">
                    <div className="tips-header">
                        <div className="tips-icon-wrap">
                            <Lightbulb size={20} />
                        </div>
                        <h3 className="tips-title">Dicas para melhores resultados</h3>
                    </div>

                    <div className="tips-list">
                        {TIPS.map((tip) => (
                            <div key={tip.id} className="tip-item">
                                <div className="tip-number">{tip.id}</div>
                                <div className="tip-content">
                                    <span className="tip-title">{tip.title}</span>
                                    <span className="tip-desc">{tip.desc}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Painel de Conversões Recentes (100% largura) */}
            <div className="conversion-card">
                <div className="recent-header">
                    <div className="recent-header-left">
                        <h3 className="recent-title">Conversões recentes</h3>
                        <button 
                            type="button" 
                            onClick={fetchRecentConversions} 
                            className="recent-refresh-btn" 
                            title="Atualizar conversões recentes"
                            disabled={loadingRecent}
                        >
                            <RefreshCw size={14} className={loadingRecent ? 'spin-icon' : ''} />
                        </button>
                    </div>
                    <button 
                        type="button" 
                        className="recent-history-btn"
                        onClick={() => navigate('/history')}
                    >
                        Ver histórico completo →
                    </button>
                </div>

                <div className="recent-table-wrapper">
                    <table className="recent-table">
                        <thead>
                            <tr>
                                <th className="recent-th">Arquivo</th>
                                <th className="recent-th">Banco</th>
                                <th className="recent-th">Data/Hora</th>
                                <th className="recent-th">Status</th>
                                <th className="recent-th" style={{ textAlign: 'right' }}>Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingRecent ? (
                                <tr>
                                    <td colSpan="5">
                                        <div className="recent-loading-state">
                                            <Clock size={18} className="spin-icon" />
                                            <span>Carregando conversões recentes...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : recentConversions.length === 0 ? (
                                <tr>
                                    <td colSpan="5">
                                        <div className="recent-empty-state">
                                            <FileText size={32} className="recent-empty-icon" />
                                            <span className="recent-empty-title">Nenhuma conversão recente encontrada</span>
                                            <span className="recent-empty-subtitle">
                                                Faça o upload de um extrato em PDF para iniciar sua primeira conversão.
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                recentConversions.map((item) => {
                                    const isSuccess = (item.status || '').toLowerCase() === 'success' || (item.status || '').toLowerCase() === 'sucesso';
                                    return (
                                        <tr key={item.idConversion} className="recent-tr">
                                            <td className="recent-td">
                                                <div className="file-cell">
                                                    <FileText size={16} color="var(--color-primary-light)" />
                                                    <span>{item.fileName}</span>
                                                </div>
                                            </td>
                                            <td className="recent-td">
                                                <span className="bank-tag">{item.bank}</span>
                                            </td>
                                            <td className="recent-td">
                                                <span className="date-text">{formatDate(item.date)}</span>
                                            </td>
                                            <td className="recent-td">
                                                {renderStatusBadge(item.status)}
                                            </td>
                                            <td className="recent-td" style={{ textAlign: 'right' }}>
                                                {isSuccess && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDownload(item.idConversion, item.date)}
                                                        className="recent-download-btn"
                                                        title="Baixar arquivo OFX"
                                                    >
                                                        <Download size={13} />
                                                        Baixar
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ConversionForm;
