import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import DashboardCard from '@/components/DashboardCard';
import { Button } from '@/components/ui/button';
import { CustomAreaChart } from '@/components/ChartComponents';
import { useToast } from "@/hooks/use-toast";
import { scenarios, getScenarios, submitPrediction } from '@/data/scenarioData';

const ScenarioGame = () => {
  const { toast } = useToast();
  const [currentScenario, setCurrentScenario] = useState(scenarios[0]);
  const [selectedFedMove, setSelectedFedMove] = useState<string | null>(null);
  const [selectedYieldResponse, setSelectedYieldResponse] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(50);
  const [showResults, setShowResults] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const loadScenarios = async () => {
      try {
        const data = await getScenarios();
        if (data.length > 0) {
          setCurrentScenario(data[0]);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load scenarios. Please try again.",
          variant: "destructive"
        });
      }
    };
    
    loadScenarios();
  }, []);
  
  const handleSubmit = async () => {
    if (!selectedFedMove || !selectedYieldResponse) {
      toast({
        title: "Incomplete Prediction",
        description: "Please make selections for both Fed move and yield response.",
        variant: "destructive"
      });
      return;
    }
    
    setSubmitted(true);
    setLoading(true);
    
    try {
      const result = await submitPrediction(currentScenario.id, {
        fedMove: selectedFedMove,
        yieldResponse: selectedYieldResponse,
        confidence
      });
      
      if (result.success) {
        setShowResults(true);
        toast({
          title: "Prediction Results",
          description: result.message,
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        });
        setSubmitted(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit prediction. Please try again.",
        variant: "destructive"
      });
      setSubmitted(false);
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-2xl font-bold text-gray-900 gradient-heading">Scenario Game</h1>
        <p className="text-gray-600">Test your Fed policy prediction skills in real-world scenarios</p>
      </div>
      
      <DashboardCard 
        title={currentScenario.title} 
        className="mb-6 bg-gradient-to-br from-white via-white to-blue-50 border-blue-100/50"
      >
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
                      className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                        selectedFedMove === move
                          ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-sm transform scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
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
                      className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                        selectedYieldResponse === response
                          ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-sm transform scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
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
                  className="w-full accent-primary"
                />
                
                <div className="mt-6">
                  <Button
                    onClick={handleSubmit}
                    disabled={submitted || loading}
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white transition-all duration-300"
                  >
                    {loading ? 'Processing...' : submitted ? 'Calculating Results...' : 'Submit Prediction'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-6 animate-fade-in">
                <h3 className="font-medium text-gray-900 mb-3">Actual Outcome</h3>
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p className="mb-2">
                    <span className="font-medium">Fed Action:</span> {currentScenario.outcomes.fedMove.charAt(0).toUpperCase() + currentScenario.outcomes.fedMove.slice(1)}
                    {selectedFedMove === currentScenario.outcomes.fedMove ? (
                      <span className="text-green-500 ml-2 font-medium">✓ Correct</span>
                    ) : (
                      <span className="text-red-500 ml-2 font-medium">✗ Incorrect</span>
                    )}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Yield Response:</span> {currentScenario.outcomes.yieldResponse.charAt(0).toUpperCase() + currentScenario.outcomes.yieldResponse.slice(1)}
                    {selectedYieldResponse === currentScenario.outcomes.yieldResponse ? (
                      <span className="text-green-500 ml-2 font-medium">✓ Correct</span>
                    ) : (
                      <span className="text-red-500 ml-2 font-medium">✗ Incorrect</span>
                    )}
                  </p>
                  <p className="text-sm mt-4">{currentScenario.outcomes.explanation}</p>
                </div>
                
                <div className="mt-6">
                  <Button
                    onClick={resetGame}
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white transition-all duration-300"
                  >
                    Next Scenario
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="md:w-1/3 mt-6 md:mt-0">
            <h3 className="font-medium text-gray-900 mb-3">10-Year Treasury Yield</h3>
            <div className="h-[200px] bg-white/80 p-2 rounded-lg shadow-sm">
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
