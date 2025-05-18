
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import DashboardCard from '@/components/DashboardCard';
import SentimentChart from '@/components/SentimentChart';
import DotPlot from '@/components/DotPlot';
import { useToast } from "@/components/ui/use-toast";
import { ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';

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

const Dashboard = () => {
  const { toast } = useToast();
  const [userDots, setUserDots] = useState<any[]>([]);
  
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
    
    if (current > previous) {
      return <ArrowUp className="text-red-500" />;
    } else if (current < previous) {
      return <ArrowDown className="text-green-500" />;
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

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Monitor Fed policy sentiment and make your own rate forecasts</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <DashboardCard title="Rate Hike Sentiment" className="md:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-red-500">{currentSentiment.hikes}%</p>
              <p className="text-sm text-gray-500">Expecting rate hikes</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              {getSentimentIndicator('hikes')}
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Rate Hold Sentiment" className="md:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-amber-500">{currentSentiment.holds}%</p>
              <p className="text-sm text-gray-500">Expecting rate holds</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              {getSentimentIndicator('holds')}
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Rate Cut Sentiment" className="md:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-green-500">{currentSentiment.cuts}%</p>
              <p className="text-sm text-gray-500">Expecting rate cuts</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              {getSentimentIndicator('cuts')}
            </div>
          </div>
        </DashboardCard>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard title="Historical Rate Sentiment" className="lg:col-span-1">
          <SentimentChart historicalData={sentimentData} />
        </DashboardCard>
        
        <DashboardCard 
          title="Fed Dot Plot & Your Forecast" 
          className="lg:col-span-1"
          action={
            <span className="text-xs text-gray-500">Click to place your dots</span>
          }
        >
          <DotPlot 
            existingDots={existingDots} 
            onSave={handleSaveForecast}
          />
        </DashboardCard>
      </div>
    </Layout>
  );
};

export default Dashboard;
