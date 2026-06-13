import { useState, useEffect } from "react";
import { API_BASE_URL, authHeaders } from "../config/api";

export default function GamificationPanel() {
  const [pointsData, setPointsData] = useState(null);
  const [ecoScoreData, setEcoScoreData] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completingChallenge, setCompletingChallenge] = useState(null);

  useEffect(() => {
    fetchGamificationData();
  }, []);

  async function fetchGamificationData() {
    try {
      setLoading(true);
      setError("");

      // Fetch points profile
      const pointsRes = await fetch(`${API_BASE_URL}/api/points/profile`, {
        headers: authHeaders(),
      });
      if (!pointsRes.ok) throw new Error("Failed to fetch points");
      const pointsData = await pointsRes.json();
      setPointsData(pointsData);

      // Fetch eco score
      const ecoRes = await fetch(`${API_BASE_URL}/api/eco-score`, {
        headers: authHeaders(),
      });
      if (!ecoRes.ok) throw new Error("Failed to fetch eco score");
      const ecoData = await ecoRes.json();
      setEcoScoreData(ecoData);

      // Fetch active challenges
      const chalRes = await fetch(`${API_BASE_URL}/api/challenges`, {
        headers: authHeaders(),
      });
      if (!chalRes.ok) throw new Error("Failed to fetch challenges");
      const chalData = await chalRes.json();
      setChallenges(chalData);
    } catch (err) {
      console.error(err);
      setError("Failed to load gamification data");
    } finally {
      setLoading(false);
    }
  }

  async function completeChallenge(productId) {
    try {
      setCompletingChallenge(productId);
      const res = await fetch(`${API_BASE_URL}/api/challenges/${productId}/complete`, {
        method: "POST",
        headers: authHeaders(),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to complete challenge");
      }

      const result = await res.json();

      // Update UI
      setChallenges(challenges.filter((c) => c.productId !== productId));
      if (pointsData) {
        setPointsData({
          ...pointsData,
          ecoPoints: result.totalPoints,
          level: result.level,
          completedChallenges: pointsData.completedChallenges + 1,
        });
      }

      // Show success message
      alert(`✓ Challenge Complete!\nEarned ${result.pointsAwarded} points!\nTotal: ${result.totalPoints}`);

      // Refresh eco score
      fetchGamificationData();
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    } finally {
      setCompletingChallenge(null);
    }
  }

  if (loading) {
    return <div className="gamification-panel">Loading gamification data...</div>;
  }

  return (
    <div className="gamification-panel">
      {error && <p className="form-message error">{error}</p>}

      {/* User Level & Points */}
      <div className="gamification-header">
        <div className="level-card">
          <div className="level-badge">
            <span className="badge-level">{pointsData?.level || "Beginner"}</span>
          </div>
          <div>
            <p className="level-label">Current Level</p>
            <p className="level-name">{pointsData?.level || "Beginner Saver"}</p>
          </div>
        </div>

        <div className="points-stats">
          <div className="stat-item">
            <p className="stat-label">Eco Points</p>
            <p className="stat-value">{pointsData?.ecoPoints || 0}</p>
          </div>
          <div className="stat-item">
            <p className="stat-label">Challenges</p>
            <p className="stat-value">{pointsData?.completedChallenges || 0}</p>
          </div>
        </div>
      </div>

      {/* Eco Score Analytics */}
      {ecoScoreData && (
        <div className="eco-score-section">
          <h3>🌍 Eco Score Analytics</h3>
          <div className="eco-grid">
            <div className="eco-card">
              <p className="eco-label">Eco Score</p>
              <p className="eco-value">{ecoScoreData.ecoScore}/100</p>
              <p className="eco-rating">{ecoScoreData.ecoRating}</p>
            </div>
            <div className="eco-card">
              <p className="eco-label">Products Saved</p>
              <p className="eco-value">{ecoScoreData.productsSaved}</p>
              <p className="eco-sublabel">from waste</p>
            </div>
            <div className="eco-card">
              <p className="eco-label">Carbon Saved</p>
              <p className="eco-value">{ecoScoreData.carbonSaved} kg</p>
              <p className="eco-sublabel">CO₂ equivalent</p>
            </div>
            <div className="eco-card">
              <p className="eco-label">Money Saved</p>
              <p className="eco-value">${ecoScoreData.moneySaved}</p>
              <p className="eco-sublabel">estimated value</p>
            </div>
            <div className="eco-card">
              <p className="eco-label">Waste Rate</p>
              <p className="eco-value">{ecoScoreData.wasteReductionRate}%</p>
              <p className="eco-sublabel">reduction rate</p>
            </div>
            <div className="eco-card">
              <p className="eco-label">Wasted Products</p>
              <p className="eco-value">{ecoScoreData.productsWasted}</p>
              <p className="eco-sublabel">not saved</p>
            </div>
          </div>
        </div>
      )}

      {/* Active Challenges */}
      <div className="challenges-section">
        <h3>🎯 Active Challenges ({challenges.length})</h3>
        {challenges.length === 0 ? (
          <p className="no-data">No active challenges. All products are already used or ineligible.</p>
        ) : (
          <div className="challenges-list">
            {challenges.map((challenge) => (
              <div key={challenge.productId} className="challenge-card">
                <div className="challenge-info">
                  <p className="challenge-name">{challenge.productName}</p>
                  <p className="challenge-days">
                    ⏱️ {challenge.daysRemaining} day{challenge.daysRemaining !== 1 ? "s" : ""} remaining
                  </p>
                </div>
                <button
                  className="challenge-btn"
                  onClick={() => completeChallenge(challenge.productId)}
                  disabled={completingChallenge === challenge.productId}
                >
                  {completingChallenge === challenge.productId ? "Processing..." : "Complete Challenge"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Level Progression */}
      <div className="level-progression">
        <h3>📈 Level Progression</h3>
        <div className="progression-items">
          <div className="progression-item">
            <p className="progression-level">Beginner Saver</p>
            <p className="progression-points">0 - 99 points</p>
          </div>
          <div className="progression-item">
            <p className="progression-level">Waste Warrior</p>
            <p className="progression-points">100 - 299 points</p>
          </div>
          <div className="progression-item">
            <p className="progression-level">Eco Guardian</p>
            <p className="progression-points">300 - 599 points</p>
          </div>
          <div className="progression-item">
            <p className="progression-level">Zero Waste Hero</p>
            <p className="progression-points">600+ points</p>
          </div>
        </div>
      </div>
    </div>
  );
}
