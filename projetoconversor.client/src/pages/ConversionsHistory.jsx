import React, { useState, useEffect } from 'react';

const ConversionsHistory = ({ user }) => {
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
                throw new Error('Failed to fetch conversions');
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
        // Construct the download URL
        const downloadUrl = `/api/conversions/download/${id}`;
        
        // Trigger download
        const a = document.createElement('a');
        a.href = downloadUrl;
        const formattedDate = new Date(date).toLocaleDateString('pt-BR').replace(/\//g, '-');
        a.download = `${formattedDate}.ofx`; // Optional fallback name
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    if (loading) return <div className="p-4">Carregando histórico...</div>;
    if (error) return <div className="p-4 text-red-500">Erro: {error}</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Meu Histórico de Conversões</h1>
            
            {conversions.length === 0 ? (
                <p>Nenhuma conversão encontrada.</p>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arquivo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Banco</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {conversions.map((conv) => (
                                <tr key={conv.idConversion}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{conv.idConversion}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{conv.fileName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{conv.bank}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(conv.date).toLocaleDateString('pt-BR')} {new Date(conv.date).toLocaleTimeString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${conv.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {conv.status === 'Success' ? 'Sucesso' : 'Falha'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {conv.status === 'Success' && (
                                            <button 
                                                onClick={() => handleDownload(conv.idConversion, conv.date)}
                                                className="text-blue-600 hover:text-blue-900 font-medium"
                                            >
                                                Baixar OFX
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ConversionsHistory;
