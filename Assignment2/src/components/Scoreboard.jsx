import React from "react";

const Scoreboard = ({ runs, wickets, balls, target }) => {
  const overs = Math.floor(balls / 6);
  const remainingBalls = balls % 6;

  return (
    <div className="scoreboard">
      <h2>Score: {runs}/{wickets}</h2>
      <h3>
        Overs: {overs}.{remainingBalls} / 2.0 (12 balls)
      </h3>
      <p className="status">
        {wickets >= 2 ? "Innings Complete (All Out)" : balls >= 12 ? "Innings Complete (Overs Finished)" : "Match in Progress..."}
      </p>
    </div>
  );
};

export default Scoreboard;
