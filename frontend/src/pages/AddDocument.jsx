import React, { useState } from "react";
import { createDocument } from "../services/documentService";
import { useNavigate } from "react-router-dom";

function AddDocument() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const documentData = {
        title,
        category,
        expiryDate: expiryDate || null,
        fileUrl
      };
      
      await createDocument(documentData);
      setSuccess("Document added successfully!");
      setError("");
      
      // Clear form
      setTitle("");
      setCategory("");
      setExpiryDate("");
      setFileUrl("");
      
      // Redirect to documents list after 2 seconds
      setTimeout(() => {
        navigate("/documents");
      }, 2000);
      
    } catch (err) {
      console.error("Add document error:", err);
      setError(err.response?.data?.message || err.message || "Failed to add document");
      setSuccess("");
    }
  };

  return (
    <div style={{ 
      maxWidth: "600px", 
      margin: "0 auto", 
      padding: "20px",
      minHeight: "80vh"
    }}>
      <h2 style={{
        textAlign: "center",
        margin: "0 0 30px 0",
        color: "#333",
        fontSize: "28px"
      }}>Add New Document</h2>
      
      {error && <p style={{ 
        color: "red", 
        textAlign: "center",
        padding: "10px",
        background: "#ffe6e6",
        borderRadius: "5px",
        margin: "0 0 20px 0"
      }}>{error}</p>}
      
      {success && <p style={{ 
        color: "green", 
        textAlign: "center",
        padding: "10px",
        background: "#e6ffe6",
        borderRadius: "5px",
        margin: "0 0 20px 0"
      }}>{success}</p>}
      
      <form onSubmit={handleSubmit} style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: "20px",
        background: "white",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
      }}>
        <div>
          <label htmlFor="title" style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "bold",
            color: "#333"
          }}>Document Title *</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ 
              width: "100%", 
              padding: "12px", 
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "16px",
              boxSizing: "border-box"
            }}
          />
        </div>
        
        <div>
          <label htmlFor="category" style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "bold",
            color: "#333"
          }}>Category *</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            style={{ 
              width: "100%", 
              padding: "12px", 
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "16px",
              boxSizing: "border-box"
            }}
          >
            <option value="">Select a category</option>
            <option value="Personal">Personal</option>
            <option value="Work">Work</option>
            <option value="Financial">Financial</option>
            <option value="Legal">Legal</option>
            <option value="Medical">Medical</option>
            <option value="Educational">Educational</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="expiryDate" style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "bold",
            color: "#333"
          }}>Expiry Date (Optional)</label>
          <input
            id="expiryDate"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            style={{ 
              width: "100%", 
              padding: "12px", 
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "16px",
              boxSizing: "border-box"
            }}
          />
        </div>
        
        <div>
          <label htmlFor="fileUrl" style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "bold",
            color: "#333"
          }}>File URL *</label>
          <input
            id="fileUrl"
            type="url"
            placeholder="https://example.com/document.pdf"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            required
            style={{ 
              width: "100%", 
              padding: "12px", 
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "16px",
              boxSizing: "border-box"
            }}
          />
        </div>
        
        <button 
          type="submit" 
          style={{ 
            padding: "15px", 
            backgroundColor: "#007bff", 
            color: "white", 
            border: "none", 
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            marginTop: "10px"
          }}
        >
          Add Document
        </button>
      </form>
      
      <button 
        onClick={() => navigate("/documents")}
        style={{ 
          marginTop: "20px",
          padding: "12px 20px", 
          backgroundColor: "#6c757d", 
          color: "white", 
          border: "none", 
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
          display: "block",
          margin: "20px auto 0 auto"
        }}
      >
        Back to Documents
      </button>
    </div>
  );
}

export default AddDocument; 