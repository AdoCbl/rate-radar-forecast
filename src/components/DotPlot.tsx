
import React, { useState } from 'react';
import { CustomScatterChart } from './ChartComponents';
import { Button } from '@/components/ui/button';

// Generate year ticks for x-axis (2023, 2024, 2025)
const yearTicks = [2023, 2024, 2025, 2026];

// Generate rate ticks for y-axis (0% to 6% in 0.25% steps)
const generateRateTicks = () => {
  const ticks = [];
  for (let i = 0; i <= 6; i += 0.25) {
    ticks.push(parseFloat(i.toFixed(2)));
  }
  return ticks;
};

const rateTicks = generateRateTicks();

interface DotPlotProps {
  existingDots?: any[];
  onSave?: (dots: any[]) => void;
  readOnly?: boolean;
}

const DotPlot: React.FC<DotPlotProps> = ({ existingDots = [], onSave, readOnly = false }) => {
  const [userDots, setUserDots] = useState<any[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Combine existing dots and user dots for display
  const allDots = [...existingDots, ...userDots];
  
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
        participant: 'Your Forecast'
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
      <div className="h-[350px]">
        <CustomScatterChart
          data={allDots}
          xDomain={[yearTicks[0] - 0.5, yearTicks[yearTicks.length - 1] + 0.5]}
          yDomain={[0, 6.25]}
          xTicks={yearTicks}
          yTicks={[0, 1, 2, 3, 4, 5, 6]}
          onClick={handleChartClick}
          xTickFormatter={(value: number) => value.toString()}
          yTickFormatter={(value: number) => `${value}%`}
        />
      </div>
      
      {!readOnly && (
        <>
          <div className="my-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Select reasoning (optional):</p>
            <div className="flex flex-wrap gap-2">
              {reasoningTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagSelection(tag)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-4 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={clearDots}
              className="text-sm"
            >
              Clear
            </Button>
            <Button
              onClick={handleSave}
              className="text-sm bg-primary text-white hover:bg-primary/90"
              disabled={userDots.length === 0}
            >
              Save Forecast
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default DotPlot;
