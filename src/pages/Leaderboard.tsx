
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import DashboardCard from '@/components/DashboardCard';
import { ChevronUp, ChevronDown, Trophy, Medal, Award, Star } from 'lucide-react';
import { BadgeProps, Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Sample leaderboard data
const leaderboardData = [
  { rank: 1, name: 'EconWhiz', score: 1250, accuracy: 87, change: 0, badges: ['Top Forecaster', 'Hot Streak'] },
  { rank: 2, name: 'MarketSage', score: 1145, accuracy: 83, change: 1, badges: ['Consistent'] },
  { rank: 3, name: 'FedWatcher', score: 1080, accuracy: 79, change: -1, badges: ['Rate Expert'] },
  { rank: 4, name: 'BondTrader', score: 950, accuracy: 74, change: 2, badges: ['Yield Guru'] },
  { rank: 5, name: 'MacroMaven', score: 925, accuracy: 72, change: 0, badges: ['Scenario Master'] },
  { rank: 6, name: 'UserDemo', score: 840, accuracy: 68, change: -2, badges: ['Novice'] },
  { rank: 7, name: 'InflationHawk', score: 780, accuracy: 65, change: 1, badges: [] },
  { rank: 8, name: 'RecessWatcher', score: 720, accuracy: 62, change: 0, badges: [] },
  { rank: 9, name: 'DataNerd', score: 685, accuracy: 60, change: -1, badges: [] },
  { rank: 10, name: 'NewTrader', score: 640, accuracy: 57, change: 0, badges: [] },
];

// Define tabs
const tabs = [
  { id: 'all-time', name: 'All Time' },
  { id: 'monthly', name: 'Monthly' },
  { id: 'scenarios', name: 'Scenarios' },
];

// Custom badge component with enhanced styling
const LeaderboardBadge = ({ badge }: { badge: string }) => {
  const getBadgeProps = (badge: string): BadgeProps => {
    switch (badge) {
      case 'Top Forecaster':
        return {
          variant: "default",
          className: "bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-none",
        };
      case 'Hot Streak':
        return {
          variant: "secondary",
          className: "bg-gradient-to-r from-red-400 to-pink-500 text-white border-none",
        };
      case 'Consistent':
        return {
          variant: "outline",
          className: "bg-gradient-to-r from-blue-200 to-blue-300 text-blue-700 border-blue-300",
        };
      case 'Rate Expert':
        return {
          variant: "outline",
          className: "bg-gradient-to-r from-purple-200 to-purple-300 text-purple-700 border-purple-300",
        };
      case 'Yield Guru':
        return {
          variant: "outline",
          className: "bg-gradient-to-r from-green-200 to-green-300 text-green-700 border-green-300",
        };
      case 'Scenario Master':
        return {
          variant: "outline",
          className: "bg-gradient-to-r from-teal-200 to-teal-300 text-teal-700 border-teal-300",
        };
      default:
        return {
          variant: "outline",
          className: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300",
        };
    }
  };

  const badgeProps = getBadgeProps(badge);

  return (
    <Badge {...badgeProps}>
      {badge}
    </Badge>
  );
};

// Component for the podium visualization
const Podium = () => {
  const topThree = leaderboardData.slice(0, 3);
  
  return (
    <div className="flex justify-center items-end h-48 mb-8 mt-2">
      {topThree.map((player, idx) => {
        // Calculate podium dimensions
        const heights = { 0: 'h-40', 1: 'h-32', 2: 'h-24' };
        const positions = { 0: 'order-2', 1: 'order-1', 2: 'order-3' };
        const medals = { 
          0: <Trophy className="h-8 w-8 text-yellow-500" />, 
          1: <Medal className="h-7 w-7 text-gray-400" />, 
          2: <Award className="h-7 w-7 text-amber-700" /> 
        };
        
        return (
          <div key={player.name} className={`flex flex-col items-center mx-2 ${positions[idx]}`}>
            <div className="flex flex-col items-center justify-center mb-2 animate-fade-in">
              {medals[idx]}
              <div className="mt-1 font-bold">{player.name}</div>
              <div className="text-sm text-gray-600">{player.score} pts</div>
            </div>
            <div 
              className={`w-24 ${heights[idx]} rounded-t-lg flex items-center justify-center
                ${idx === 0 ? 'bg-gradient-to-b from-yellow-300 to-yellow-500' : 
                  idx === 1 ? 'bg-gradient-to-b from-gray-300 to-gray-500' :
                  'bg-gradient-to-b from-amber-500 to-amber-700'}
                shadow-lg transform transition-all duration-500 hover:brightness-110`}
            >
              <span className="font-bold text-white text-2xl">{player.rank}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('all-time');
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  // Function to render rank change indicator
  const renderRankChange = (change: number) => {
    if (change === 0) return <span className="text-gray-400">-</span>;
    if (change > 0) {
      return <div className="flex items-center text-green-500 animate-fade-in"><ChevronUp size={16} />{change}</div>;
    }
    return <div className="flex items-center text-red-500 animate-fade-in"><ChevronDown size={16} />{Math.abs(change)}</div>;
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500">Leaderboard</h1>
        <p className="text-gray-600">See how your forecasting skills rank against other players</p>
      </div>
      
      <div className="mb-4 border-b border-gray-200">
        <nav className="flex space-x-8 -mb-px" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-300
                ${activeTab === tab.id 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
      
      <Podium />
      
      <DashboardCard 
        title="Top Players" 
        className="overflow-hidden bg-gradient-to-br from-white via-white to-blue-50"
        titleClassName="text-lg font-semibold text-blue-800"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Badges</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaderboardData.map((player, index) => {
                const isUserPlayer = player.name === 'UserDemo';
                const isTopThree = player.rank <= 3;
                
                // Determine row background style based on rank
                let bgStyle = '';
                if (isTopThree) {
                  const gradients = [
                    'hover:bg-gradient-to-r hover:from-yellow-50 hover:to-amber-50 bg-yellow-50/50',
                    'hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-100 bg-gray-50/50',
                    'hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 bg-amber-50/50'
                  ];
                  bgStyle = gradients[player.rank - 1];
                } else if (isUserPlayer) {
                  bgStyle = 'bg-blue-50 hover:bg-blue-100';
                } else {
                  bgStyle = 'hover:bg-gray-50';
                }
                
                return (
                  <tr 
                    key={player.name} 
                    className={cn(
                      bgStyle,
                      'transition-all duration-300 transform',
                      hoveredRow === index ? 'scale-[1.01]' : ''
                    )}
                    onMouseEnter={() => setHoveredRow(index)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isTopThree ? (
                        <div className="flex items-center">
                          {player.rank === 1 && <Trophy size={18} className="text-yellow-500 mr-1.5" />}
                          {player.rank === 2 && <Medal size={18} className="text-gray-400 mr-1.5" />}
                          {player.rank === 3 && <Award size={18} className="text-amber-700 mr-1.5" />}
                          <span className={cn(
                            "font-medium",
                            player.rank === 1 ? "text-yellow-700" : 
                            player.rank === 2 ? "text-gray-700" : 
                            "text-amber-800"
                          )}>
                            {player.rank}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-900">{player.rank}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center text-white font-semibold mr-3",
                          isUserPlayer 
                            ? "bg-gradient-to-br from-blue-400 to-blue-600" 
                            : player.rank === 1 
                              ? "bg-gradient-to-br from-yellow-400 to-amber-600"
                              : "bg-gradient-to-br from-purple-400 to-primary"
                        )}>
                          {player.name.charAt(0)}
                        </div>
                        <span className={`${isUserPlayer ? 'font-medium' : ''}`}>
                          {player.name}
                          {isUserPlayer && (
                            <span className="ml-2 inline-flex items-center gap-0.5 text-xs text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-full">
                              <Star size={10} className="text-blue-500" />
                              <span>You</span>
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        "font-mono tabular-nums font-medium",
                        isTopThree ? "text-primary" : "text-gray-700"
                      )}>
                        {player.score.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2 overflow-hidden">
                          <div 
                            className={cn(
                              "h-2.5 rounded-full transition-all duration-1000",
                              player.rank === 1 ? "bg-gradient-to-r from-green-400 to-green-600" :
                              player.rank <= 3 ? "bg-gradient-to-r from-blue-400 to-primary" :
                              "bg-primary"
                            )}
                            style={{ 
                              width: `${player.accuracy}%`,
                              animation: hoveredRow === index ? 'pulse 2s infinite' : 'none'
                            }}
                          />
                        </div>
                        <span className="text-gray-900">{player.accuracy}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderRankChange(player.change)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1.5">
                        {player.badges.map((badge) => (
                          <LeaderboardBadge key={badge} badge={badge} />
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-center mt-4 p-4 bg-gradient-to-r from-white via-white to-blue-50 border-t border-gray-100">
          <div className="flex items-center justify-center text-center text-gray-500 text-xs">
            <span className="ml-2">
              Rankings update daily. Play more scenarios to improve your position!
            </span>
          </div>
        </div>
      </DashboardCard>
    </Layout>
  );
};

export default Leaderboard;
