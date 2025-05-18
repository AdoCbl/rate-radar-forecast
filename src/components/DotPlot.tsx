
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
  
  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth || 500,
        height: window.innerHeight
      });
    }
  }, [containerRef.current]);
  
  // Handle dot placement
  const handleChartClick = (e: any) => {
    if (readOnly) return;
    
    // Ignore clicks outside the chart area
    if (!e || !e.xValue || e.xValue < yearTicks[0] || e.xValue > yearTicks[yearTicks.length-1]) return;
    
    // Find closest year and rate tick
    const year = Math.round(e.xValue);
    const rateIndex = rateTicks.findIndex(r => r >= e.yValue) - 1;
    const rate = rateTicks[rateIndex >= 0 ? rateIndex : 0];
    
    // Check if we already have a dot for this year
    const existingDotIndex = userDots.findIndex(dot => dot.year === year);
    
    if (existingDotIndex >= 0) {
      // Update existing dot
      const updatedDots = [...userDots];
      updatedDots[existingDotIndex] = {
        ...updatedDots[existingDotIndex],
        y: rate,
        displayRate: rate.toFixed(2),
      };
      setUserDots(updatedDots);
    } else {
      // Add new dot
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
  
  const handleSubmit = () => {
    if (onSave) {
      onSave(userDots.map(dot => ({
        ...dot,
        tags: selectedTags,
      })));
      
      // Show celebration effects
      setShowConfetti(true);
      
      // Show reward toast
      toast({
        title: "Forecast Submitted!",
        description: `Your ${userDots.length} predictions have been recorded.`,
        className: "bg-gradient-to-r from-blue-50 to-green-50 border-green-200"
      });
      
      // Clear confetti after 4 seconds
      setTimeout(() => setShowConfetti(false), 4000);
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
      
      <div className="h-[260px] transition-all duration-500">
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
            <div className="flex flex-wrap gap-1 flex-1 max-h-16 overflow-y-auto pb-1">
              {reasoningTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagSelection(tag)}
                  className={`px-2 py-0.5 text-xs rounded-full transition-all duration-300 ${
                    selectedTags.includes(tag)
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-sm transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            
            <div className="flex space-x-2 mt-1.5 sm:mt-0">
              <Button
                variant="outline"
                onClick={clearDots}
                className="text-xs h-7 px-2 transition-all duration-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              >
                Clear
              </Button>
              <Button
                onClick={handleSubmit}
                className={`text-xs h-7 px-3 bg-gradient-to-r from-primary to-secondary text-white 
                  ${userDots.length > 0 ? 'hover:opacity-90 hover:scale-105' : 'opacity-70'} 
                  transition-all duration-300 shadow-sm hover:shadow`}
                disabled={userDots.length === 0}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DotPlot;
