import { useState } from 'react'

function Login({ onLoginSuccess }) {
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(event) {
        event.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    password: password
                })
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(errorText || 'Usuário ou senha inválidos')
            }

            const data = await response.json()
            
            if (onLoginSuccess) {
                onLoginSuccess(data)
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.pageContainer}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Bem-vindo!</h2>
                    <p style={styles.subtitle}>Insira suas credenciais para continuar</p>
                </div>

                {error && <div style={styles.errorBox}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Nome de Usuário</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Digite seu usuário..."
                            required
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            style={styles.input}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading} 
                        style={loading ? { ...styles.button, opacity: 0.7 } : styles.button}
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    )
}

// Estilos direto no JS para não precisar de CSS externo
const styles = {
    pageContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        fontFamily: 'Segoe UI, Roboto, sans-serif',
    },
    card: {
        backgroundColor: '#1e1e2e',
        color: '#cdd6f4',
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '380px',
        border: '1px solid #313244',
    },
    header: {
        textAlign: 'center',
        marginBottom: '1.8rem',
    },
    title: {
        margin: 0,
        fontSize: '1.8rem',
        color: '#89b4fa',
        fontWeight: '600',
    },
    subtitle: {
        margin: '0.4rem 0 0 0',
        fontSize: '0.9rem',
        color: '#a6adc8',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        textAlign: 'left',
    },
    label: {
        fontSize: '0.85rem',
        fontWeight: '500',
        color: '#bac2de',
    },
    input: {
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        border: '1px solid #45475a',
        backgroundColor: '#313244',
        color: '#f5e0dc',
        fontSize: '0.95rem',
        outline: 'none',
        transition: 'border-color 0.2s',
    },
    button: {
        padding: '0.8rem',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#89b4fa',
        color: '#11111b',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '0.5rem',
        transition: 'background-color 0.2s',
    },
    errorBox: {
        backgroundColor: 'rgba(243, 139, 168, 0.15)',
        color: '#f38ba8',
        border: '1px solid #f38ba8',
        padding: '0.6rem',
        borderRadius: '8px',
        marginBottom: '1.2rem',
        textAlign: 'center',
        fontSize: '0.85rem',
    }
}

export default Login