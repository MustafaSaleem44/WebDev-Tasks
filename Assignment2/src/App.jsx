import React, { useState, useEffect } from "react";
import Scoreboard from "./components/Scoreboard";
import PowerBar from "./components/PowerBar";
import Pitch from "./components/Pitch";
import Commentary from "./components/Commentary";
import { getRandomCommentary } from "./utils/gameLogic";
import "./App.css";

function App() {
  const [runs, setRuns] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [balls, setBalls] = useState(0);
  
  const [battingStyle, setBattingStyle] = useState("Defensive");
  
  const [gameState, setGameState] = useState("idle");
  const [latestOutcome, setLatestOutcome] = useState(null);
  const [commentaryText, setCommentaryText] = useState("Welcome! Press SPACE to play.");

  const isGameOver = balls >= 12 || wickets >= 2;

  const handleRestart = () => {
    setRuns(0);
    setWickets(0);
    setBalls(0);
    setGameState("idle");
    setLatestOutcome(null);
    setBattingStyle("Defensive");
    setCommentaryText("Match restarted! Press SPACE to shoot.");
  };

  const handleShotSelected = (outcome) => {
    if (gameState !== "idle" || isGameOver) return;
    
    setLatestOutcome(outcome);
    setGameState("bowling");
    setCommentaryText("Bowler runs in...");

    setTimeout(() => {
      setGameState("shot-played");
      
      setBalls((prev) => prev + 1);
      if (outcome === "W") {
        setWickets((prev) => prev + 1);
      } else {
        setRuns((prev) => prev + Number(outcome));
      }
      setCommentaryText(getRandomCommentary(outcome));

      setTimeout(() => {
        setGameState("idle");
      }, 1500); 
    }, 1200);
  };

  return (
    <div className="cricket-immersive-container">
      {/* Background Graphic Engine */}
      <Pitch gameState={gameState} latestOutcome={latestOutcome} />

      {/* Screen Overlays */}

      <div className="hud-header">
        <h1 className="tiny-title">2D Cricket immersive</h1>
        <button className="restart-btn-hud" onClick={handleRestart}>Restart</button>
      </div>

      <div className="scoreboard-overlay">
        <Scoreboard runs={runs} wickets={wickets} balls={balls} />
      </div>

      <div className="jumbotron-commentary">
        <Commentary text={commentaryText} />
      </div>

      {/* Controls on the Ground */}
      <div className="ground-controls">
        <div className="style-selector-hud">
          <label className={battingStyle === "Defensive" ? "active" : ""}>
            <input
              type="radio"
              name="battingStyle"
              value="Defensive"
              checked={battingStyle === "Defensive"}
              onChange={() => setBattingStyle("Defensive")}
              disabled={gameState !== "idle" || isGameOver}
            />
            Defensive
          </label>
          <label className={battingStyle === "Aggressive" ? "active" : ""}>
            <input
              type="radio"
              name="battingStyle"
              value="Aggressive"
              checked={battingStyle === "Aggressive"}
              onChange={() => setBattingStyle("Aggressive")}
              disabled={gameState !== "idle" || isGameOver}
            />
            Aggressive
          </label>
        </div>
      </div>

      {/* Bottom PowerBar HUD */}
      <div className="powerbar-hud">
        <PowerBar 
          styleName={battingStyle} 
          isIdle={gameState === "idle"} 
          isGameOver={isGameOver}
          onShotSelected={handleShotSelected} 
        />
      </div>

      {/* Game Over Overlay */}
      {isGameOver && (
        <div className="game-over-modal">
          <div className="game-over-content">
            <h2>{wickets >= 2 ? "ALL OUT" : "OVERS FINISHED"}</h2>
            <p>Score: {runs}/{wickets}</p>
            <button className="play-again-btn" onClick={handleRestart}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
