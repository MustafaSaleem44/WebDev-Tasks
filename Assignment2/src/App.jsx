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
  
  // idle (slider moving), bowling (animation), shot-played (animation)
  const [gameState, setGameState] = useState("idle");
  const [latestOutcome, setLatestOutcome] = useState(null);
  const [commentaryText, setCommentaryText] = useState("Welcome! Select style and press SPACE or click the button to play.");

  const isGameOver = balls >= 12 || wickets >= 2;

  const handleRestart = () => {
    setRuns(0);
    setWickets(0);
    setBalls(0);
    setGameState("idle");
    setLatestOutcome(null);
    setBattingStyle("Defensive");
    setCommentaryText("Match restarted! Press Spacebar or click Play to shoot.");
  };

  const handleShotSelected = (outcome) => {
    if (gameState !== "idle" || isGameOver) return;
    
    setLatestOutcome(outcome);
    setGameState("bowling");
    setCommentaryText("Bowler runs in...");

    // Wait for bowling animation to finish (e.g., 1000ms), then play shot
    setTimeout(() => {
      setGameState("shot-played");
      
      // Update score at the moment the bat hits the ball
      setBalls((prev) => prev + 1);
      if (outcome === "W") {
        setWickets((prev) => prev + 1);
      } else {
        setRuns((prev) => prev + Number(outcome));
      }
      setCommentaryText(getRandomCommentary(outcome));

      // Wait for shot animation to finish, then go back to idle
      setTimeout(() => {
        setGameState("idle");
      }, 1500); 
    }, 1200); // 1.2s for bowling animation
  };

  return (
    <div className="cricket-app-container">
      <header className="app-header">
        <h1>2D Web Cricket</h1>
        <Scoreboard runs={runs} wickets={wickets} balls={balls} />
      </header>

      <main className="game-area">
        <div className="sidebar">
          <div className="controls-panel">
            <h3>Match Settings</h3>
            <div className="style-selector">
              <label>
                <input
                  type="radio"
                  name="battingStyle"
                  value="Defensive"
                  checked={battingStyle === "Defensive"}
                  onChange={() => setBattingStyle("Defensive")}
                  disabled={gameState !== "idle" || isGameOver}
                />
                Defensive (Low Risk)
              </label>
              <label>
                <input
                  type="radio"
                  name="battingStyle"
                  value="Aggressive"
                  checked={battingStyle === "Aggressive"}
                  onChange={() => setBattingStyle("Aggressive")}
                  disabled={gameState !== "idle" || isGameOver}
                />
                Aggressive (High Risk)
              </label>
            </div>
            
            <button className="restart-btn" onClick={handleRestart}>
              Restart Game
            </button>
          </div>

          <Commentary text={commentaryText} />
        </div>

        <div className="main-pitch">
          <Pitch gameState={gameState} latestOutcome={latestOutcome} />
          <PowerBar 
            styleName={battingStyle} 
            isIdle={gameState === "idle"} 
            isGameOver={isGameOver}
            onShotSelected={handleShotSelected} 
          />
        </div>
      </main>

      {/* Game Over Overlay */}
      {isGameOver && (
        <div className="game-over-modal">
          <div className="game-over-content">
            <h2>{wickets >= 2 ? "MATCH OVER: ALL OUT" : "MATCH OVER: OVERS FINISHED"}</h2>
            <p>Runs: {runs}</p>
            <p>Wickets: {wickets}</p>
            <button onClick={handleRestart}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
