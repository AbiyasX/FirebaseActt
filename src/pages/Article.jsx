import { useNavigate, useParams, Link } from "react-router-dom"
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useEffect, useState } from 'react'

export default function Article() {
  const { urlId } = useParams()
  const navigate = useNavigate()

  const [articleData, setArticleData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    retrieveArticle()
  }, [urlId])

  const retrieveArticle = async () => {
    try {
      setIsLoading(true)
      const docRef = doc(db, 'articles', urlId)
      const docSnapshot = await getDoc(docRef)
      
      if (docSnapshot.exists()) {
        setArticleData({ 
          id: docSnapshot.id, 
          ...docSnapshot.data() 
        })
      } else {
        setErrorMsg('Article not found')
        setTimeout(redirectHome, 3000)
      }
    } catch (error) {
      console.error('Fetch error:', error)
      setErrorMsg('Unable to load article')
    } finally {
      setIsLoading(false)
    }
  }

  const redirectHome = () => {
    navigate('/')
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return null
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return null
    }
  }

  const getWordCount = (text) => {
    if (!text) return 0
    return text.trim().split(/\s+/).length
  }

  const getReadingTime = (text) => {
    const words = getWordCount(text)
    const minutes = Math.ceil(words / 200) // Average reading speed
    return minutes === 1 ? '1 min read' : `${minutes} min read`
  }

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <h3>Loading article...</h3>
        <p style={{ color: '#666' }}>Fetching content for you...</p>
      </div>
    )
  }

  if (errorMsg) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px',
        color: '#d32f2f' 
      }}>
        <h3>Oops!</h3>
        <p>{errorMsg}</p>
        <p style={{ color: '#666' }}>Redirecting to homepage...</p>
        <button 
          onClick={redirectHome}
          style={{
            padding: '8px 16px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Go Home Now
        </button>
      </div>
    )
  }

  if (!articleData) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h3>No Article Found</h3>
        <Link to="/">← Return to Articles</Link>
      </div>
    )
  }

  return (
    <div>
      <nav style={{ 
        marginBottom: '30px',
        padding: '10px 0',
        borderBottom: '1px solid #eee'
      }}>
        <Link 
          to="/"
          style={{
            color: '#007bff',
            textDecoration: 'none',
            fontSize: '0.9em'
          }}
        >
          ← Back to Articles
        </Link>
      </nav>

      <article>
        <header style={{ marginBottom: '30px' }}>
          <h1 style={{ 
            fontSize: '2.5em',
            marginBottom: '15px',
            lineHeight: '1.2',
            color: '#333'
          }}>
            {articleData.title}
          </h1>
          
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            color: '#666',
            fontSize: '0.9em',
            marginBottom: '20px'
          }}>
            <span>By <strong>{articleData.author}</strong></span>
            {formatTimestamp(articleData.createdAt) && (
              <span>• {formatTimestamp(articleData.createdAt)}</span>
            )}
            <span>• {getReadingTime(articleData.description)}</span>
            <span>• {getWordCount(articleData.description)} words</span>
          </div>

          <div style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '30px'
          }}>
            <Link 
              to={`/update/${articleData.id}`}
              style={{
                padding: '8px 16px',
                background: '#28a745',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                fontSize: '0.9em'
              }}
            >
              ✏️ Edit Article
            </Link>
          </div>
        </header>
        
        <div style={{
          borderTop: '3px solid #007bff',
          paddingTop: '30px'
        }}>
          <div style={{ 
            fontSize: '1.1em',
            lineHeight: '1.7',
            color: '#333',
            maxWidth: '100%',
            wordWrap: 'break-word'
          }}>
            {articleData.description?.split('\n').map((paragraph, index) => (
              <p key={index} style={{ marginBottom: '20px' }}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        
        {articleData.updatedAt && (
          <footer style={{ 
            marginTop: '40px',
            paddingTop: '20px',
            borderTop: '1px solid #eee',
            fontSize: '0.85em',
            color: '#999',
            fontStyle: 'italic'
          }}>
            Last updated: {formatTimestamp(articleData.updatedAt)}
          </footer>
        )}
      </article>
      
      <div style={{ 
        marginTop: '50px',
        textAlign: 'center',
        padding: '20px',
        background: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <h4 style={{ marginBottom: '15px', color: '#333' }}>
          Enjoyed this article?
        </h4>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Link 
            to="/"
            style={{
              padding: '10px 20px',
              background: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            Read More Articles
          </Link>
          <Link 
            to="/new"
            style={{
              padding: '10px 20px',
              background: '#28a745',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            Write Your Own
          </Link>
        </div>
      </div>
    </div>
  )
}