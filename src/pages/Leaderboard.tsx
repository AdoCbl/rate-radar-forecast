
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import DashboardCard from '@/components/DashboardCard';
import { ChevronUp, ChevronDown, Trophy } from 'lucide-react';

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

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('all-time');
  
  // Function to get badge color
  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Top Forecaster':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hot Streak':
        return 'bg-red-100 text-red-800';
      case 'Consistent':
        return 'bg-blue-100 text-blue-800';
      case 'Rate Expert':
        return 'bg-purple-100 text-purple-800';
      case 'Yield Guru':
        return 'bg-green-100 text-green-800';
      case 'Scenario Master':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to render rank change indicator
  const renderRankChange = (change: number) => {
    if (change === 0) return <span className="text-gray-400">-</span>;
    if (change > 0) {
      return <div className="flex items-center text-green-500"><ChevronUp size={16} />{change}</div>;
    }
    return <div className="flex items-center text-red-500"><ChevronDown size={16} />{Math.abs(change)}</div>;
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
        <p className="text-gray-600">See how your forecasting skills rank against other players</p>
      </div>
      
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8 -mb-px" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
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
      
      <DashboardCard title="Top Players" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
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
              {leaderboardData.map((player) => (
                <tr key={player.name} className={player.name === 'UserDemo' ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {player.rank === 1 ? (
                      <div className="flex items-center">
                        <Trophy size={16} className="text-yellow-500 mr-1" />
                        <span className="text-gray-900 font-medium">{player.rank}</span>
                      </div>
                    ) : (
                      <span className="text-gray-900">{player.rank}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-accent-light flex items-center justify-center text-primary font-semibold mr-3">
                        {player.name.charAt(0)}
                      </div>
                      <span className={`${player.name === 'UserDemo' ? 'font-medium' : ''}`}>
                        {player.name}
                        {player.name === 'UserDemo' && <span className="ml-2 text-xs text-blue-500">(You)</span>}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {player.score.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${player.accuracy}%` }}
                        />
                      </div>
                      <span className="text-gray-900">{player.accuracy}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderRankChange(player.change)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-2">
                      {player.badges.map((badge) => (
                        <span 
                          key={badge} 
                          className={`px-2 py-1 text-xs rounded-full ${getBadgeColor(badge)}`}
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </Layout>
  );
};

export default Leaderboard;
