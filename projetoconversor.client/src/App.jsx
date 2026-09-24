import { useState } from 'react'
import Login from './components/Login'

function App() {
    const [user, setUser] = useState(null)

    // Se o usuário ainda não estiver logado, exibe o Login
    if (!user) {
        return <Login onLoginSuccess={(userData) => setUser(userData)} />
    }

    // Se estiver logado, mostra o conteúdo principal do sistema
    return (
        <main>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
                <h2>Olá, {user.name}! ({user.accountType})</h2>
                <button onClick={() => setUser(null)}>Sair</button>
            </div>

            <hr />

            {/* Aqui entra suas telas do conversor PDF/OFX */}
        </main>
    )
}

export default App