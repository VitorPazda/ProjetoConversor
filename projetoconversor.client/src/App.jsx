import { useState } from 'react'

function App() {
    const [name, setName] = useState('')
    const [accountType, setAccountType] = useState('')
    const [password, setPassword] = useState('')

    async function createUser(event) {
        event.preventDefault()

        const user = {
            name: name,
            accountType: accountType,
            password: password
        }

        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })

        if (response.ok) {
            alert('Usuário criado com sucesso')

            setName('')
            setAccountType('')
            setPassword('')
        } else {
            alert('Erro ao criar usuário')
        }
    }

    return (
        <main>
            <h1>Projeto Conversor</h1>

            <h2>Cadastrar usuário</h2>

            <form onSubmit={createUser}>
                <div>
                    <label>Nome</label>
                    <br />

                    <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </div>

                <div>
                    <label>Tipo da conta</label>
                    <br />

                    <input
                        type="text"
                        value={accountType}
                        onChange={(event) => setAccountType(event.target.value)}
                    />
                </div>

                <div>
                    <label>Senha</label>
                    <br />

                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>

                <br />

                <button type="submit">
                    Cadastrar
                </button>
            </form>
        </main>
    )
}

export default App