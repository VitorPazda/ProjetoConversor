import React, { useState, useEffect, useMemo } from 'react';
import { 
    Clock, 
    CheckCircle2, 
    XCircle, 
    AlertCircle, 
    Download, 
    FileText, 
    Layers, 
    Search, 
    ChevronLeft, 
    ChevronRight,
    Calendar,
    Building2,
    Filter
} from 'lucide-react';
import './history.css';

function ConversionsHistory({ user }) {
    // ESTADOS REAIS EXISTENTES (PRESERVADOS INTEGRALMENTE)
    const [conversions, setConversions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // ESTADOS LOCAIS PARA FILTROS E PAGINAÇÃO (VISUAIS / CLIENT-SIDE SEM QUEBRAR O BACKEND ATUAL)
    const [selectedPeriod, setSelectedPeriod] = useState('all');
    const [selectedBank, setSelectedBank] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchConversions();
    }, [user]);

    // LÓGICA DE BUSCA DO BACKEND EXISTENTE (PRESERVADA INTEGRALMENTE)
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

    // LÓGICA DE DOWNLOAD EXISTENTE (PRESERVADA INTEGRALMENTE)
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

    // -------------------------------------------------------------------------
    // CARDS DE RESUMO (MÉTRICAS)
    // -------------------------------------------------------------------------
    // TODO: integrar total de conversões com dados reais do backend (ex: endpoint /api/conversions/stats ou agregação direta do banco)
    const stats = useMemo(() => {
        // Se houver dados reais carregados, calcula as métricas dinamicamente com fallback mockado caso esteja vazio
        const hasRealData = conversions && conversions.length > 0;
        const total = hasRealData ? conversions.length : 24;
        const success = hasRealData ? conversions.filter(c => c.status === 'Success').length : 20;
        const errors = hasRealData ? conversions.filter(c => c.status === 'Error' || c.status === 'Falha').length : 3;
        // TODO: usar dados reais de status retornados pelo backend (ex: status 'Processing')
        const processing = hasRealData ? conversions.filter(c => c.status === 'Processing' || c.status === 'Processando').length : 1;

        return { total, success, errors, processing };
    }, [conversions]);

    // -------------------------------------------------------------------------
    // FILTROS (CLIENT-SIDE COM HOOKS PARA INTEGRAÇÃO FUTURA COM O BACKEND)
    // -------------------------------------------------------------------------
    // TODO: conectar filtro de banco ao endpoint/listagem real
    // TODO: conectar busca por arquivo com consulta real
    // TODO: conectar filtro de período e status via query params na rota /api/conversions/user/...
    const filteredConversions = useMemo(() => {
        return conversions.filter(item => {
            // Filtro de Banco
            if (selectedBank !== 'all' && item.bank?.toLowerCase() !== selectedBank.toLowerCase()) {
                return false;
            }

            // Filtro de Status
            if (selectedStatus !== 'all') {
                const statusNormalized = item.status?.toLowerCase();
                if (selectedStatus === 'Success' && statusNormalized !== 'success' && statusNormalized !== 'sucesso') return false;
                if (selectedStatus === 'Error' && statusNormalized !== 'error' && statusNormalized !== 'falha') return false;
                if (selectedStatus === 'Processing' && statusNormalized !== 'processing' && statusNormalized !== 'processando') return false;
            }

            // Filtro de Busca por Arquivo
            if (searchTerm.trim() !== '') {
                const term = searchTerm.toLowerCase();
                const fileName = (item.fileName || '').toLowerCase();
                if (!fileName.includes(term)) return false;
            }

            // Filtro de Período (Visual por enquanto)
            // TODO: integrar filtro de período com query params do backend (ex: startDate e endDate)

            return true;
        });
    }, [conversions, selectedBank, selectedStatus, searchTerm]);

    // -------------------------------------------------------------------------
    // PAGINAÇÃO
    // -------------------------------------------------------------------------
    // TODO: implementar paginação real com resposta da API (ex: page, pageSize, totalPages vindos do backend)
    const totalPages = Math.ceil(filteredConversions.length / itemsPerPage) || 1;
    const paginatedConversions = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredConversions.slice(start, start + itemsPerPage);
    }, [filteredConversions, currentPage]);

    const renderStatusBadge = (status) => {
        const isSuccess = status === 'Success' || status === 'Sucesso';
        const isProcessing = status === 'Processing' || status === 'Processando';

        if (isSuccess) {
            return (
                <span className="history-status-badge sucesso">
                    <CheckCircle2 size={14} />
                    Sucesso
                </span>
            );
        }

        if (isProcessing) {
            return (
                <span className="history-status-badge processando">
                    <AlertCircle size={14} />
                    Processando
                </span>
            );
        }

        return (
            <span className="history-status-badge erro">
                <XCircle size={14} />
                Falha
            </span>
        );
    };

    return (
        <div className="history-container">
            {/* 1. Cabeçalho */}
            <header className="history-header">
                <div className="history-header-title-row">
                    <Clock size={32} color="var(--color-primary)" />
                    <h1 className="history-title">Meu Histórico</h1>
                </div>
                <p className="history-subtitle">Veja todas as suas conversões passadas e baixe os arquivos OFX.</p>
            </header>

            {/* Mensagem de Erro (se houver) */}
            {error && <div className="history-error-box">{error}</div>}

            {/* 2. Cards de Resumo */}
            {/* TODO: integrar total de conversões com dados reais do backend */}
            <div className="history-stats-grid">
                <div className="history-stat-card">
                    <div className="stat-info">
                        <span className="stat-label">Total</span>
                        <span className="stat-value">{stats.total}</span>
                    </div>
                    <div className="stat-icon-wrapper stat-icon-total">
                        <Layers size={22} />
                    </div>
                </div>

                <div className="history-stat-card">
                    <div className="stat-info">
                        <span className="stat-label">Sucessos</span>
                        <span className="stat-value">{stats.success}</span>
                    </div>
                    <div className="stat-icon-wrapper stat-icon-success">
                        <CheckCircle2 size={22} />
                    </div>
                </div>

                <div className="history-stat-card">
                    <div className="stat-info">
                        <span className="stat-label">Erros</span>
                        <span className="stat-value">{stats.errors}</span>
                    </div>
                    <div className="stat-icon-wrapper stat-icon-error">
                        <XCircle size={22} />
                    </div>
                </div>

                <div className="history-stat-card">
                    <div className="stat-info">
                        <span className="stat-label">Processando</span>
                        <span className="stat-value">{stats.processing}</span>
                    </div>
                    <div className="stat-icon-wrapper stat-icon-processing">
                        <AlertCircle size={22} />
                    </div>
                </div>
            </div>

            {/* 3. Área de Filtros */}
            <div className="history-filters-card">
                <div className="history-filters-grid">
                    {/* Filtro Período */}
                    {/* TODO: conectar filtro de período ao backend com parâmetros de data */}
                    <div className="filter-group">
                        <label className="filter-label">
                            <Calendar size={14} /> Período
                        </label>
                        <select 
                            value={selectedPeriod} 
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">Todos os períodos</option>
                            <option value="oct-2026">Outubro 2026</option>
                            <option value="sep-2026">Setembro 2026</option>
                            <option value="aug-2026">Agosto 2026</option>
                        </select>
                    </div>

                    {/* Filtro Banco */}
                    {/* TODO: conectar filtro de banco ao endpoint/listagem real */}
                    <div className="filter-group">
                        <label className="filter-label">
                            <Building2 size={14} /> Banco
                        </label>
                        <select 
                            value={selectedBank} 
                            onChange={(e) => {
                                setSelectedBank(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="filter-select"
                        >
                            <option value="all">Todos os bancos</option>
                            <option value="Sicoob">Sicoob</option>
                            <option value="Itau">Itaú</option>
                            <option value="Bradesco">Bradesco</option>
                            <option value="Santander">Santander</option>
                        </select>
                    </div>

                    {/* Filtro Status */}
                    {/* TODO: usar dados reais de status retornados pelo backend para filtrar */}
                    <div className="filter-group">
                        <label className="filter-label">
                            <Filter size={14} /> Status
                        </label>
                        <select 
                            value={selectedStatus} 
                            onChange={(e) => {
                                setSelectedStatus(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="filter-select"
                        >
                            <option value="all">Todos os status</option>
                            <option value="Success">Sucesso</option>
                            <option value="Error">Erro / Falha</option>
                            <option value="Processing">Processando</option>
                        </select>
                    </div>

                    {/* Busca por Arquivo */}
                    {/* TODO: conectar busca por arquivo com consulta real */}
                    <div className="filter-group">
                        <label className="filter-label">
                            <Search size={14} /> Busca
                        </label>
                        <div className="filter-search-wrapper">
                            <Search size={16} className="filter-search-icon" />
                            <input 
                                type="text"
                                placeholder="Buscar por arquivo..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="filter-input filter-search-input"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Tabela Principal */}
            <div className="history-table-card">
                {loading ? (
                    <div className="history-loading-box">
                        <Clock size={28} color="var(--color-primary-light)" />
                        <p>Carregando histórico...</p>
                    </div>
                ) : (
                    <>
                        <div className="history-table-wrapper">
                            <table className="history-table">
                                <thead>
                                    <tr>
                                        <th className="history-th">Data/Hora</th>
                                        <th className="history-th">Banco</th>
                                        <th className="history-th">Arquivo Original</th>
                                        <th className="history-th">Status</th>
                                        <th className="history-th" style={{ textAlign: 'right' }}>Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedConversions.length === 0 ? (
                                        <tr>
                                            <td colSpan="5">
                                                <div className="history-empty-box">
                                                    <FileText size={32} />
                                                    <p>Nenhuma conversão encontrada.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedConversions.map(conv => {
                                            const isSuccess = conv.status === 'Success' || conv.status === 'Sucesso';
                                            return (
                                                <tr key={conv.idConversion} className="history-tr">
                                                    <td className="history-td">
                                                        <div className="history-date-cell">
                                                            <span className="history-date-main">
                                                                {new Date(conv.date).toLocaleDateString('pt-BR')}
                                                            </span>
                                                            <span className="history-date-sub">
                                                                {new Date(conv.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="history-td">
                                                        <span className="history-bank-tag">{conv.bank}</span>
                                                    </td>
                                                    <td className="history-td">
                                                        <div className="history-file-cell">
                                                            <FileText size={16} color="var(--color-primary-light)" />
                                                            <span className="history-file-name">{conv.fileName}</span>
                                                        </div>
                                                    </td>
                                                    <td className="history-td">
                                                        {renderStatusBadge(conv.status)}
                                                    </td>
                                                    <td className="history-td" style={{ textAlign: 'right' }}>
                                                        {isSuccess && (
                                                            <button 
                                                                onClick={() => handleDownload(conv.idConversion, conv.date)}
                                                                className="history-download-btn"
                                                                title="Baixar OFX"
                                                            >
                                                                <Download size={15} /> Baixar
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

                        {/* 5. Paginação */}
                        {/* TODO: implementar paginação real com resposta da API */}
                        <div className="history-pagination">
                            <span className="pagination-info">
                                Mostrando {filteredConversions.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, filteredConversions.length)} de {filteredConversions.length} conversões
                            </span>
                            <div className="pagination-controls">
                                <button 
                                    className="pagination-btn"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    title="Página Anterior"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                    <button 
                                        key={pageNum}
                                        className={`pagination-btn ${pageNum === currentPage ? 'active' : ''}`}
                                        onClick={() => setCurrentPage(pageNum)}
                                    >
                                        {pageNum}
                                    </button>
                                ))}

                                <button 
                                    className="pagination-btn"
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    title="Próxima Página"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ConversionsHistory;

