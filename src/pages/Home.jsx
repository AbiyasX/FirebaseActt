import { Link } from 'react-router-dom'
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useEffect, useState } from 'react'
import DeleteIcon from '../assets/delete.svg'
import './Home.css'

export default function Home() {
  const [articles, setArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = () => {
    const articlesRef = collection(db, 'articles')
    
    const unsubscribe = onSnapshot(articlesRef, 
      (snapshot) => {
        const articlesList = []
        snapshot.forEach(doc => {
          articlesList.push({
            id: doc.id,
            ...doc.data()
          })
        })
        setArticles(articlesList)
        setIsLoading(false)
        setError('')
      },
      (error) => {
        console.error('Error fetching articles:', error)
        setError('Failed to load articles')
        setIsLoading(false)
      }
    )

    return unsubscribe
  }

  const removeArticle = async (articleId, articleTitle) => {
    const confirmDelete = window.confirm(`Delete "${articleTitle}"?\n\nThis action cannot be undone.`)
    
    if (confirmDelete) {
      try {
        const articleRef = doc(db, 'articles', articleId)
        await deleteDoc(articleRef)
        console.log('Article removed successfully')
      } catch (error) {
        console.error('Delete error:', error)
        alert('Could not delete article. Please try again.')
      }
    }
  }

  const getPreview = (content) => {
    if (!content) return 'No content available...'
    return content.length > 120 ? content.substring(0, 120) + '...' : content
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return ''
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return date.toLocaleDateString()
    } catch {
      return ''
    }
  }

  if (isLoading) {
    return (
      <div className="home">
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <h3>Loading articles...</h3>
          <p style={{ color: '#666' }}>Please wait while we fetch your content.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="home">
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          color: '#d32f2f',
          background: '#ffebee',
          borderRadius: '8px',
          margin: '20px 0'
        }}>
          <h3>Error</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              background: '#d32f2f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="home">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h2>My Articles ({articles.length})</h2>
        <Link 
          to="/new"
          style={{
            padding: '10px 20px',
            background: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            fontSize: '0.9em'
          }}
        >
          + Add New Article
        </Link>
      </div>
      
      {articles.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px',
          background: '#f8f9fa',
          borderRadius: '8px',
          border: '2px dashed #dee2e6'
        }}>
          <h3 style={{ color: '#6c757d' }}>No Articles Yet</h3>
          <p style={{ color: '#6c757d', marginBottom: '20px' }}>
            Start sharing your thoughts with the world!
          </p>
          <Link 
            to="/new"
            style={{
              padding: '12px 24px',
              background: '#28a745',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              fontWeight: 'bold'
            }}
          >
            Write Your First Article
          </Link>
        </div>
      ) : (
        <div>
          {articles.map(article => (
            <div key={article.id} className="card">
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '10px'
              }}>
                <h3 style={{ margin: '0', flex: '1' }}>{article.title}</h3>
                <img 
                  className="icon"
                  onClick={() => removeArticle(article.id, article.title)}
                  src={DeleteIcon} 
                  alt="delete article"
                  title="Delete this article"
                  style={{ 
                    margin: '0 0 0 10px',
                    cursor: 'pointer',
                    opacity: '0.6'
                  }}
                />
              </div>
              
              <p style={{ 
                margin: '5px 0 10px 0', 
                color: '#666',
                fontSize: '0.9em'
              }}>
                By {article.author} {formatDate(article.createdAt) && `• ${formatDate(article.createdAt)}`}
              </p>
              
              <p style={{ 
                margin: '10px 0 15px 0',
                lineHeight: '1.4',
                color: '#333'
              }}>
                {getPreview(article.description)}
              </p>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Link 
                  to={`/articles/${article.id}`}
                  style={{
                    color: '#007bff',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                >
                  Read Full Article →
                </Link>
                
                <Link 
                  to={`/update/${article.id}`}
                  style={{
                    padding: '6px 12px',
                    background: '#ffc107',
                    color: '#212529',
                    textDecoration: 'none',
                    borderRadius: '3px',
                    fontSize: '0.85em',
                    fontWeight: '500'
                  }}
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}