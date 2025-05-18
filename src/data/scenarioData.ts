
// Sample scenario data for the Scenario Game
export const scenarios = [
  {
    id: 1,
    title: 'Inflation Surprise',
    description: 'Latest CPI data shows inflation at 3.8%, significantly above the expected 3.2%. Employment remains strong with unemployment at 4.1%.',
    date: 'June 12, 2024',
    outcomes: {
      fedMove: 'hold',
      yieldResponse: 'up',
      explanation: 'The Fed maintained rates despite the inflation surprise, citing transitory factors. However, markets reacted by pushing yields higher in anticipation of potentially delayed rate cuts.'
    },
    yieldData: [
      { date: 'Jun 11', yield: 4.42 },
      { date: 'Jun 12', yield: 4.42 },
      { date: 'Jun 13', yield: 4.68 },
      { date: 'Jun 14', yield: 4.74 },
      { date: 'Jun 15', yield: 4.71 },
    ]
  },
  {
    id: 2,
    title: 'Banking Sector Stress',
    description: 'A mid-sized bank has reported significant losses and liquidity issues, raising concerns about financial stability. Bank stocks are down 8% this week.',
    date: 'July 23, 2024',
    outcomes: {
      fedMove: 'cut',
      yieldResponse: 'down',
      explanation: 'The Fed implemented an emergency 25bp rate cut to address financial stability concerns and prevent contagion in the banking system. Treasury yields fell sharply as investors sought safety.'
    },
    yieldData: [
      { date: 'Jul 22', yield: 4.28 },
      { date: 'Jul 23', yield: 4.28 },
      { date: 'Jul 24', yield: 4.05 },
      { date: 'Jul 25', yield: 3.92 },
      { date: 'Jul 26', yield: 3.88 },
    ]
  }
];

// Mock API functions
export const getScenarios = (): Promise<typeof scenarios> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(scenarios);
    }, 500);
  });
};

export const getScenarioById = (id: number): Promise<(typeof scenarios)[0] | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const scenario = scenarios.find(s => s.id === id);
      resolve(scenario);
    }, 300);
  });
};

export const submitPrediction = (scenarioId: number, prediction: { 
  fedMove: string; 
  yieldResponse: string; 
  confidence: number;
}): Promise<{ 
  success: boolean; 
  score: number; 
  message: string;
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const scenario = scenarios.find(s => s.id === scenarioId);
      if (!scenario) {
        resolve({
          success: false,
          score: 0,
          message: 'Scenario not found'
        });
        return;
      }
      
      // Calculate score based on correct predictions
      let score = 0;
      if (prediction.fedMove === scenario.outcomes.fedMove) score += 50;
      if (prediction.yieldResponse === scenario.outcomes.yieldResponse) score += 50;
      
      // Adjust for confidence
      const adjustedScore = Math.round(score * (prediction.confidence / 50));
      
      resolve({
        success: true,
        score: adjustedScore,
        message: `You earned ${adjustedScore} points for this scenario!`
      });
    }, 800);
  });
};
