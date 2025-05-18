
import React from 'react';
import { CustomBarChart } from './ChartComponents';

interface SentimentChartProps {
  historicalData: any[];
}

const SentimentChart: React.FC<SentimentChartProps> = ({ historicalData }) => {
  // Mapping for display names
  const displayNames = {
    hikes: 'Rate Hikes',
    holds: 'Rate Holds',
    cuts: 'Rate Cuts'
  };

  // Configure bars for the chart
  const bars = [
    {
      dataKey: 'hikes',
      name: displayNames.hikes,
      fill: '#ef4444', // Red for hikes
    },
    {
      dataKey: 'holds',
      name: displayNames.holds,
      fill: '#f59e0b', // Amber for holds
    },
    {
      dataKey: 'cuts',
      name: displayNames.cuts,
      fill: '#22c55e', // Green for cuts
    },
  ];

  return (
    <div>
      <CustomBarChart
        data={historicalData}
        bars={bars}
        xAxisDataKey="date"
        height={250}
        valueFormatter={(value) => `${value}%`}
      />
    </div>
  );
};

export default SentimentChart;
