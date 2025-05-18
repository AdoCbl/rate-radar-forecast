
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import DashboardCard from '@/components/DashboardCard';
import { Button } from '@/components/ui/button';
import { CustomAreaChart } from '@/components/ChartComponents';
import { useToast } from "@/components/ui/use-toast";

// Sample scenario data
const scenarios = [
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

const ScenarioGame = () => {
  const { toast } = useToast();
  const [currentScenario, setCurrentScenario] = useState(scenarios[0]);
  const [selectedFedMove, setSelectedFedMove] = useState<string | null>(null);
  const [selectedYieldResponse, setSelectedYieldResponse] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(50);
  const [showResults, setShowResults] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = () => {
    if (!selectedFedMove || !selectedYieldResponse) {
      toast({
        title: "Incomplete Prediction",
        description: "Please make selections for both Fed move and yield response.",
        variant: "destructive"
      });
      return;
    }
    
    setSubmitted(true);
    
    setTimeout(() => {
      setShowResults(true);
      
      // Calculate score based on correct predictions
      let score = 0;
      if (selectedFedMove === currentScenario.outcomes.fedMove) score += 50;
      if (selectedYieldResponse === currentScenario.outcomes.yieldResponse) score += 50;
      
      // Adjust for confidence
      const adjustedScore = Math.round(score * (confidence / 50));
      
      toast({
        title: "Prediction Results",
        description: `You earned ${adjustedScore} points for this scenario!`,
      });
    }, 1500);
  };
  
  const resetGame = () => {
    setSelectedFedMove(null);
    setSelectedYieldResponse(null);
    setConfidence(50);
    setShowResults(false);
    setSubmitted(false);
    setCurrentScenario(scenarios[currentScenario.id % scenarios.length]);
  };

  // Configure yield chart
  const yieldChartConfig = {
    areas: [
      {
        dataKey: 'yield',
        name: '10-Year Treasury Yield',
        stroke: '#2563EB',
        fill: '#2563EB'
      }
    ]
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Scenario Game</h1>
        <p className="text-gray-600">Test your Fed policy prediction skills in real-world scenarios</p>
      </div>
      
      <DashboardCard title={currentScenario.title} className="mb-6">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/3 md:pr-6">
            <p className="mb-4 text-gray-700">{currentScenario.description}</p>
            <p className="text-sm text-gray-500">Scenario Date: {currentScenario.date}</p>
            
            {!showResults ? (
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-3">What will the Fed do?</h3>
                <div className="flex flex-wrap gap-3 mb-6">
                  {['hike', 'hold', 'cut'].map((move) => (
                    <button
                      key={move}
                      onClick={() => !submitted && setSelectedFedMove(move)}
                      disabled={submitted}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedFedMove === move
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } ${submitted ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {move.charAt(0).toUpperCase() + move.slice(1)}
                    </button>
                  ))}
                </div>
                
                <h3 className="font-medium text-gray-900 mb-3">How will the 10-Year Treasury yield respond?</h3>
                <div className="flex flex-wrap gap-3 mb-6">
                  {['up', 'flat', 'down'].map((response) => (
                    <button
                      key={response}
                      onClick={() => !submitted && setSelectedYieldResponse(response)}
                      disabled={submitted}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedYieldResponse === response
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } ${submitted ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {response.charAt(0).toUpperCase() + response.slice(1)}
                    </button>
                  ))}
                </div>
                
                <h3 className="font-medium text-gray-900 mb-3">How confident are you? ({confidence}%)</h3>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="10"
                  value={confidence}
                  onChange={(e) => !submitted && setConfidence(parseInt(e.target.value))}
                  disabled={submitted}
                  className="w-full"
                />
                
                <div className="mt-6">
                  <Button
                    onClick={handleSubmit}
                    disabled={submitted}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    {submitted ? 'Calculating Results...' : 'Submit Prediction'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-3">Actual Outcome</h3>
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p className="mb-2">
                    <span className="font-medium">Fed Action:</span> {currentScenario.outcomes.fedMove.charAt(0).toUpperCase() + currentScenario.outcomes.fedMove.slice(1)}
                    {selectedFedMove === currentScenario.outcomes.fedMove ? (
                      <span className="text-green-500 ml-2">✓ Correct</span>
                    ) : (
                      <span className="text-red-500 ml-2">✗ Incorrect</span>
                    )}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Yield Response:</span> {currentScenario.outcomes.yieldResponse.charAt(0).toUpperCase() + currentScenario.outcomes.yieldResponse.slice(1)}
                    {selectedYieldResponse === currentScenario.outcomes.yieldResponse ? (
                      <span className="text-green-500 ml-2">✓ Correct</span>
                    ) : (
                      <span className="text-red-500 ml-2">✗ Incorrect</span>
                    )}
                  </p>
                  <p className="text-sm mt-4">{currentScenario.outcomes.explanation}</p>
                </div>
                
                <div className="mt-6">
                  <Button
                    onClick={resetGame}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    Next Scenario
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="md:w-1/3 mt-6 md:mt-0">
            <h3 className="font-medium text-gray-900 mb-3">10-Year Treasury Yield</h3>
            <div className="h-[200px]">
              <CustomAreaChart
                data={showResults ? currentScenario.yieldData : currentScenario.yieldData.slice(0, 2)}
                areas={yieldChartConfig.areas}
                xAxisDataKey="date"
                valueFormatter={(value) => `${value}%`}
              />
            </div>
            <p className="text-xs text-center text-gray-500 mt-2">
              {showResults ? 'Actual yield movement after the event' : 'Yield before the event'}
            </p>
          </div>
        </div>
      </DashboardCard>
    </Layout>
  );
};

export default ScenarioGame;
