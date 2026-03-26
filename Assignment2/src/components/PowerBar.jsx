import React, { useEffect, useRef, useState } from "react";
import { BATTING_STYLES, getOutcomeFromPercentage } from "../utils/gameLogic";

const PowerBar = ({ styleName, isGameOver, isIdle, onShotSelected }) => {
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
    if (isIdle && !isGameOver) {
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
  }, [isIdle, isGameOver]);

  const handlePlayShot = () => {
    if (!isIdle || isGameOver) return;
    cancelAnimationFrame(animationRef.current);
    
    // Stop the slider immediately and calculate result
    const result = getOutcomeFromPercentage(posRef.current, styleName);
    onShotSelected(result);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        handlePlayShot();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isIdle, isGameOver, styleName]);

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
        disabled={!isIdle || isGameOver}
      >
        Play Shot (SPACE)
      </button>
    </div>
  );
};

export default PowerBar;
