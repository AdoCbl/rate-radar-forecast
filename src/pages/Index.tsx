
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import DashboardCard from '@/components/DashboardCard';
import SentimentChart from '@/components/SentimentChart';
import DotPlot from '@/components/DotPlot';
import { useToast } from "@/components/ui/use-toast";
import { ArrowUp, ArrowDown, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

// Sample data for the sentiment chart
const sentimentData = [
  { date: 'Jan 2023', hikes: 70, holds: 25, cuts: 5 },
  { date: 'Mar 2023', hikes: 65, holds: 30, cuts: 5 },
  { date: 'May 2023', hikes: 45, holds: 45, cuts: 10 },
  { date: 'Jun 2023', hikes: 35, holds: 55, cuts: 10 },
  { date: 'Jul 2023', hikes: 25, holds: 60, cuts: 15 },
  { date: 'Sep 2023', hikes: 15, holds: 65, cuts: 20 },
  { date: 'Nov 2023', hikes: 5, holds: 75, cuts: 20 },
  { date: 'Dec 2023', hikes: 0, holds: 70, cuts: 30 },
  { date: 'Jan 2024', hikes: 0, holds: 65, cuts: 35 },
  { date: 'Mar 2024', hikes: 0, holds: 55, cuts: 45 },
  { date: 'May 2024', hikes: 0, holds: 40, cuts: 60 },
];

// Sample data for the fed dot plot
const existingDots = [
  { x: 2023, y: 5.25, year: 2023, displayRate: '5.25', fill: '#2563EB', participant: 'Fed Member A' },
  { x: 2023, y: 5.0, year: 2023, displayRate: '5.00', fill: '#2563EB', participant: 'Fed Member B' },
  { x: 2023, y: 5.25, year: 2023, displayRate: '5.25', fill: '#2563EB', participant: 'Fed Member C' },
  { x: 2024, y: 4.5, year: 2024, displayRate: '4.50', fill: '#2563EB', participant: 'Fed Member A' },
  { x: 2024, y: 4.25, year: 2024, displayRate: '4.25', fill: '#2563EB', participant: 'Fed Member B' },
  { x: 2024, y: 4.0, year: 2024, displayRate: '4.00', fill: '#2563EB', participant: 'Fed Member C' },
  { x: 2025, y: 3.5, year: 2025, displayRate: '3.50', fill: '#2563EB', participant: 'Fed Member A' },
  { x: 2025, y: 3.25, year: 2025, displayRate: '3.25', fill: '#2563EB', participant: 'Fed Member B' },
  { x: 2025, y: 3.0, year: 2025, displayRate: '3.00', fill: '#2563EB', participant: 'Fed Member C' },
];

// Generate aggregated dot plot data
const aggregateDots = [
  { x: 2023, y: 5.25, year: 2023, displayRate: '5.25', fill: 'rgba(37, 99, 235, 0.8)', count: 2, label: '2023 Median: 5.25%' },
  { x: 2024, y: 4.25, year: 2024, displayRate: '4.25', fill: 'rgba(37, 99, 235, 0.8)', count: 3, label: '2024 Median: 4.25%' },
  { x: 2025, y: 3.25, year: 2025, displayRate: '3.25', fill: 'rgba(37, 99, 235, 0.8)', count: 3, label: '2025 Median: 3.25%' },
];

const Dashboard = () => {
  const { toast } = useToast();
  const [userDots, setUserDots] = useState<any[]>([]);
  const [selectedRate, setSelectedRate] = useState<string>("cuts");
  const [showFedDots, setShowFedDots] = useState<boolean>(true);
  const [showAggregateDots, setShowAggregateDots] = useState<boolean>(false);
  
  // Current sentiment data
  const currentSentiment = {
    hikes: 0,
    holds: 40,
    cuts: 60,
  };
  
  // Function to determine arrow direction and color based on sentiment
  const getSentimentIndicator = (type: 'hikes' | 'holds' | 'cuts') => {
    const current = currentSentiment[type];
    const previous = sentimentData[sentimentData.length - 2][type];
    
    if (type === 'hikes') {
      if (current > previous) {
        return <ArrowUp className="text-red-500" />; // Bearish for rate hikes going up
      } else if (current < previous) {
        return <ArrowDown className="text-green-500" />; // Bullish for rate hikes going down
      }
    } else if (type === 'cuts') {
      if (current > previous) {
        return <ArrowUp className="text-green-500" />; // Bullish for rate cuts going up
      } else if (current < previous) {
        return <ArrowDown className="text-red-500" />; // Bearish for rate cuts going down
      }
    } else {
      // For holds
      if (current > previous) {
        return <ArrowUp className="text-amber-500" />;
      } else if (current < previous) {
        return <ArrowDown className="text-amber-500" />;
      }
    }
    
    return <ArrowRight className="text-amber-500" />;
  };
  
  // Handle forecast submission
  const handleSaveForecast = (dots: any[]) => {
    setUserDots(dots);
    toast({
      title: "Forecast Submitted",
      description: "Your rate prediction has been saved.",
    });
  };

  // Determine which dots to display
  const dotsToDisplay = () => {
    if (!showFedDots && !showAggregateDots) {
      return [];
    }
    
    if (showFedDots && !showAggregateDots) {
      return existingDots;
    }
    
    if (!showFedDots && showAggregateDots) {
      return aggregateDots;
    }
    
    // Both are visible
    return [...existingDots, ...aggregateDots];
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Monitor Fed policy sentiment and make your own rate forecasts</p>
      </div>
      
      {/* Rate Selection Toggle */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select rate outlook:</label>
        <ToggleGroup 
          type="single" 
          value={selectedRate} 
          onValueChange={(value) => {
            if (value) setSelectedRate(value);
          }}
          className="justify-start"
        >
          <ToggleGroupItem value="hikes" className="bg-red-100 data-[state=on]:bg-red-200 data-[state=on]:text-red-800">
            Hike
          </ToggleGroupItem>
          <ToggleGroupItem value="holds" className="bg-amber-100 data-[state=on]:bg-amber-200 data-[state=on]:text-amber-800">
            Hold
          </ToggleGroupItem>
          <ToggleGroupItem value="cuts" className="bg-green-100 data-[state=on]:bg-green-200 data-[state=on]:text-green-800">
            Cut
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <DashboardCard 
          title="Hike" 
          className={cn(
            "md:col-span-1 transition-all duration-300",
            selectedRate === "hikes" ? "ring-2 ring-red-400 shadow-lg" : ""
          )}
          titleClassName="text-red-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-red-500">{currentSentiment.hikes}%</p>
              <p className="text-sm text-gray-500">Expecting rate hikes</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
              {getSentimentIndicator('hikes')}
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Hold" 
          className={cn(
            "md:col-span-1 transition-all duration-300",
            selectedRate === "holds" ? "ring-2 ring-amber-400 shadow-lg" : ""
          )}
          titleClassName="text-amber-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-amber-500">{currentSentiment.holds}%</p>
              <p className="text-sm text-gray-500">Expecting rate holds</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center animate-pulse">
              {getSentimentIndicator('holds')}
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Cut" 
          className={cn(
            "md:col-span-1 transition-all duration-300",
            selectedRate === "cuts" ? "ring-2 ring-green-400 shadow-lg" : ""
          )}
          titleClassName="text-green-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-green-500">{currentSentiment.cuts}%</p>
              <p className="text-sm text-gray-500">Expecting rate cuts</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center animate-pulse">
              {getSentimentIndicator('cuts')}
            </div>
          </div>
        </DashboardCard>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard 
          title="Historical Rate Sentiment" 
          className="lg:col-span-1 bg-gradient-to-br from-white to-gray-50"
        >
          <SentimentChart historicalData={sentimentData} />
        </DashboardCard>
        
        <DashboardCard 
          title="Fed Dot Plot & Your Forecast" 
          className="lg:col-span-1 bg-gradient-to-br from-white to-blue-50"
          action={
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Toggle 
                  pressed={showFedDots} 
                  onPressedChange={setShowFedDots}
                  size="sm"
                  className="data-[state=on]:bg-blue-200"
                >
                  {showFedDots ? <Eye size={14} className="text-blue-700" /> : <EyeOff size={14} />}
                </Toggle>
                <span className="text-xs text-gray-500">Fed Dots</span>
              </div>
              <div className="flex items-center space-x-1">
                <Toggle 
                  pressed={showAggregateDots} 
                  onPressedChange={setShowAggregateDots}
                  size="sm"
                  className="data-[state=on]:bg-purple-200"
                >
                  {showAggregateDots ? <Eye size={14} className="text-purple-700" /> : <EyeOff size={14} />}
                </Toggle>
                <span className="text-xs text-gray-500">Aggregate</span>
              </div>
            </div>
          }
        >
          <DotPlot 
            existingDots={dotsToDisplay()} 
            onSave={handleSaveForecast}
          />
        </DashboardCard>
      </div>
    </Layout>
  );
};

export default Dashboard;
