import { useState } from 'react'

function App() {
    // User
    const [name, setName] = useState('')
    const [accountType, setAccountType] = useState('')
    const [password, setPassword] = useState('')

    // Conversion
    const [userId, setUserId] = useState('')
    const [file, setFile] = useState(null)
    const [bank, setBank] = useState('')

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

    async function convertPdf(event) {
        event.preventDefault()

        if (!userId || !file) {
            alert('Informe o usuário e selecione um arquivo PDF')
            return
        }

        const formData = new FormData()

        formData.append('userId', userId)
        formData.append('file', file)
        formData.append('bank', bank)

        const response = await fetch('/api/conversions/convert', {
            method: 'POST',
            body: formData
        })

        if (!response.ok) {
            alert('Erro ao converter arquivo')
            return
        }

        const blob = await response.blob()

        const url = window.URL.createObjectURL(blob)

        const link = document.createElement('a')

        link.href = url
        link.download = file.name.replace(/\.pdf$/i, '') + '.ofx'

        document.body.appendChild(link)

        link.click()

        link.remove()
        window.URL.revokeObjectURL(url)

        alert('Arquivo convertido com sucesso')
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


            <hr />


            <h2>Converter PDF para OFX</h2>

            <form onSubmit={convertPdf}>
                <div>
                    <label>ID do usuário</label>
                    <br />

                    <input
                        type="number"
                        value={userId}
                        onChange={(event) => setUserId(event.target.value)}
                    />
                </div>

                <br />

                <div>
                    <label>Arquivo PDF</label>
                    <br />

                    <input
                        type="file"
                        accept=".pdf"
                        onChange={(event) => setFile(event.target.files[0])}
                    />
                </div>

                <div>
                    <label>Banco</label>
                    <br />

                    <input
                        type="text"
                        value={bank}
                        onChange={(event) => setBank(event.target.value)}
                    />
                </div>

                <button type="submit">
                    Converter para OFX
                </button>
            </form>
        </main>
    )
}

export default App