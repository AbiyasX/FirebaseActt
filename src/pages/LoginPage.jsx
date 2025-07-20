import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/config'
import { Link } from 'react-router-dom'
import './create.css'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      onLogin({
        id: result.user.uid,
        email: result.user.email,
        username: result.user.email.split('@')[0]
      })
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email')
      } else if (err.code === 'auth/wrong-password') {
        setError('Wrong password')
      } else {
        setError('Login failed. Try again.')
      }
    }
    setLoading(false)
  }

  return (
    <div className="create">
      <h2 className="page-title">Login</h2>
      
      {error && (
        <div style={{
          color: 'red',
          background: '#ffe6e6',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <label style={{ textAlign: 'center' }}>
          <span>Email:</span>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
          />
        </label>
        
        <label style={{ textAlign: 'center' }}>
          <span>Password:</span>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Your password"
          />
        </label>

        <button 
          className="btn" 
          disabled={loading}
          style={{
            backgroundColor: '#007bff',
            borderColor: '#007bff',
            margin: '20px auto',
            display: 'block'
          }}
        >
          {loading ? 'Please wait...' : 'Login'}
        </button>
      </form>
    </div>
  )
}