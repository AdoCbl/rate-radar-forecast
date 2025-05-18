
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import DashboardCard from '@/components/DashboardCard';
import SentimentChart from '@/components/SentimentChart';
import DotPlot from '@/components/DotPlot';
import { useToast } from "@/components/ui/use-toast";
import { ArrowUp, ArrowDown, ArrowRight, Eye, EyeOff, Star } from 'lucide-react';
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
  { x: 2024, y: 5.25, year: 2024, displayRate: '5.25', fill: '#2563EB', participant: 'Fed Member A' },
  { x: 2024, y: 5.0, year: 2024, displayRate: '5.00', fill: '#2563EB', participant: 'Fed Member B' },
  { x: 2024, y: 5.25, year: 2024, displayRate: '5.25', fill: '#2563EB', participant: 'Fed Member C' },
  { x: 2025, y: 4.5, year: 2025, displayRate: '4.50', fill: '#2563EB', participant: 'Fed Member A' },
  { x: 2025, y: 4.25, year: 2025, displayRate: '4.25', fill: '#2563EB', participant: 'Fed Member B' },
  { x: 2025, y: 4.0, year: 2025, displayRate: '4.00', fill: '#2563EB', participant: 'Fed Member C' },
  { x: 2026, y: 3.5, year: 2026, displayRate: '3.50', fill: '#2563EB', participant: 'Fed Member A' },
  { x: 2026, y: 3.25, year: 2026, displayRate: '3.25', fill: '#2563EB', participant: 'Fed Member B' },
  { x: 2026, y: 3.0, year: 2026, displayRate: '3.00', fill: '#2563EB', participant: 'Fed Member C' },
  { x: 2027, y: 2.5, year: 2027, displayRate: '2.50', fill: '#2563EB', participant: 'Fed Member A' },
  { x: 2027, y: 2.75, year: 2027, displayRate: '2.75', fill: '#2563EB', participant: 'Fed Member B' },
  { x: 2027, y: 2.5, year: 2027, displayRate: '2.50', fill: '#2563EB', participant: 'Fed Member C' },
];

// Generate aggregated dot plot data - use purple color to distinguish from Fed dots (blue) and user dots (pink)
const aggregateDots = [
  { x: 2024, y: 5.25, year: 2024, displayRate: '5.25', fill: '#9333EA', count: 2, label: '2024 Median: 5.25%' },
  { x: 2025, y: 4.25, year: 2025, displayRate: '4.25', fill: '#9333EA', count: 3, label: '2025 Median: 4.25%' },
  { x: 2026, y: 3.25, year: 2026, displayRate: '3.25', fill: '#9333EA', count: 3, label: '2026 Median: 3.25%' },
  { x: 2027, y: 2.5, year: 2027, displayRate: '2.50', fill: '#9333EA', count: 2, label: 'Long Run Median: 2.50%' },
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
    const dots = [];
    
    if (showFedDots) {
      dots.push(...existingDots);
    }
    
    if (showAggregateDots) {
      dots.push(...aggregateDots);
    }
    
    return dots;
  };
  
  // Handle card selection for rate type
  const handleCardSelect = (rateType: string) => {
    setSelectedRate(rateType);
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold gradient-heading">Fed Rate Dashboard</h1>
        <p className="text-gray-600">Monitor Fed policy sentiment and make your own rate forecasts</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <DashboardCard 
          title="Hike" 
          className={cn(
            "md:col-span-1 transition-all duration-300 border-red-100/50",
            selectedRate === "hikes" ? "ring-2 ring-red-400 shadow-lg bg-gradient-to-br from-white to-red-50" : "bg-white hover:bg-red-50/30"
          )}
          titleClassName="text-red-700"
          isSelectable={true}
          isSelected={selectedRate === "hikes"}
          onClick={() => handleCardSelect("hikes")}
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
            "md:col-span-1 transition-all duration-300 border-amber-100/50",
            selectedRate === "holds" ? "ring-2 ring-amber-400 shadow-lg bg-gradient-to-br from-white to-amber-50" : "bg-white hover:bg-amber-50/30"
          )}
          titleClassName="text-amber-700"
          isSelectable={true}
          isSelected={selectedRate === "holds"}
          onClick={() => handleCardSelect("holds")}
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
            "md:col-span-1 transition-all duration-300 border-green-100/50",
            selectedRate === "cuts" ? "ring-2 ring-green-400 shadow-lg bg-gradient-to-br from-white to-green-50" : "bg-white hover:bg-green-50/30"
          )}
          titleClassName="text-green-700"
          isSelectable={true}
          isSelected={selectedRate === "cuts"}
          onClick={() => handleCardSelect("cuts")}
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
          className="lg:col-span-1 bg-gradient-to-br from-white via-white to-gray-50 border-blue-100/50"
        >
          <SentimentChart historicalData={sentimentData} />
        </DashboardCard>
        
        <DashboardCard 
          title="Fed Dot Plot & Your Forecast" 
          className="lg:col-span-1 bg-gradient-to-br from-white via-white to-blue-50 border-blue-100/50"
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
                  {showAggregateDots ? <Star size={14} className="text-purple-700" /> : <EyeOff size={14} />}
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
