import React, { useEffect, useRef, useState } from "react";
import { BATTING_STYLES, getOutcomeFromPercentage } from "../utils/gameLogic";

const PowerBar = ({ styleName, isGameOver, isBowling, onShotPlayed }) => {
  const [sliderPos, setSliderPos] = useState(0); 
  const [direction, setDirection] = useState(1); 
  const animationRef = useRef(null);
  const directionRef = useRef(direction);
  const posRef = useRef(sliderPos);

  const speed = 2.0;

  useEffect(() => {
    directionRef.current = direction;
    posRef.current = sliderPos;
  }, [direction, sliderPos]);

  useEffect(() => {
    if (isBowling && !isGameOver) {
      const updateSlider = () => {
        let currentPos = posRef.current;
        let currentDir = directionRef.current;
        
        let nextPos = currentPos + currentDir * speed;
        if (nextPos >= 100) {
          nextPos = 100;
          currentDir = -1;
          setDirection(-1);
        } else if (nextPos <= 0) {
          nextPos = 0;
          currentDir = 1;
          setDirection(1);
        }
        
        setSliderPos(nextPos);
        animationRef.current = requestAnimationFrame(updateSlider);
      };
      
      animationRef.current = requestAnimationFrame(updateSlider);
      return () => cancelAnimationFrame(animationRef.current);
    }
  }, [isBowling, isGameOver]);

  const handlePlayShot = () => {
    if (!isBowling || isGameOver) return;
    cancelAnimationFrame(animationRef.current);
    
    // Stop the slider immediately and calculate result
    const result = getOutcomeFromPercentage(sliderPos, styleName);
    onShotPlayed(result);
  };

  const segments = BATTING_STYLES[styleName] || BATTING_STYLES["Defensive"];

  return (
    <div className="power-bar-container">
      <div className="power-bar-title">Probability Power Bar ({styleName})</div>
      <div className="power-bar">
        {segments.map((seg, idx) => (
          <div
            key={idx}
            className="power-bar-segment"
            style={{
              width: `${seg.prob * 100}%`,
              backgroundColor: seg.color,
            }}
          >
            {/* Only show label if segment is wide enough */}
            {seg.prob > 0.04 && <span className="segment-label">{seg.label === "W" ? "W" : `${seg.label}`}</span>}
          </div>
        ))}
        {/* Visual Slider moving across the probabilities */}
        <div
          className="power-bar-slider"
          style={{ left: `${sliderPos}%` }}
        ></div>
      </div>
      
      <button 
        className="play-shot-btn" 
        onClick={handlePlayShot}
        disabled={!isBowling || isGameOver}
      >
        Play Shot!
      </button>
    </div>
  );
};

export default PowerBar;
