import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, X } from 'lucide-react';

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({ id: null, name: '', password: '', accountType: 'Usuário' });
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/users');
            if (!response.ok) throw new Error('Falha ao carregar usuários.');
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenForm = (user = null) => {
        if (user) {
            setFormData({ id: user.id, name: user.name, password: '', accountType: user.accountType });
        } else {
            setFormData({ id: null, name: '', password: '', accountType: 'Usuário' });
        }
        setIsFormOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setError('');

        const isEditing = formData.id !== null;
        const url = isEditing ? `/api/users/${formData.id}` : '/api/users';
        const method = isEditing ? 'PUT' : 'POST';

        const payload = {
            name: formData.name,
            accountType: formData.accountType
        };
        
        if (!isEditing || formData.password) {
            payload.password = formData.password;
        } else {
            payload.password = "dummy";
        }

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(isEditing ? { id: formData.id, ...payload } : payload)
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(errText || 'Erro ao salvar usuário.');
            }

            setIsFormOpen(false);
            fetchUsers();
        } catch (err) {
            setError(err.message);
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;

        try {
            const response = await fetch(`/api/users/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Erro ao excluir usuário.');
            fetchUsers();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={styles.title}>Gerenciar Usuários</h1>
                        <p style={styles.subtitle}>Cadastre, edite e remova usuários do sistema.</p>
                    </div>
                    {!isFormOpen && (
                        <button style={styles.primaryButton} onClick={() => handleOpenForm()}>
                            <Plus size={20} /> Novo Usuário
                        </button>
                    )}
                </div>
            </header>
            
            <div style={styles.content}>
                {error && <div style={styles.errorBox}>{error}</div>}

                {isFormOpen ? (
                    <div style={styles.card}>
                        <div style={styles.cardHeader}>
                            <h2>{formData.id ? 'Editar Usuário' : 'Novo Usuário'}</h2>
                            <button style={styles.iconButton} onClick={() => setIsFormOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} style={styles.form}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Nome</label>
                                <input 
                                    type="text" 
                                    value={formData.name} 
                                    onChange={e => setFormData({...formData, name: e.target.value})} 
                                    required 
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Senha {formData.id && '(Opcional)'}</label>
                                <input 
                                    type="password" 
                                    value={formData.password} 
                                    onChange={e => setFormData({...formData, password: e.target.value})} 
                                    required={!formData.id} 
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Tipo de Conta</label>
                                <select 
                                    value={formData.accountType} 
                                    onChange={e => setFormData({...formData, accountType: e.target.value})}
                                    style={styles.select}
                                >
                                    <option value="Usuário">Usuário Comum</option>
                                    <option value="Administrator">Administrador</option>
                                </select>
                            </div>
                            <button type="submit" disabled={formLoading} style={styles.submitButton}>
                                {formLoading ? 'Salvando...' : 'Salvar'}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div style={styles.card}>
                        {loading ? (
                            <p style={{ textAlign: 'center', padding: '2rem' }}>Carregando...</p>
                        ) : (
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>ID</th>
                                        <th style={styles.th}>Nome</th>
                                        <th style={styles.th}>Tipo</th>
                                        <th style={styles.th}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center', padding: '1rem' }}>Nenhum usuário cadastrado.</td>
                                        </tr>
                                    ) : (
                                        users.map(user => (
                                            <tr key={user.id} style={styles.tr}>
                                                <td style={styles.td}>{user.id}</td>
                                                <td style={styles.td}>{user.name}</td>
                                                <td style={styles.td}>
                                                    <span style={user.accountType === 'Administrator' ? styles.badgeAdmin : styles.badgeUser}>
                                                        {user.accountType === 'Administrator' ? 'Administrador' : 'Usuário'}
                                                    </span>
                                                </td>
                                                <td style={styles.td}>
                                                    <div style={styles.actions}>
                                                        <button type="button" style={styles.actionBtn} onClick={() => handleOpenForm(user)} title="Editar">
                                                            <Pencil size={18} />
                                                        </button>
                                                        <button type="button" style={{...styles.actionBtn, color: '#f38ba8'}} onClick={() => handleDelete(user.id)} title="Excluir">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem',
        maxWidth: '900px',
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
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        maxWidth: '500px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    label: {
        fontSize: '0.95rem',
        fontWeight: '500',
        color: 'var(--color-text)',
    },
    input: {
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        border: '1px solid #313244',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        color: 'var(--color-text)',
        fontSize: '0.95rem',
        outline: 'none',
    },
    select: {
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        border: '1px solid #313244',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        color: 'var(--color-text)',
        fontSize: '0.95rem',
        outline: 'none',
    },
    primaryButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.8rem 1.2rem',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: 'var(--color-primary)',
        color: '#ffffff',
        fontSize: '0.95rem',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    submitButton: {
        padding: '0.9rem',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: 'var(--color-primary)',
        color: '#ffffff',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '1rem',
    },
    iconButton: {
        background: 'none',
        border: 'none',
        color: 'var(--color-text-secondary)',
        cursor: 'pointer',
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
    },
    tr: {
        transition: 'background-color 0.2s',
    },
    badgeAdmin: {
        backgroundColor: 'rgba(1, 106, 50, 0.2)',
        color: 'var(--color-primary-light)',
        padding: '0.3rem 0.6rem',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: '600',
    },
    badgeUser: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: 'var(--color-text-secondary)',
        padding: '0.3rem 0.6rem',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: '600',
    },
    actions: {
        display: 'flex',
        gap: '1rem',
    },
    actionBtn: {
        background: 'none',
        border: 'none',
        color: 'var(--color-text-secondary)',
        cursor: 'pointer',
        padding: '0.3rem',
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

export default Users;
