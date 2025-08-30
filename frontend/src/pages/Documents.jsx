import React, { useState, useEffect } from "react";
import { getDocuments, deleteDocument } from "../services/documentService";
import { useNavigate } from "react-router-dom";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const data = await getDocuments();
      setDocuments(data);
      setError("");
    } catch (err) {
      console.error("Fetch documents error:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await deleteDocument(documentId);
        setDocuments(documents.filter(doc => doc._id !== documentId));
      } catch (err) {
        console.error("Delete document error:", err);
        setError(err.response?.data?.message || err.message || "Failed to delete document");
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No expiry date";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "20px" }}>Loading documents...</div>;
  }

  return (
    <div style={{ 
      maxWidth: "1200px", 
      margin: "0 auto", 
      padding: "20px",
      minHeight: "80vh"
    }}>
      <div style={{ 
        display: "flex", 
        flexDirection: window.innerWidth <= 768 ? "column" : "row",
        justifyContent: "space-between", 
        alignItems: window.innerWidth <= 768 ? "stretch" : "center", 
        marginBottom: "30px",
        gap: "15px"
      }}>
        <h2 style={{
          margin: "0",
          color: "#333",
          fontSize: "28px"
        }}>My Documents</h2>
        <button 
          onClick={() => navigate("/add-document")}
          style={{ 
            padding: "12px 24px", 
            backgroundColor: "#28a745", 
            color: "white", 
            border: "none", 
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold"
          }}
        >
          Add New Document
        </button>
      </div>

      {error && <p style={{ 
        color: "red", 
        textAlign: "center",
        padding: "10px",
        background: "#ffe6e6",
        borderRadius: "5px",
        margin: "0 0 20px 0"
      }}>{error}</p>}

      {documents.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "60px 20px",
          background: "white",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
        }}>
          <p style={{
            fontSize: "18px",
            color: "#666",
            margin: "0 0 20px 0"
          }}>No documents found. Add your first document!</p>
          <button 
            onClick={() => navigate("/add-document")}
            style={{ 
              padding: "12px 24px", 
              backgroundColor: "#007bff", 
              color: "white", 
              border: "none", 
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold"
            }}
          >
            Add Document
          </button>
        </div>
      ) : (
        <div style={{ 
          display: "grid", 
          gap: "20px",
          gridTemplateColumns: window.innerWidth <= 768 ? "1fr" : "repeat(auto-fill, minmax(350px, 1fr))"
        }}>
          {documents.map((doc) => (
            <div 
              key={doc._id || doc.id} 
              style={{ 
                border: "1px solid #ddd", 
                borderRadius: "10px", 
                padding: "20px",
                backgroundColor: "white",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s ease"
              }}
              onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
            >
              <div style={{ 
                display: "flex", 
                flexDirection: window.innerWidth <= 768 ? "column" : "row",
                justifyContent: "space-between", 
                alignItems: window.innerWidth <= 768 ? "stretch" : "flex-start",
                gap: "15px"
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    margin: "0 0 15px 0",
                    color: "#333",
                    fontSize: "20px"
                  }}>{doc.title}</h3>
                  <div style={{ marginBottom: "8px" }}>
                    <span style={{ fontWeight: "bold", color: "#333" }}>Category:</span>
                    <span style={{ color: "#666", marginLeft: "5px" }}>{doc.category || 'General'}</span>
                  </div>
                  <div style={{ marginBottom: "8px" }}>
                    <span style={{ fontWeight: "bold", color: "#333" }}>Expiry Date:</span>
                    <span style={{ color: "#666", marginLeft: "5px" }}>{formatDate(doc.expiryDate)}</span>
                  </div>
                  <div style={{ marginBottom: "15px" }}>
                    <span style={{ fontWeight: "bold", color: "#333" }}>Added:</span>
                    <span style={{ color: "#666", marginLeft: "5px" }}>{new Date(doc.uploadDate || doc.createdAt).toLocaleDateString()}</span>
                  </div>
                  {doc.fileUrl && (
                    <a 
                      href={doc.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        color: "#007bff", 
                        textDecoration: "none",
                        display: "inline-block",
                        padding: "8px 16px",
                        border: "1px solid #007bff",
                        borderRadius: "5px",
                        fontSize: "14px",
                        fontWeight: "bold"
                      }}
                    >
                      View Document →
                    </a>
                  )}
                </div>
                <button 
                  onClick={() => handleDelete(doc._id || doc.id)}
                  style={{ 
                    padding: "8px 16px", 
                    backgroundColor: "#dc3545", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "bold",
                    alignSelf: window.innerWidth <= 768 ? "stretch" : "flex-start"
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
}

export default Documents; 