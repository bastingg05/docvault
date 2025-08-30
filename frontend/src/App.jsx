import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Documents from "./pages/Documents";
import AddDocument from "./pages/AddDocument";
import Home from "./pages/Home";
import HealthDashboard from "./components/HealthDashboard";

// Navigation component that can be conditionally rendered
function Navigation({ isLoggedIn, handleLogout, showHealthDashboard, setShowHealthDashboard }) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  
  // Don't render navigation on auth pages
  if (isAuthPage) {
    return null;
  }

  return (
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
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showHealthDashboard, setShowHealthDashboard] = useState(true);

  useEffect(() => {
    // Check if user is logged in by looking for token in localStorage
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    
    // Enhanced service worker registration for PWA capabilities
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registered successfully:', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('🔄 New service worker available');
                // Optionally show update notification to user
                if (confirm('A new version of DocuVault is available. Would you like to update?')) {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                }
              }
            });
          });
          
          // Handle service worker messages
          navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data.type === 'ONLINE_STATUS_CHANGED') {
              console.log('🌐 Online status changed:', event.data.online);
              // You can update UI here if needed
            }
          });
        })
        .catch((error) => {
          console.error('❌ Service Worker registration failed:', error);
        });
    }
    
    // Network status monitoring
    const handleOnline = () => {
      console.log('🌐 Network connection restored');
      // Optionally refresh data or show online status
    };
    
    const handleOffline = () => {
      console.log('📡 Network connection lost');
      // Optionally show offline status or cached content
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
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
        <Navigation 
          isLoggedIn={isLoggedIn} 
          handleLogout={handleLogout} 
          showHealthDashboard={showHealthDashboard}
          setShowHealthDashboard={setShowHealthDashboard}
        />

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

        {/* Health Dashboard - Fixed position at right side, properly aligned and lowered */}
        {showHealthDashboard && (
          <div style={{
            position: 'fixed',
            top: '100px', // Lowered down from top
            right: '0px', // Properly right-aligned
            zIndex: 1000,
            width: '380px',
            height: 'calc(100vh - 120px)', // Full height minus top margin
            overflowY: 'auto'
          }}>
            <HealthDashboard onClose={() => setShowHealthDashboard(false)} />
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
