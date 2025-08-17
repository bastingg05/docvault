import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Documents from "./pages/Documents";
import AddDocument from "./pages/AddDocument";
import Home from "./pages/Home";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in by looking for token in localStorage
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Listen for login state changes
  useEffect(() => {
    const handleLoginStateChange = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    window.addEventListener('loginStateChanged', handleLoginStateChange);
    return () => window.removeEventListener('loginStateChanged', handleLoginStateChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        margin: 0,
        padding: 0,
        overflowX: "hidden",
        overflowY: "auto"
      }}>
                    <nav style={{ 
              padding: "1rem 0", 
              background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: window.innerWidth <= 768 ? "15px" : "30px",
              fontSize: window.innerWidth <= 768 ? "14px" : "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              width: "100vw",
              margin: 0,
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              position: "sticky",
              top: 0,
              zIndex: 1000
            }}>
                  <Link to="/" style={{ 
          textDecoration: "none", 
          color: "#00d4ff", 
          fontWeight: "bold",
          padding: window.innerWidth <= 768 ? "8px 12px" : "10px 16px",
          borderRadius: "8px",
          transition: "all 0.3s ease",
          display: "inline-block",
          letterSpacing: window.innerWidth <= 768 ? "0.5px" : "1px",
          fontSize: window.innerWidth <= 768 ? "12px" : "16px"
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "rgba(0,212,255,0.1)";
          e.target.style.boxShadow = "0 0 20px rgba(0,212,255,0.3)";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "transparent";
          e.target.style.boxShadow = "none";
        }}
        >🏢 HOME</Link>
          {!isLoggedIn ? (
            <>
                          <Link to="/login" style={{ 
              textDecoration: "none", 
              color: "#ff6b6b",
              padding: "10px 16px",
              borderRadius: "8px",
              transition: "all 0.3s ease",
              display: "inline-block",
              letterSpacing: "1px"
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "rgba(255,107,107,0.1)";
              e.target.style.boxShadow = "0 0 20px rgba(255,107,107,0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.boxShadow = "none";
            }}
            >🔑 LOGIN</Link>
                          <Link to="/register" style={{ 
              textDecoration: "none", 
              color: "#4ecdc4",
              padding: "10px 16px",
              borderRadius: "8px",
              transition: "all 0.3s ease",
              display: "inline-block",
              letterSpacing: "1px"
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "rgba(78,205,196,0.1)";
              e.target.style.boxShadow = "0 0 20px rgba(78,205,196,0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.boxShadow = "none";
            }}
            >📝 REGISTER</Link>
            </>
          ) : (
            <>
                          <Link to="/documents" style={{ 
              textDecoration: "none", 
              color: "#00d4ff",
              padding: "10px 16px",
              borderRadius: "8px",
              transition: "all 0.3s ease",
              display: "inline-block",
              letterSpacing: "1px"
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "rgba(0,212,255,0.1)";
              e.target.style.boxShadow = "0 0 20px rgba(0,212,255,0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.boxShadow = "none";
            }}
            >📁 DOCUMENTS</Link>
                          <Link to="/add-document" style={{ 
              textDecoration: "none", 
              color: "#ff6b6b",
              padding: "10px 16px",
              borderRadius: "8px",
              transition: "all 0.3s ease",
              display: "inline-block",
              letterSpacing: "1px"
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "rgba(255,107,107,0.1)";
              e.target.style.boxShadow = "0 0 20px rgba(255,107,107,0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.boxShadow = "none";
            }}
            >➕ ADD DOCUMENT</Link>
                          <button onClick={handleLogout} style={{ 
              background: "none", 
              border: "none", 
              color: "#ff4757", 
              textDecoration: "none", 
              cursor: "pointer",
              fontSize: "16px",
              padding: "10px 16px",
              borderRadius: "8px",
              transition: "all 0.3s ease",
              display: "inline-block",
              letterSpacing: "1px",
              fontWeight: "bold"
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "rgba(255,71,87,0.1)";
              e.target.style.boxShadow = "0 0 20px rgba(255,71,87,0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.boxShadow = "none";
            }}
            >🚪 LOGOUT</button>
            </>
          )}
        </nav>

        <div style={{ 
          flex: 1,
          display: "flex", 
          justifyContent: "center", 
          alignItems: "flex-start", 
          width: "100vw",
          padding: "0",
          boxSizing: "border-box",
          margin: 0,
          overflowY: "auto"
        }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/documents" element={isLoggedIn ? <Documents /> : <Login />} />
            <Route path="/add-document" element={isLoggedIn ? <AddDocument /> : <Login />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
