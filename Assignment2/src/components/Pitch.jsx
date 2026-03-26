import React from "react";

const Pitch = ({ gameState, latestOutcome }) => {
  // Pure CSS graphics: No external images required
  const isWicket = latestOutcome === "W" && gameState === 'shot-played';

  return (
    <div className="cricket-pitch-container">
      <div className="cricket-pitch-sideview patched-grass">
        {/* The Pitch Ground with creases */}
        <div className="cricket-pitch-ground">
          <div className="crease-line bowling-crease"></div>
          <div className="crease-line batting-crease"></div>
        </div>
        
        {/* The Ball Animation */}
        {/* Ball comes from far left */}
        <div 
          className={`css-ball 
            ${gameState === 'bowling' ? 'animate-bowl-side' : ''} 
            ${gameState === 'shot-played' ? `animate-shot-side-${latestOutcome}` : ''}
          `}
        ></div>

        {/* The Wicket Animation */}
        <div className={`wicket ${isWicket ? 'wicket-broken' : ''}`}>
          <div className="stump left-stump"></div>
          <div className="stump middle-stump"></div>
          <div className="stump right-stump"></div>
          <div className="bail left-bail"></div>
          <div className="bail right-bail"></div>
        </div>

        {/* Batsman Sprite from CSS */}
        {/* Swings when shot is played */}
        <div className={`batsman-css ${gameState === 'shot-played' ? 'css-bat-swing' : ''}`}>
          <div className="batsman-head">
            <div className="helmet-peak"></div>
          </div>
          <div className="batsman-body"></div>
          <div className="batsman-legs">
            <div className="leg front-leg"></div>
            <div className="leg back-leg"></div>
          </div>
          <div className="batsman-arms">
            <div className="arm front-arm"></div>
            <div className="bat"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pitch;
