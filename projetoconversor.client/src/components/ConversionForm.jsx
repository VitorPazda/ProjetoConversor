import { useState } from 'react';
import { Lightbulb, FileText, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
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

const RECENT_CONVERSIONS = [
    {
        id: 'mock-1',
        fileName: 'Extrato_Sicoob.pdf',
        bank: 'Sicoob',
        dateTime: '06/10 20:29',
        status: 'Sucesso'
    },
    {
        id: 'mock-2',
        fileName: 'Extrato_Itau.pdf',
        bank: 'Itaú',
        dateTime: '04/10 16:44',
        status: 'Sucesso'
    },
    {
        id: 'mock-3',
        fileName: 'Extrato_Agosto.pdf',
        bank: 'Sicoob',
        dateTime: '02/10 09:17',
        status: 'Process.'
    },
    {
        id: 'mock-4',
        fileName: 'Extrato_Julho.pdf',
        bank: 'Itaú',
        dateTime: '29/09 14:20',
        status: 'Erro'
    }
];

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

    const renderStatusBadge = (status) => {
        if (status === 'Sucesso') {
            return (
                <span className="status-badge sucesso">
                    <CheckCircle2 size={13} />
                    {status}
                </span>
            );
        }
        if (status === 'Process.') {
            return (
                <span className="status-badge process">
                    <Clock size={13} />
                    {status}
                </span>
            );
        }
        return (
            <span className="status-badge erro">
                <AlertCircle size={13} />
                {status}
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
                    <h3 className="recent-title">Conversões recentes</h3>
                    <button type="button" className="recent-history-btn">
                        Ver histórico
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
                            </tr>
                        </thead>
                        <tbody>
                            {RECENT_CONVERSIONS.map((item) => (
                                <tr key={item.id} className="recent-tr">
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
                                        <span className="date-text">{item.dateTime}</span>
                                    </td>
                                    <td className="recent-td">
                                        {renderStatusBadge(item.status)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ConversionForm;
