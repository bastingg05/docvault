import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDocuments, deleteDocument } from '../services/documentService';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const docs = await getDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteDocument(documentId);
        setDocuments(documents.filter(doc => (doc._id || doc.id) !== documentId));
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  };

  const handleAddDocument = () => {
    navigate('/add-document');
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        padding: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '15px',
        color: 'white'
      }}>
        <h1>My Documents</h1>
        <button
          onClick={handleAddDocument}
          style={{
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '2px solid rgba(255,255,255,0.3)',
            padding: '12px 24px',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.3)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.2)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          ➕ Add Document
        </button>
      </div>

      {documents.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '15px',
          border: '2px dashed rgba(255,255,255,0.2)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📁</div>
          <h3 style={{ marginBottom: '15px', color: '#666' }}>No Documents Yet</h3>
          <p style={{ color: '#888', marginBottom: '30px' }}>
            Start by adding your first document to get organized
          </p>
          <button
            onClick={handleAddDocument}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Add Your First Document
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {documents.map((doc) => (
            <div
              key={doc._id || doc.id}
              style={{
                background: 'white',
                borderRadius: '15px',
                padding: '20px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                border: '1px solid #eee'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-5px)';
                e.target.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{doc.title}</h3>
                <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>{doc.description}</p>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <span style={{ color: "#666", marginLeft: "5px" }}>{doc.category || 'General'}</span>
                <span style={{ color: "#666", marginLeft: "5px" }}>{new Date(doc.uploadDate || doc.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#888', fontSize: '14px' }}>{doc.size}</span>
                <button
                  onClick={() => handleDelete(doc._id || doc.id)}
                  style={{
                    background: '#ff6b6b',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#ff5252';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#ff6b6b';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Documents; 