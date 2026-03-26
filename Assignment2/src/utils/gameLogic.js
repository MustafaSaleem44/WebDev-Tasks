export const BATTING_STYLES = {
  Defensive: [
    { outcome: 1, prob: 0.30, color: "#81C784", label: "1" },
    { outcome: 4, prob: 0.05, color: "#2196F3", label: "4" },
    { outcome: 0, prob: 0.35, color: "#9E9E9E", label: "0" },
    { outcome: 2, prob: 0.15, color: "#4CAF50", label: "2" },
    { outcome: "W", prob: 0.10, color: "#F44336", label: "W" },
    { outcome: 3, prob: 0.05, color: "#2E7D32", label: "3" },
    { outcome: 6, prob: 0.00, color: "#9C27B0", label: "6" },
  ],
  Aggressive: [
    { outcome: 6, prob: 0.20, color: "#9C27B0", label: "6" },
    { outcome: 1, prob: 0.10, color: "#81C784", label: "1" },
    { outcome: 0, prob: 0.05, color: "#9E9E9E", label: "0" },
    { outcome: "W", prob: 0.40, color: "#F44336", label: "W" }, // Biggest Segment
    { outcome: 4, prob: 0.15, color: "#2196F3", label: "4" },
    { outcome: 2, prob: 0.05, color: "#4CAF50", label: "2" },
    { outcome: 3, prob: 0.05, color: "#2E7D32", label: "3" },
  ],
};

const COMMENTARY = {
  0: [
    "Solid defense.",
    "Played it straight back to the bowler.",
    "No run there, good delivery.",
    "Well left outside off stump.",
  ],
  1: [
    "Quick single taken.",
    "Tapped into the gap for one.",
    "Good rotation of strike.",
    "Played with soft hands for a single.",
  ],
  2: [
    "Pushed hard for two.",
    "Excellent running between the wickets.",
    "Two runs added to the total.",
    "Placed beautifully for a couple.",
  ],
  3: [
    "Great running, they get three!",
    "Fielders chase it down, but it's three runs.",
    "Rare three runs taken!",
  ],
  4: [
    "Shot! That's away to the boundary.",
    "Cracking drive for four!",
    "Pierced the gap perfectly for four.",
    "Slapped away to the boundary rope!",
  ],
  6: [
    "He's hit that out of the park!",
    "Massive six!",
    "What a shot, into the stands!",
    "High and handsome over long-on!",
  ],
  W: [
    "Bowled him! What a delivery.",
    "Caught! He misjudged that one.",
    "It's a wicket! Huge breakthrough.",
    "Caught behind! The keeper takes a fine catch.",
  ],
};

export const getRandomCommentary = (outcome) => {
  const options = COMMENTARY[outcome];
  if (!options) return "The match continues...";
  return options[Math.floor(Math.random() * options.length)];
};

export const getOutcomeFromPercentage = (percentage, style) => {
  // Convert 0-100 percentage to outcome based strictly on defined probabilities
  const styleProbs = BATTING_STYLES[style];
  let cumulative = 0;
  
  for (const item of styleProbs) {
    cumulative += item.prob * 100;
    if (percentage <= cumulative) {
      return item.outcome;
    }
  }
  // Fallback if exactly at 100% or slight float precision issue
  return styleProbs[styleProbs.length - 1].outcome; 
};
