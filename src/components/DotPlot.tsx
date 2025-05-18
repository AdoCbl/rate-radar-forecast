
import React, { useState } from 'react';
import { CustomScatterChart } from './ChartComponents';
import { Button } from '@/components/ui/button';
import { yearTicks, yearTickLabels, rateTicks } from '@/data/dotPlotData';

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
  const [userDots, setUserDots] = useState<any[]>(existingUserDots || []);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
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
  
  const handleSave = () => {
    if (onSave) {
      onSave(userDots.map(dot => ({
        ...dot,
        tags: selectedTags,
      })));
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
    <div>
      <div className="h-[280px] transition-all duration-500">
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
        <>
          <div className="mt-2">
            <div className="flex flex-wrap justify-between items-center">
              <div className="flex flex-wrap gap-1.5 flex-1">
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
              
              <div className="flex space-x-2 mt-2 sm:mt-0">
                <Button
                  variant="outline"
                  onClick={clearDots}
                  className="text-xs h-8 px-2 transition-all duration-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                >
                  Clear
                </Button>
                <Button
                  onClick={handleSave}
                  className="text-xs h-8 px-3 bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-all duration-300 shadow-sm hover:shadow"
                  disabled={userDots.length === 0}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DotPlot;
