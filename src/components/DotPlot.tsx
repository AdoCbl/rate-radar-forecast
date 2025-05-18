
import React, { useState, useRef, useEffect } from 'react';
import { CustomScatterChart } from './ChartComponents';
import { Button } from '@/components/ui/button';
import { yearTicks, yearTickLabels, rateTicks } from '@/data/dotPlotData';
import { useToast } from '@/hooks/use-toast';
import ReactConfetti from 'react-confetti';

interface DotPlotProps {
  fedDots?: any[];
  aggregateDots?: any[];
  existingUserDots?: any[];
  showFedDots?: boolean;
  showAggregateDots?: boolean;
  onSave?: (dots: any[]) => void;
  readOnly?: boolean;
}

const DotPlot: React.FC<DotPlotProps> = ({ 
  fedDots = [], 
  aggregateDots = [], 
  existingUserDots = [], 
  showFedDots = true,
  showAggregateDots = true,
  onSave, 
  readOnly = false 
}) => {
  const { toast } = useToast();
  const [userDots, setUserDots] = useState<any[]>(existingUserDots || []);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [rewardText, setRewardText] = useState('');
  const [showReward, setShowReward] = useState(false);
  
  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth || 500,
        height: window.innerHeight
      });
    }

    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth || 500,
          height: window.innerHeight
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [containerRef.current]);
  
  // Handle dot placement with enhanced sensitivity
  const handleChartClick = (e: any) => {
    if (readOnly) return;
    
    // If we don't have exact coordinates, skip
    if (!e) return;
    
    // Get the click position values
    const clickX = e.xValue || 0;
    const clickY = e.yValue || 0;
    
    // Find the closest year tick (with more tolerance)
    let closestYear = yearTicks[0];
    let minYearDist = Math.abs(clickX - yearTicks[0]);
    
    for (const year of yearTicks) {
      const dist = Math.abs(clickX - year);
      if (dist < minYearDist) {
        minYearDist = dist;
        closestYear = year;
      }
    }
    
    // Only proceed if within reasonable distance of a valid year tick
    if (minYearDist > 0.5) return;
    
    // Find closest rate tick (with more tolerance)
    let closestRateIndex = 0;
    let minRateDist = Math.abs(clickY - rateTicks[0]);
    
    for (let i = 0; i < rateTicks.length; i++) {
      const dist = Math.abs(clickY - rateTicks[i]);
      if (dist < minRateDist) {
        minRateDist = dist;
        closestRateIndex = i;
      }
    }
    
    // Snap to the closest valid position
    const year = closestYear;
    const rate = rateTicks[closestRateIndex];
    
    // Check if we already have a dot for this year
    const existingDotIndex = userDots.findIndex(dot => dot.year === year);
    
    if (existingDotIndex >= 0) {
      // Update existing dot
      const updatedDots = [...userDots];
      updatedDots[existingDotIndex] = {
        ...updatedDots[existingDotIndex],
        y: rate,
        displayRate: rate.toFixed(2),
        animated: true,
      };
      setUserDots(updatedDots);
    } else {
      // Add new dot with animation flag
      const newDot = {
        x: year,
        y: rate,
        year,
        displayRate: rate.toFixed(2),
        fill: '#EC4899',
        participant: 'Your Forecast',
        animated: true,
      };
      setUserDots([...userDots, newDot]);
    }
  };
  
  const handleTagSelection = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  // Generate a random encouragement message
  const getRewardMessage = (dotCount: number) => {
    const messages = [
      "Great job! Your predictions are now on the chart!",
      "Excellent forecast submitted!",
      `${dotCount} dots plotted successfully!`,
      "Your insights have been recorded!",
      "Forecast received! Keep up the good work!",
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
  };
  
  const handleSubmit = () => {
    if (onSave) {
      const dotsWithTags = userDots.map(dot => ({
        ...dot,
        tags: selectedTags,
      }));
      
      onSave(dotsWithTags);
      
      // Show celebration effects
      setShowConfetti(true);
      
      // Display random reward message
      const message = getRewardMessage(userDots.length);
      setRewardText(message);
      setShowReward(true);
      
      // Show reward toast
      toast({
        title: "Forecast Submitted!",
        description: `Your ${userDots.length} predictions have been recorded.`,
        className: "bg-gradient-to-r from-blue-50 to-green-50 border-green-200 animate-enter"
      });
      
      // Clear confetti and reward message after delay
      setTimeout(() => {
        setShowConfetti(false);
        setShowReward(false);
      }, 4000);
    }
  };
  
  const clearDots = () => {
    setUserDots([]);
    setSelectedTags([]);
  };
  
  const reasoningTags = [
    'Inflation Concerns', 
    'Labor Market Strength', 
    'Financial Stability', 
    'Economic Growth',
    'Global Risks',
    'Manufacturing Weakness',
    'Housing Market',
    'Consumer Spending'
  ];

  return (
    <div ref={containerRef} className="relative">
      {showConfetti && (
        <ReactConfetti 
          width={dimensions.width}
          height={dimensions.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.15}
          colors={['#EC4899', '#8B5CF6', '#2563EB', '#10B981', '#F59E0B']}
        />
      )}
      
      {showReward && (
        <div className="absolute top-1/3 left-0 right-0 text-center z-10 pointer-events-none animate-fade-in">
          <div className="inline-block bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg shadow-lg transform animate-bounce">
            {rewardText}
          </div>
        </div>
      )}
      
      <div className="h-[260px] transition-all duration-500 relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-30">
          <div className="w-full h-full dot-grid"></div>
        </div>
        
        <CustomScatterChart
          fedDots={fedDots}
          aggregateDots={aggregateDots}
          userDots={userDots}
          showFedDots={showFedDots}
          showAggregateDots={showAggregateDots}
          xDomain={[yearTicks[0] - 0.5, yearTicks[yearTicks.length - 1] + 0.5]}
          yDomain={[0, 6.25]}
          xTicks={yearTicks}
          yTicks={[0, 1, 2, 3, 4, 5, 6]}
          onClick={handleChartClick}
          xTickFormatter={(value: number) => yearTickLabels[value as keyof typeof yearTickLabels] || value.toString()}
          yTickFormatter={(value: number) => `${value}%`}
        />
      </div>
      
      {!readOnly && (
        <div className="mt-1.5">
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex flex-wrap gap-1.5 flex-1 max-h-16 overflow-y-auto pb-1">
              {reasoningTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagSelection(tag)}
                  className={`px-2.5 py-1 text-xs rounded-full transition-all duration-300 ${
                    selectedTags.includes(tag)
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-sm transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                  } hover-lift`}
                >
                  {tag}
                </button>
              ))}
            </div>
            
            <div className="flex space-x-2 mt-1.5 sm:mt-0">
              <Button
                variant="outline"
                onClick={clearDots}
                className="text-xs h-8 px-3 transition-all duration-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 shine-effect"
              >
                Clear
              </Button>
              
              <div className="relative group">
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-md blur opacity-30 group-hover:opacity-60 transition duration-500 ${userDots.length === 0 ? 'opacity-10' : ''}`}></div>
                <Button
                  onClick={handleSubmit}
                  className={`relative text-xs h-8 px-3 bg-gradient-to-r from-primary to-secondary text-white 
                    ${userDots.length > 0 ? 'hover:opacity-90 hover:scale-105' : 'opacity-70'} 
                    transition-all duration-300 shadow-sm hover:shadow`}
                  disabled={userDots.length === 0}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {userDots.length > 0 && !readOnly && (
        <div className="mt-2 text-xs text-gray-500 animate-fade-in">
          <p>Click on the chart to place or move dots. {userDots.length} dot{userDots.length !== 1 ? 's' : ''} placed.</p>
        </div>
      )}
    </div>
  );
};

export default DotPlot;
