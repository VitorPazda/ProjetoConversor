import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'

function App() {
    const [user, setUser] = useState(null)

    return (
        <BrowserRouter>
            <Routes>
                {/* Public Route */}
                <Route 
                    path="/login" 
                    element={!user ? <Login onLoginSuccess={(userData) => setUser(userData)} /> : <Navigate to="/dashboard" replace />} 
                />

                {/* Protected Routes inside Layout */}
                <Route 
                    path="/" 
                    element={<Layout user={user} onLogout={() => setUser(null)} />}
                >
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    
                    {/* Admin Route */}
                    <Route 
                        path="users" 
                        element={user?.accountType === 'Administrator' ? <Users /> : <Navigate to="/dashboard" replace />} 
                    />
                </Route>

                {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App