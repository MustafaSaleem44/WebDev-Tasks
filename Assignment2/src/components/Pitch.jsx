import React from "react";

const Pitch = ({ gameState, latestOutcome }) => {
  // MUST DO FOR VIVA DEMO:
  // Create a folder named "assets" inside the "public" directory (so public/assets).
  // Place three simple images there:
  // 1. batsman.png
  // 2. bowler.png
  // 3. ball.png
  // They will be loaded exactly via the standard paths shown below.

  return (
    <div className="cricket-pitch-container">
      <div className="cricket-pitch">
        {/* Bowler Sprite Top of the Pitch */}
        <div className="sprite bowler">
          <img src="/assets/bowler.png" alt="Bowler" onError={(e) => {e.target.style.display = 'none'}} />
          <div className="placeholder-sprite">Bowler</div>
        </div>

        {/* The Ball Animation Logic */}
        {/* gameState can be 'idle', 'bowling', or 'shot-played' */}
        <div 
          className={`ball 
            ${gameState === 'bowling' ? 'animate-bowl' : ''} 
            ${gameState === 'shot-played' ? `animate-shot-${latestOutcome}` : ''}
          `}
        >
          <img src="/assets/ball.png" alt="Ball" onError={(e) => {e.target.style.display = 'none'}} />
          <div className="placeholder-ball">O</div>
        </div>

        {/* Batsman Sprite Bottom of the Pitch */}
        <div className={`sprite batsman ${gameState === 'shot-played' ? 'animate-bat-swing' : ''}`}>
          <img src="/assets/batsman.png" alt="Batsman" onError={(e) => {e.target.style.display = 'none'}} />
          <div className="placeholder-sprite">Batsman</div>
        </div>
      </div>
    </div>
  );
};

export default Pitch;
