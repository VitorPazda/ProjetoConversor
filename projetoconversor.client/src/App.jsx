import { useRef, useState } from "react"
import Login from "./components/Login"
import "./App.css"

function App() {
    const [user, setUser] = useState(null)
    const [file, setFile] = useState(null)
    const [bank, setBank] = useState('')
    const [isDragging, setIsDragging] = useState(false)
    const [status, setStatus] = useState({ type: '', message: '' })
    const [loading, setLoading] = useState(false)
    const inputRef = useRef(null)

    function selectFile(selectedFile) {
        if (!selectedFile) return
        if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
            setFile(null)
            setStatus({ type: 'error', message: 'Selecione um arquivo PDF válido.' })
            return
        }
        if (selectedFile.size > 10 * 1024 * 1024) {
            setFile(null)
            setStatus({ type: 'error', message: 'O arquivo precisa ter no máximo 10 MB.' })
            return
        }
        setFile(selectedFile)
        setStatus({ type: '', message: '' })
    }

    function formatFileSize(bytes) {
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }

    function getFileName(response) {
        const contentDisposition = response.headers.get('Content-Disposition') || ''
        const utfName = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i)
        const regularName = contentDisposition.match(/filename="?([^";]+)"?/i)
        return decodeURIComponent(utfName?.[1] || regularName?.[1] || 'extrato-convertido.ofx')
    }

    async function convertPdf(event) {
        event.preventDefault()
        if (!file) {
            setStatus({ type: 'error', message: 'Escolha um arquivo PDF antes de continuar.' })
            return
        }
        if (!user.id && !user.userId && !user.Id && !user.UserId) {
            setStatus({ type: 'error', message: 'Não foi possível identificar sua conta. O login precisa retornar o ID do usuário.' })
            return
        }

        setLoading(true)
        setStatus({ type: 'loading', message: 'Convertendo seu extrato...' })
        try {
            const formData = new FormData()
            formData.append('userId', String(user.id ?? user.userId ?? user.Id ?? user.UserId))
            formData.append('file', file)
            formData.append('bank', bank)
            const response = await fetch('/api/conversions/convert', { method: 'POST', body: formData })
            if (!response.ok) {
                const message = await response.text()
                throw new Error(message || 'Não foi possível converter o arquivo.')
            }

            const url = window.URL.createObjectURL(await response.blob())
            const link = document.createElement('a')
            link.href = url
            link.download = getFileName(response)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
            setStatus({ type: 'success', message: 'Conversão concluída. O download começou.' })
        } catch (error) {
            setStatus({ type: 'error', message: error.message || 'Ocorreu um erro ao converter o arquivo.' })
        } finally {
            setLoading(false)
        }
    }

    if (!user) return <Login onLoginSuccess={(userData) => setUser(userData)} />

    return (
        <div className="app-shell">
            <header className="topbar">
                <a className="brand" href="/" onClick={(event) => event.preventDefault()}>
                    <span className="brand-mark">O</span>
                    <span>ofx<span>fácil</span></span>
                </a>
                <div className="account-menu">
                    <div className="avatar">{user.name?.charAt(0).toUpperCase() || 'U'}</div>
                    <div className="account-copy"><strong>{user.name || 'Usuário'}</strong><small>{user.accountType || 'Conta pessoal'}</small></div>
                    <button className="logout-button" onClick={() => setUser(null)}>Sair</button>
                </div>
            </header>

            <main className="dashboard">
                <section className="intro">
                    <div>
                        <p className="eyebrow">CONVERSOR DE EXTRATOS</p>
                        <h1>Transforme seu PDF em OFX.</h1>
                        <p className="intro-copy">Envie o extrato da sua conta e baixe um arquivo pronto para importar no seu sistema financeiro.</p>
                    </div>
                    <div className="intro-decoration" aria-hidden="true"><span>PDF</span><i>→</i><b>OFX</b></div>
                </section>

                <form className="converter-grid" onSubmit={convertPdf}>
                    <section className="upload-panel">
                        <div className="section-heading"><div className="step">01</div><div><h2>Escolha seu extrato</h2><p>Somente arquivos PDF de até 10 MB</p></div></div>
                        <div className={`dropzone ${isDragging ? 'is-dragging' : ''} ${file ? 'has-file' : ''}`} onClick={() => inputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setIsDragging(true) }} onDragLeave={() => setIsDragging(false)} onDrop={(event) => { event.preventDefault(); setIsDragging(false); selectFile(event.dataTransfer.files[0]) }}>
                            <input ref={inputRef} type="file" accept="application/pdf,.pdf" hidden onChange={(event) => selectFile(event.target.files[0])} />
                            {file ? <><div className="file-icon">PDF</div><div className="file-details"><strong>{file.name}</strong><span>{formatFileSize(file.size)}</span></div><button type="button" className="remove-file" onClick={(event) => { event.stopPropagation(); setFile(null); inputRef.current.value = '' }}>Remover</button></> : <><div className="upload-icon">↑</div><strong>Arraste seu PDF aqui</strong><span>ou <u>selecione um arquivo</u> no seu computador</span></>}
                        </div>
                    </section>

                    <section className="details-panel">
                        <div className="section-heading"><div className="step">02</div><div><h2>Conte para onde importar</h2><p>Essa informação ajuda a organizar seu arquivo</p></div></div>
                        <label className="field-label" htmlFor="bank">Banco <span>(opcional)</span></label>
                        <input id="bank" className="text-input" value={bank} onChange={(event) => setBank(event.target.value)} placeholder="Ex.: Itaú, Nubank, Bradesco..." />
                        <p className="field-hint">Você poderá selecionar o banco depois, se preferir.</p>
                        <button className="convert-button" type="submit" disabled={loading || !file}>{loading ? <><span className="spinner" /> Convertendo...</> : <>Converter para OFX <span>→</span></>}</button>
                        {status.message && <div className={`status-message ${status.type}`} role="status">{status.message}</div>}
                    </section>
                </form>
                <footer className="trust-line"><span className="lock">●</span> Seus arquivos são usados somente durante a conversão e não ficam armazenados.</footer>
            </main>
        </div>
    )
}

export default App

/*
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
            const error = await response.text()

            console.error(error)
            alert('Erro ao converter arquivo')

            return
        }

        const blob = await response.blob()

        const url = window.URL.createObjectURL(blob)

        const link = document.createElement('a')

        link.href = url

        const contentDisposition = response.headers.get('Content-Disposition')

        let fileName = 'arquivo.ofx'

        if (contentDisposition) {
            const match = contentDisposition.match(/filename=([^;]+)/)

            if (match) {
                fileName = match[1].replace(/"/g, '')
            }
        }

        link.download = fileName

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
*/