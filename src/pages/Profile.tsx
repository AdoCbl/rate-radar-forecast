
import React from 'react';
import Layout from '@/components/Layout';
import DashboardCard from '@/components/DashboardCard';
import { Progress } from "@/components/ui/progress";
import { CustomAreaChart } from '@/components/ChartComponents';

// Sample user data
const userData = {
  name: 'User Demo',
  rank: 'Novice',
  totalScore: 840,
  rankNumber: 6,
  accuracy: 68,
  gamesPlayed: 42,
  winStreak: 3,
  badges: [
    { name: 'Novice', description: 'Completed 10+ predictions', icon: '🔰' },
    { name: 'Dot Master', description: 'Placed dots with 80%+ accuracy', icon: '🎯' },
    { name: 'Quick Study', description: 'Improved accuracy by 10%+ in a month', icon: '📈' },
  ],
  progressToNextRank: 65,
  nextRank: 'Apprentice',
  recentActivity: [
    { date: 'May 15', event: 'Completed "Inflation Surprise" scenario', points: '+120' },
    { date: 'May 12', event: 'Submitted Fed dot plot forecast', points: '+85' },
    { date: 'May 8', event: 'Completed "Banking Sector Stress" scenario', points: '+150' },
    { date: 'May 3', event: 'Achieved "Quick Study" badge', points: '+50' },
  ],
  accuracyHistory: [
    { month: 'Dec', accuracy: 45 },
    { month: 'Jan', accuracy: 52 },
    { month: 'Feb', accuracy: 58 },
    { month: 'Mar', accuracy: 60 },
    { month: 'Apr', accuracy: 64 },
    { month: 'May', accuracy: 68 },
  ]
};

// Configure accuracy chart
const accuracyChartConfig = {
  areas: [
    {
      dataKey: 'accuracy',
      name: 'Forecast Accuracy',
      stroke: '#2563EB',
      fill: 'url(#accuracyGradient)'
    }
  ]
};

const Profile = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold gradient-heading">Profile Dashboard</h1>
        <p className="text-gray-600">View your forecasting stats, badges and progress</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <DashboardCard 
          title="User Stats" 
          className="lg:col-span-1 card-glass"
          hoverEffect="glow"
        >
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-md animate-float">
              {userData.name.charAt(0)}
            </div>
            <h3 className="text-lg font-medium">{userData.name}</h3>
            <p className="text-gray-500">{userData.rank}</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Score</span>
                <span className="text-sm text-gray-500">{userData.totalScore.toLocaleString()} pts</span>
              </div>
              <Progress value={userData.totalScore / 20} className="h-2 bg-blue-100" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Accuracy</span>
                <span className="text-sm text-gray-500">{userData.accuracy}%</span>
              </div>
              <Progress value={userData.accuracy} className="h-2 bg-blue-100" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-3 bg-gradient-to-br from-white to-blue-50 rounded-lg border border-blue-100/40 shadow-sm">
                <p className="text-2xl font-bold text-primary">{userData.gamesPlayed}</p>
                <p className="text-xs text-gray-500">Games Played</p>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-white to-purple-50 rounded-lg border border-purple-100/40 shadow-sm">
                <p className="text-2xl font-bold text-secondary">{userData.winStreak}</p>
                <p className="text-xs text-gray-500">Win Streak</p>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Progress to {userData.nextRank}</span>
                <span className="text-sm text-gray-500">{userData.progressToNextRank}%</span>
              </div>
              <Progress value={userData.progressToNextRank} className="h-2 bg-blue-100" />
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Accuracy Trend" 
          className="lg:col-span-1 card-rainbow"
          hoverEffect="lift"
        >
          <div className="relative bg-white rounded-lg p-4">
            <div className="h-[220px]">
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
                <defs>
                  <linearGradient id="accuracyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
              </svg>
              <CustomAreaChart
                data={userData.accuracyHistory}
                areas={accuracyChartConfig.areas}
                xAxisDataKey="month"
                valueFormatter={(value) => `${value}%`}
              />
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Badges & Achievements" 
          className="lg:col-span-1 card-glass"
          hoverEffect="shine"
        >
          <div className="space-y-4">
            {userData.badges.map((badge) => (
              <div key={badge.name} className="flex items-start p-3 bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-100/40 shadow-sm hover-scale">
                <div className="text-2xl mr-3 bg-gray-50 w-10 h-10 flex items-center justify-center rounded-full shadow-inner">{badge.icon}</div>
                <div>
                  <h4 className="font-medium text-gray-900">{badge.name}</h4>
                  <p className="text-xs text-gray-500">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center pt-2">
            <p className="text-sm text-gray-500">3 of 12 badges earned</p>
            <Progress value={25} className="h-2 mt-1 bg-blue-100" />
          </div>
        </DashboardCard>
      </div>
      
      <DashboardCard 
        title="Recent Activity" 
        className="bg-gradient-to-br from-white to-gray-50 border border-gray-100/40"
        hoverEffect="none"
      >
        <div className="divide-y divide-gray-200">
          {userData.recentActivity.map((item, index) => (
            <div key={index} className="py-3 flex justify-between hover:bg-gray-50/50 px-2 rounded-md transition-colors">
              <div>
                <p className="font-medium">{item.event}</p>
                <p className="text-sm text-gray-500">{item.date}</p>
              </div>
              <div className="text-green-500 font-medium bg-green-50 px-2 py-1 rounded-md h-fit">{item.points}</div>
            </div>
          ))}
        </div>
      </DashboardCard>
    </Layout>
  );
};

export default Profile;
