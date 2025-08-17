import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)",
      padding: "0",
      color: "white",
      position: "relative",
      overflow: "hidden",
      margin: 0,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Animated Background Grid */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px",
        animation: "gridMove 20s linear infinite"
      }}></div>

      {/* Floating Particles */}
      <div style={{
        position: "absolute",
        top: "15%",
        left: "10%",
        width: "4px",
        height: "4px",
        background: "#00d4ff",
        borderRadius: "50%",
        boxShadow: "0 0 20px #00d4ff",
        animation: "float 8s ease-in-out infinite"
      }}></div>
      <div style={{
        position: "absolute",
        top: "25%",
        right: "20%",
        width: "6px",
        height: "6px",
        background: "#ff6b6b",
        borderRadius: "50%",
        boxShadow: "0 0 25px #ff6b6b",
        animation: "float 12s ease-in-out infinite"
      }}></div>
      <div style={{
        position: "absolute",
        bottom: "30%",
        left: "15%",
        width: "3px",
        height: "3px",
        background: "#4ecdc4",
        borderRadius: "50%",
        boxShadow: "0 0 15px #4ecdc4",
        animation: "float 10s ease-in-out infinite"
      }}></div>

      {/* Hero Section */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "20px",
        position: "relative",
        zIndex: 2
      }}>
        {/* Main Logo/Icon */}
        <div style={{
          fontSize: window.innerWidth <= 768 ? "4rem" : "8rem",
          marginBottom: window.innerWidth <= 768 ? "20px" : "30px",
          background: "linear-gradient(45deg, #00d4ff, #ff6b6b, #4ecdc4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "glow 3s ease-in-out infinite alternate"
        }}>
          🏢
        </div>

        {/* Main Title */}
        <h1 style={{
          fontSize: window.innerWidth <= 768 ? "2.5rem" : "4.5rem",
          marginBottom: "20px",
          fontWeight: "300",
          letterSpacing: window.innerWidth <= 768 ? "1px" : "3px",
          textAlign: "center",
          background: "linear-gradient(45deg, #ffffff, #00d4ff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0 0 30px rgba(0,212,255,0.5)",
          padding: window.innerWidth <= 768 ? "0 20px" : "0"
        }}>
          DOCUVAULT
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: window.innerWidth <= 768 ? "1.2rem" : "1.8rem",
          marginBottom: window.innerWidth <= 768 ? "40px" : "60px",
          opacity: 0.8,
          textAlign: "center",
          fontWeight: "300",
          letterSpacing: "1px",
          padding: window.innerWidth <= 768 ? "0 20px" : "0"
        }}>
          Enterprise Document Management System
        </p>

        {/* Feature Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: window.innerWidth <= 768 ? "1fr" : "repeat(auto-fit, minmax(350px, 1fr))",
          gap: window.innerWidth <= 768 ? "20px" : "40px",
          maxWidth: "1400px",
          width: "100%",
          marginBottom: window.innerWidth <= 768 ? "40px" : "80px",
          padding: window.innerWidth <= 768 ? "0 20px" : "0"
        }}>
          {/* Security Card */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            borderRadius: window.innerWidth <= 768 ? "15px" : "20px",
            padding: window.innerWidth <= 768 ? "25px" : "40px",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(20px)",
            transition: "all 0.4s ease",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden"
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-10px) scale(1.02)";
            e.target.style.border = "1px solid rgba(0,212,255,0.3)";
            e.target.style.boxShadow = "0 20px 40px rgba(0,212,255,0.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0) scale(1)";
            e.target.style.border = "1px solid rgba(255,255,255,0.1)";
            e.target.style.boxShadow = "none";
          }}
          >
            <div style={{
              fontSize: window.innerWidth <= 768 ? "3rem" : "4rem",
              marginBottom: window.innerWidth <= 768 ? "15px" : "25px",
              textAlign: "center"
            }}>
              🔒
            </div>
            <h3 style={{
              fontSize: window.innerWidth <= 768 ? "1.4rem" : "1.8rem",
              marginBottom: window.innerWidth <= 768 ? "15px" : "20px",
              textAlign: "center",
              fontWeight: "400",
              letterSpacing: "1px"
            }}>
              Military-Grade Security
            </h3>
            <p style={{
              opacity: 0.7,
              lineHeight: "1.8",
              textAlign: "center",
              fontSize: window.innerWidth <= 768 ? "1rem" : "1.1rem"
            }}>
              AES-256 encryption with zero-knowledge architecture ensures your documents remain completely private
            </p>
          </div>

          {/* Organization Card */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            borderRadius: "20px",
            padding: "40px",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(20px)",
            transition: "all 0.4s ease",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-10px) scale(1.02)";
            e.target.style.border = "1px solid rgba(255,107,107,0.3)";
            e.target.style.boxShadow = "0 20px 40px rgba(255,107,107,0.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0) scale(1)";
            e.target.style.border = "1px solid rgba(255,255,255,0.1)";
            e.target.style.boxShadow = "none";
          }}
          >
            <div style={{
              fontSize: "4rem",
              marginBottom: "25px",
              textAlign: "center"
            }}>
              📁
            </div>
            <h3 style={{
              fontSize: "1.8rem",
              marginBottom: "20px",
              textAlign: "center",
              fontWeight: "400",
              letterSpacing: "1px"
            }}>
              AI-Powered Organization
            </h3>
            <p style={{
              opacity: 0.7,
              lineHeight: "1.8",
              textAlign: "center",
              fontSize: "1.1rem"
            }}>
              Intelligent categorization and advanced search capabilities powered by machine learning
            </p>
          </div>

          {/* Access Card */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            borderRadius: "20px",
            padding: "40px",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(20px)",
            transition: "all 0.4s ease",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-10px) scale(1.02)";
            e.target.style.border = "1px solid rgba(78,205,196,0.3)";
            e.target.style.boxShadow = "0 20px 40px rgba(78,205,196,0.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0) scale(1)";
            e.target.style.border = "1px solid rgba(255,255,255,0.1)";
            e.target.style.boxShadow = "none";
          }}
          >
            <div style={{
              fontSize: "4rem",
              marginBottom: "25px",
              textAlign: "center"
            }}>
              📱
            </div>
            <h3 style={{
              fontSize: "1.8rem",
              marginBottom: "20px",
              textAlign: "center",
              fontWeight: "400",
              letterSpacing: "1px"
            }}>
              Universal Access
            </h3>
            <p style={{
              opacity: 0.7,
              lineHeight: "1.8",
              textAlign: "center",
              fontSize: "1.1rem"
            }}>
              Access your documents from any device, anywhere in the world with real-time synchronization
            </p>
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: window.innerWidth <= 768 ? "15px" : "30px",
          flexWrap: "wrap",
          marginBottom: window.innerWidth <= 768 ? "40px" : "60px",
          padding: window.innerWidth <= 768 ? "0 20px" : "0"
        }}>
          <Link to="/register" style={{
            background: "linear-gradient(45deg, #00d4ff, #0099cc)",
            color: "white",
            padding: window.innerWidth <= 768 ? "15px 30px" : "18px 40px",
            borderRadius: "50px",
            textDecoration: "none",
            fontSize: window.innerWidth <= 768 ? "1.1rem" : "1.3rem",
            fontWeight: "500",
            letterSpacing: "1px",
            boxShadow: "0 10px 30px rgba(0,212,255,0.3)",
            transition: "all 0.3s ease",
            border: "none",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden"
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-3px)";
            e.target.style.boxShadow = "0 15px 40px rgba(0,212,255,0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 10px 30px rgba(0,212,255,0.3)";
          }}
          >
            🚀 GET STARTED
          </Link>
          <Link to="/login" style={{
            background: "rgba(255,255,255,0.05)",
            color: "white",
            padding: window.innerWidth <= 768 ? "15px 30px" : "18px 40px",
            borderRadius: "50px",
            textDecoration: "none",
            fontSize: window.innerWidth <= 768 ? "1.1rem" : "1.3rem",
            fontWeight: "500",
            letterSpacing: "1px",
            border: "2px solid rgba(255,255,255,0.2)",
            transition: "all 0.3s ease",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(255,255,255,0.1)";
            e.target.style.border = "2px solid rgba(255,255,255,0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(255,255,255,0.05)";
            e.target.style.border = "2px solid rgba(255,255,255,0.2)";
          }}
          >
            🔑 SIGN IN
          </Link>
        </div>

        {/* Statistics Section */}
        <div style={{
          background: "rgba(0,0,0,0.3)",
          borderRadius: window.innerWidth <= 768 ? "15px" : "20px",
          padding: window.innerWidth <= 768 ? "30px 20px" : "50px",
          border: "1px solid rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          maxWidth: "1000px",
          width: "100%",
          margin: window.innerWidth <= 768 ? "0 20px" : "0"
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: window.innerWidth <= 768 ? "1fr" : "repeat(auto-fit, minmax(250px, 1fr))",
            gap: window.innerWidth <= 768 ? "25px" : "40px",
            textAlign: "center"
          }}>
            <div>
              <div style={{
                fontSize: window.innerWidth <= 768 ? "2.5rem" : "3rem",
                fontWeight: "300",
                marginBottom: window.innerWidth <= 768 ? "10px" : "15px",
                background: "linear-gradient(45deg, #00d4ff, #ffffff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                10M+ 📄
              </div>
              <div style={{ 
                opacity: 0.7, 
                fontSize: window.innerWidth <= 768 ? "1rem" : "1.1rem",
                letterSpacing: "1px"
              }}>
                Documents Secured
              </div>
            </div>
            <div>
              <div style={{
                fontSize: "3rem",
                fontWeight: "300",
                marginBottom: "15px",
                background: "linear-gradient(45deg, #ff6b6b, #ffffff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                99.99% ⚡
              </div>
              <div style={{ 
                opacity: 0.7, 
                fontSize: "1.1rem",
                letterSpacing: "1px"
              }}>
                Uptime Guarantee
              </div>
            </div>
            <div>
              <div style={{
                fontSize: "3rem",
                fontWeight: "300",
                marginBottom: "15px",
                background: "linear-gradient(45deg, #4ecdc4, #ffffff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                256-bit 🔐
              </div>
              <div style={{ 
                opacity: 0.7, 
                fontSize: "1.1rem",
                letterSpacing: "1px"
              }}>
                AES Encryption
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
        }
        @keyframes glow {
          0% { filter: drop-shadow(0 0 20px rgba(0,212,255,0.5)); }
          100% { filter: drop-shadow(0 0 40px rgba(0,212,255,0.8)); }
        }
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default Home; 