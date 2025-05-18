
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import DashboardCard from '@/components/DashboardCard';
import SentimentChart from '@/components/SentimentChart';
import DotPlot from '@/components/DotPlot';
import { useToast } from "@/components/ui/use-toast";
import { Star, Eye, EyeOff } from 'lucide-react';
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { fedMemberDots, aggregateDots, sampleUserDots } from '@/data/dotPlotData';

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
  
  // Handle card selection for rate type
  const handleCardSelect = (rateType: string) => {
    setSelectedRate(rateType);
    
    // Show toast notification based on selection
    const messages = {
      hikes: "Rate hikes currently at 0%",
      holds: "Rate holds trending at 40%",
      cuts: "Rate cuts forecasted at 60%"
    };
    
    toast({
      title: `${rateType.charAt(0).toUpperCase() + rateType.slice(1)} Selected`,
      description: messages[rateType as keyof typeof messages],
    });
  };
  
  // Handle forecast submission
  const handleSaveForecast = (dots: any[]) => {
    setUserDots(dots);
    toast({
      title: "Forecast Submitted",
      description: "Your rate prediction has been saved.",
      className: "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200"
    });
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
            "md:col-span-1 transition-all duration-500 border-red-100/50",
            selectedRate === "hikes" 
              ? "ring-2 ring-red-400 shadow-lg bg-gradient-to-br from-white to-red-50" 
              : "bg-white hover:bg-red-50/30"
          )}
          titleClassName="text-red-700"
          isSelectable={true}
          isSelected={selectedRate === "hikes"}
          onClick={() => handleCardSelect("hikes")}
          hoverEffect="glow"
        >
          <div className="flex items-center justify-between">
            <div className="text-center w-full">
              <p className="text-3xl font-bold text-red-500 animate-pulse">{currentSentiment.hikes}%</p>
              <p className="text-sm text-gray-500 mt-1">Expecting rate hikes</p>
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Hold" 
          className={cn(
            "md:col-span-1 transition-all duration-500 border-amber-100/50",
            selectedRate === "holds" 
              ? "ring-2 ring-amber-400 shadow-lg bg-gradient-to-br from-white to-amber-50" 
              : "bg-white hover:bg-amber-50/30"
          )}
          titleClassName="text-amber-700"
          isSelectable={true}
          isSelected={selectedRate === "holds"}
          onClick={() => handleCardSelect("holds")}
          hoverEffect="glow"
        >
          <div className="flex items-center justify-between">
            <div className="text-center w-full">
              <p className="text-3xl font-bold text-amber-500">{currentSentiment.holds}%</p>
              <p className="text-sm text-gray-500 mt-1">Expecting rate holds</p>
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Cut" 
          className={cn(
            "md:col-span-1 transition-all duration-500 border-green-100/50",
            selectedRate === "cuts" 
              ? "ring-2 ring-green-400 shadow-lg bg-gradient-to-br from-white to-green-50" 
              : "bg-white hover:bg-green-50/30"
          )}
          titleClassName="text-green-700"
          isSelectable={true}
          isSelected={selectedRate === "cuts"}
          onClick={() => handleCardSelect("cuts")}
          hoverEffect="glow"
        >
          <div className="flex items-center justify-between">
            <div className="text-center w-full">
              <p className="text-3xl font-bold text-green-500">{currentSentiment.cuts}%</p>
              <p className="text-sm text-gray-500 mt-1">Expecting rate cuts</p>
            </div>
          </div>
        </DashboardCard>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard 
          title="Historical Rate Sentiment" 
          className="lg:col-span-1 bg-gradient-to-br from-white via-white to-gray-50 border-blue-100/50 hover-lift"
        >
          <SentimentChart historicalData={sentimentData} />
        </DashboardCard>
        
        <DashboardCard 
          title="Fed Dot Plot & Your Forecast" 
          className="lg:col-span-1 bg-gradient-to-br from-white via-white to-blue-50 border-blue-100/50 hover-lift"
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
            fedDots={fedMemberDots}
            aggregateDots={aggregateDots}
            existingUserDots={userDots}
            showFedDots={showFedDots}
            showAggregateDots={showAggregateDots}
            onSave={handleSaveForecast}
          />
        </DashboardCard>
      </div>
    </Layout>
  );
};

export default Dashboard;
