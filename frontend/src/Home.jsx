import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [recordings, setRecordings] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/api/recordings")
      .then(res => res.json())
      .then(data => {
        setRecordings(data);
        setLoading(false);
        })
      .catch(err => {
        console.error("Failed to fetch recordings:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
          color: "#888",
        }}
      >
        Loading list of recordings...
      </div>
    );
  }

  return (
    <div>
        <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif", height: "90vh", overflowY: "auto" }}>
        <h1>Select a Recording</h1>
        {recordings.length === 0 ? (
            <p>No recordings available.</p>
        ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
            {recordings.map(rec => (
                <li
                key={rec.id}
                style={{
                    margin: "1rem 0",
                    padding: "1rem",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    cursor: "pointer"
                }}
                onClick={() => navigate(`/dashboard/${rec.id}`)}
                >
                <h3>{rec.file}</h3>
                <p>{rec.description}</p>
                </li>
            ))}
            </ul>
        )}
        </div>
        <div style={{ 
                height: "5vh",
                textAlign: "center",
                color: "#afafafff",
            }}>
            © 2025 ACM Powered By MTU
        </div>
    </div>
  );
}

export default Home;
