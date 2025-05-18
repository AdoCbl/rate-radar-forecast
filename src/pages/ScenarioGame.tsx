
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import DashboardCard from '@/components/DashboardCard';
import { Button } from '@/components/ui/button';
import { CustomAreaChart } from '@/components/ChartComponents';
import { useToast } from "@/hooks/use-toast";
import { scenarios, getScenarios, submitPrediction } from '@/data/scenarioData';
import { Progress } from "@/components/ui/progress";
import { CircleCheck, CircleX, Award, TrendingUp, TrendingDown } from "lucide-react";

const ScenarioGame = () => {
  const { toast } = useToast();
  const [currentScenario, setCurrentScenario] = useState(scenarios[0]);
  const [selectedFedMove, setSelectedFedMove] = useState<string | null>(null);
  const [selectedYieldResponse, setSelectedYieldResponse] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(50);
  const [showResults, setShowResults] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  
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
    
    // Trigger entry animation
    setShowAnimation(true);
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
          className: "bg-gradient-to-r from-green-50 to-blue-50 border-green-200 animate-enter"
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
    setShowAnimation(false);
    
    // Add slight delay before showing new scenario for animation effect
    setTimeout(() => {
      setCurrentScenario(scenarios[currentScenario.id % scenarios.length]);
      setShowAnimation(true);
    }, 300);
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
  
  // Helper for rendering Fed move button
  const renderFedMoveButton = (move: string) => {
    const isSelected = selectedFedMove === move;
    const getGradient = () => {
      switch (move) {
        case 'hike': return 'bg-gradient-to-r from-orange-500 to-red-500';
        case 'hold': return 'bg-gradient-to-r from-blue-500 to-indigo-500';
        case 'cut': return 'bg-gradient-to-r from-green-500 to-emerald-500';
        default: return 'bg-gray-100';
      }
    };
    
    return (
      <button
        key={move}
        onClick={() => !submitted && setSelectedFedMove(move)}
        disabled={submitted}
        className={`${
          isSelected
            ? `${getGradient()} text-white shadow-lg transform scale-105`
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
        } px-5 py-2.5 rounded-lg transition-all duration-300 font-medium animate-fade-in ${
          submitted ? 'opacity-70 cursor-not-allowed' : 'hover-lift'
        }`}
      >
        {move === 'hike' && <TrendingUp className="inline-block mr-1.5 h-4 w-4" />}
        {move === 'hold' && <span className="inline-block mr-1.5">⟷</span>}
        {move === 'cut' && <TrendingDown className="inline-block mr-1.5 h-4 w-4" />}
        {move.charAt(0).toUpperCase() + move.slice(1)}
      </button>
    );
  };

  // Helper for rendering yield response button
  const renderYieldResponseButton = (response: string) => {
    const isSelected = selectedYieldResponse === response;
    const getGradient = () => {
      switch (response) {
        case 'up': return 'bg-gradient-to-r from-rose-500 to-pink-500';
        case 'flat': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
        case 'down': return 'bg-gradient-to-r from-teal-500 to-green-500';
        default: return 'bg-gray-100';
      }
    };
    
    return (
      <button
        key={response}
        onClick={() => !submitted && setSelectedYieldResponse(response)}
        disabled={submitted}
        className={`${
          isSelected
            ? `${getGradient()} text-white shadow-lg transform scale-105`
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
        } px-5 py-2.5 rounded-lg transition-all duration-300 font-medium animate-fade-in ${
          submitted ? 'opacity-70 cursor-not-allowed' : 'hover-lift'
        }`}
      >
        {response === 'up' && <TrendingUp className="inline-block mr-1.5 h-4 w-4" />}
        {response === 'flat' && <span className="inline-block mr-1.5">⟷</span>}
        {response === 'down' && <TrendingDown className="inline-block mr-1.5 h-4 w-4" />}
        {response.charAt(0).toUpperCase() + response.slice(1)}
      </button>
    );
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 gradient-heading animate-fade-in">
          Scenario Game
        </h1>
        <p className="text-gray-600 animate-fade-in">Test your Fed policy prediction skills in real-world scenarios</p>
      </div>
      
      <DashboardCard 
        title={
          <span className="flex items-center">
            <Award className="h-5 w-5 text-amber-500 mr-2 animate-pulse" />
            {currentScenario.title}
          </span>
        } 
        className={`mb-6 card-rainbow relative overflow-hidden transition-all duration-500 ${
          showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/3 md:pr-6">
            <p className="mb-4 text-gray-700 leading-relaxed">{currentScenario.description}</p>
            <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-md inline-block border border-gray-200">
              <span className="font-medium">Scenario Date:</span> {currentScenario.date}
            </div>
            
            {!showResults ? (
              <div className="mt-6 animate-fade-in">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs mr-2">1</span> 
                  What will the Fed do?
                </h3>
                <div className="flex flex-wrap gap-3 mb-6">
                  {['hike', 'hold', 'cut'].map((move) => renderFedMoveButton(move))}
                </div>
                
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs mr-2">2</span>
                  How will the 10-Year Treasury yield respond?
                </h3>
                <div className="flex flex-wrap gap-3 mb-6">
                  {['up', 'flat', 'down'].map((response) => renderYieldResponseButton(response))}
                </div>
                
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs mr-2">3</span>
                  How confident are you? ({confidence}%)
                </h3>
                <div className="mb-2">
                  <Progress value={confidence} className="h-3 bg-gray-100" />
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="10"
                  value={confidence}
                  onChange={(e) => !submitted && setConfidence(parseInt(e.target.value))}
                  disabled={submitted}
                  className="w-full accent-primary mb-4"
                />
                
                <div className="relative mt-8 group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
                  <Button
                    onClick={handleSubmit}
                    disabled={submitted || loading}
                    className="relative bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white transition-all duration-300 w-full py-6"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-opacity-50 border-t-white rounded-full"></span>
                        Processing...
                      </span>
                    ) : submitted ? (
                      'Calculating Results...'
                    ) : (
                      'Submit Prediction'
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-6 animate-fade-in">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Award className="h-5 w-5 text-amber-500 mr-2" />
                  Actual Outcome
                </h3>
                <div className="p-6 border border-gray-200 rounded-lg bg-gradient-to-br from-gray-50 to-white shadow-sm hover-lift">
                  <p className="mb-4 flex items-center">
                    <span className="font-medium mr-2">Fed Action:</span> 
                    <span className="px-3 py-1 rounded-full text-sm bg-gray-100">
                      {currentScenario.outcomes.fedMove.charAt(0).toUpperCase() + currentScenario.outcomes.fedMove.slice(1)}
                    </span>
                    
                    {selectedFedMove === currentScenario.outcomes.fedMove ? (
                      <span className="text-green-500 ml-2 font-medium flex items-center animate-scale-in">
                        <CircleCheck className="h-5 w-5 mr-1" />
                        Correct
                      </span>
                    ) : (
                      <span className="text-red-500 ml-2 font-medium flex items-center animate-scale-in">
                        <CircleX className="h-5 w-5 mr-1" />
                        Incorrect
                      </span>
                    )}
                  </p>
                  
                  <p className="mb-4 flex items-center">
                    <span className="font-medium mr-2">Yield Response:</span> 
                    <span className="px-3 py-1 rounded-full text-sm bg-gray-100">
                      {currentScenario.outcomes.yieldResponse.charAt(0).toUpperCase() + currentScenario.outcomes.yieldResponse.slice(1)}
                    </span>
                    
                    {selectedYieldResponse === currentScenario.outcomes.yieldResponse ? (
                      <span className="text-green-500 ml-2 font-medium flex items-center animate-scale-in">
                        <CircleCheck className="h-5 w-5 mr-1" />
                        Correct
                      </span>
                    ) : (
                      <span className="text-red-500 ml-2 font-medium flex items-center animate-scale-in">
                        <CircleX className="h-5 w-5 mr-1" />
                        Incorrect
                      </span>
                    )}
                  </p>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg">
                    <p className="text-gray-700 italic leading-relaxed">{currentScenario.outcomes.explanation}</p>
                  </div>
                </div>
                
                <div className="mt-6 relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
                  <Button
                    onClick={resetGame}
                    className="relative bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-white transition-all duration-300 w-full"
                  >
                    Next Scenario
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="md:w-1/3 mt-6 md:mt-0">
            <div className="sticky top-4">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <TrendingUp className="h-5 w-5 text-primary mr-2" />
                10-Year Treasury Yield
              </h3>
              <div className={`h-[200px] bg-gradient-to-br from-white via-white to-blue-50 p-3 rounded-lg shadow-sm border border-blue-100 transition-all duration-500 ${showAnimation ? 'opacity-100' : 'opacity-0'} glow-effect`}>
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
              
              {showResults && (
                <div className="mt-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-100 animate-fade-in">
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                    <Award className="h-4 w-4 text-amber-500 mr-1.5" /> 
                    Your Score
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between mb-1 text-xs">
                        <span className="text-gray-600">Fed Move</span>
                        <span className={selectedFedMove === currentScenario.outcomes.fedMove ? "text-green-600" : "text-red-600"}>
                          {selectedFedMove === currentScenario.outcomes.fedMove ? "+50" : "0"} pts
                        </span>
                      </div>
                      <Progress 
                        value={selectedFedMove === currentScenario.outcomes.fedMove ? 100 : 0} 
                        className={`h-1.5 ${selectedFedMove === currentScenario.outcomes.fedMove ? "bg-green-100" : "bg-red-100"}`}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 text-xs">
                        <span className="text-gray-600">Yield Response</span>
                        <span className={selectedYieldResponse === currentScenario.outcomes.yieldResponse ? "text-green-600" : "text-red-600"}>
                          {selectedYieldResponse === currentScenario.outcomes.yieldResponse ? "+50" : "0"} pts
                        </span>
                      </div>
                      <Progress 
                        value={selectedYieldResponse === currentScenario.outcomes.yieldResponse ? 100 : 0} 
                        className={`h-1.5 ${selectedYieldResponse === currentScenario.outcomes.yieldResponse ? "bg-green-100" : "bg-red-100"}`}
                      />
                    </div>
                    <div className="border-t border-amber-100 pt-2 mt-2">
                      <div className="flex justify-between font-medium">
                        <span className="text-gray-800">Total</span>
                        <span className="text-amber-600">
                          {(selectedFedMove === currentScenario.outcomes.fedMove ? 50 : 0) + 
                          (selectedYieldResponse === currentScenario.outcomes.yieldResponse ? 50 : 0)} pts
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardCard>
    </Layout>
  );
};

export default ScenarioGame;
