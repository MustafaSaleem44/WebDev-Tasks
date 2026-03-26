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
  
  // idle, bowling, shot-played
  const [gameState, setGameState] = useState("idle");
  const [latestOutcome, setLatestOutcome] = useState(null);
  const [commentaryText, setCommentaryText] = useState("Welcome to the 2D Cricket Game! Select style and click Bowl.");

  const isGameOver = balls >= 12 || wickets >= 2;

  const handleRestart = () => {
    setRuns(0);
    setWickets(0);
    setBalls(0);
    setGameState("idle");
    setLatestOutcome(null);
    setBattingStyle("Defensive");
    setCommentaryText("Match restarted! Select style and click Bowl.");
  };

  const startBowling = () => {
    if (isGameOver || gameState !== "idle") return;
    
    setLatestOutcome(null);
    setGameState("bowling");
    setCommentaryText("Bowler running in... wait for it... click Play Shot when ready!");
  };

  const handleShotPlayed = (outcome) => {
    if (gameState !== "bowling") return;
    
    setGameState("shot-played");
    setLatestOutcome(outcome);
    setBalls((prev) => prev + 1);

    if (outcome === "W") {
      setWickets((prev) => prev + 1);
    } else {
      setRuns((prev) => prev + Number(outcome));
    }

    setCommentaryText(getRandomCommentary(outcome));

    // Reset back to idle state after animation completes
    setTimeout(() => {
      setGameState("idle");
    }, 1800); 
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
                Defensive (Low Risk, Safe)
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
                Aggressive (High Risk, Boundaries)
              </label>
            </div>
            
            <button 
              className="bowl-btn"
              onClick={startBowling}
              disabled={gameState !== "idle" || isGameOver}
            >
              Bowl Custom Delivery!
            </button>
            
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
            isBowling={gameState === "bowling"} 
            isGameOver={isGameOver}
            onShotPlayed={handleShotPlayed} 
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
