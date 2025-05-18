import React from 'react';
import { 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar,
  ScatterChart,
  Scatter,
  AreaChart,
  Area,
  ZAxis
} from 'recharts';

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  formatter?: (value: number, name: string) => string;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({ active, payload, label, formatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 shadow-sm rounded-lg transition-all duration-300 animate-fade-in">
        <p className="text-sm font-medium text-gray-700">{`${label}`}</p>
        {payload.map((entry, index) => {
          const value = formatter ? formatter(entry.value, entry.name) : entry.value;
          return (
            <p 
              key={`item-${index}`} 
              className="text-sm" 
              style={{ color: entry.color }}
            >
              {`${entry.name}: ${value}`}
            </p>
          );
        })}
      </div>
    );
  }

  return null;
};

interface CustomBarChartProps {
  data: any[];
  bars: {
    dataKey: string;
    fill: string;
    name: string;
  }[];
  xAxisDataKey: string;
  height?: number;
  valueFormatter?: (value: number) => string;
}

export const CustomBarChart: React.FC<CustomBarChartProps> = ({
  data,
  bars,
  xAxisDataKey,
  height = 300,
  valueFormatter = (value) => `${value}`
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }} className="animate-fade-in">
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis 
          dataKey={xAxisDataKey} 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: '#6b7280' }}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: '#6b7280' }}
        />
        <Tooltip 
          content={({ active, payload, label }) => (
            <ChartTooltip 
              active={active} 
              payload={payload} 
              label={label} 
              formatter={(value, name) => valueFormatter(value)}
            />
          )} 
          animationDuration={300}
        />
        <Legend wrapperStyle={{ paddingTop: 15 }} />
        {bars.map((bar, index) => (
          <Bar 
            key={bar.dataKey} 
            dataKey={bar.dataKey} 
            name={bar.name} 
            fill={bar.fill} 
            radius={[4, 4, 0, 0]} 
            animationDuration={500 + (index * 100)}
            animationBegin={300 * index}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

interface CustomScatterChartProps {
  fedDots?: any[];
  aggregateDots?: any[];
  userDots?: any[];
  showFedDots?: boolean;
  showAggregateDots?: boolean;
  xDomain?: [number, number]; 
  yDomain?: [number, number];
  height?: number; 
  onClick?: (e: any) => void;
  xTicks?: number[];
  yTicks?: number[];
  xTickFormatter?: (value: number) => string;
  yTickFormatter?: (value: number) => string;
}

export const CustomScatterChart: React.FC<CustomScatterChartProps> = ({ 
  fedDots = [], 
  aggregateDots = [], 
  userDots = [],
  showFedDots = true,
  showAggregateDots = true,
  xDomain = [2023.5, 2027.5], 
  yDomain = [0, 6.25], 
  height = 300, 
  onClick,
  xTicks = [2024, 2025, 2026, 2027],
  yTicks = [0, 1, 2, 3, 4, 5, 6],
  xTickFormatter = (value: number) => value.toString(),
  yTickFormatter = (value: number) => `${value}%`
}) => {
  // Custom tooltip content renderer
  const renderTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-lg animate-fade-in">
          <p className="text-sm font-medium">{`Year: ${data.year === 2027 ? 'Long Run' : data.year}`}</p>
          <p className="text-sm" style={{ color: data.fill }}>
            {`Rate: ${data.displayRate || data.y}%`}
          </p>
          {data.label && (
            <p className="text-xs text-gray-600">{data.label}</p>
          )}
          {data.participant && !data.count && (
            <p className="text-xs text-gray-500">{data.participant}</p>
          )}
          {data.count && (
            <p className="text-xs text-gray-500">{`Votes: ${data.count}`}</p>
          )}
        </div>
      );
    }
    return null;
  };
  
  // Define dot shape renderer with fixed sizes for different dot types
  const renderDot = (props: any, type: 'fed' | 'aggregate' | 'user') => {
    const { cx, cy, fill } = props;
    
    // Fixed sizes by dot type
    const sizeMap = {
      fed: 5,
      aggregate: 8,
      user: 6
    };
    
    const opacityMap = {
      fed: 0.7,
      aggregate: 0.85,
      user: 0.9
    };
    
    const size = sizeMap[type];
    const opacity = opacityMap[type];

    return (
      <circle 
        cx={cx} 
        cy={cy} 
        r={size} 
        strokeWidth={1}
        stroke="#fff"
        fill={fill || "#2563EB"} 
        className="transition-all duration-300"
        style={{ opacity }}
      />
    );
  };
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart 
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }} 
        onClick={onClick} 
        className="animate-fade-in"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          type="number" 
          dataKey="x" 
          name="year" 
          domain={xDomain} 
          ticks={xTicks}
          axisLine={false}
          tickFormatter={xTickFormatter}
          tick={{ fontSize: 12, fill: '#6b7280' }}
        />
        <YAxis 
          type="number" 
          dataKey="y" 
          name="rate" 
          domain={yDomain} 
          ticks={yTicks}
          axisLine={false}
          tickFormatter={yTickFormatter}
          tick={{ fontSize: 12, fill: '#6b7280' }}
        />
        <Tooltip content={renderTooltip} />
        
        {/* Fed Dots */}
        {showFedDots && fedDots.length > 0 && (
          <Scatter 
            name="Fed Projections" 
            data={fedDots} 
            shape={(props) => renderDot(props, 'fed')}
          />
        )}
        
        {/* Aggregate Dots */}
        {showAggregateDots && aggregateDots.length > 0 && (
          <Scatter 
            name="Aggregate" 
            data={aggregateDots} 
            shape={(props) => renderDot(props, 'aggregate')}
          />
        )}
        
        {/* User Dots */}
        {userDots.length > 0 && (
          <Scatter 
            name="Your Forecast" 
            data={userDots} 
            shape={(props) => renderDot(props, 'user')}
          />
        )}
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export const CustomAreaChart: React.FC<any> = ({
  data,
  areas,
  xAxisDataKey,
  height = 300,
  valueFormatter = (value: number) => `${value}`
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        className="animate-fade-in"
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis 
          dataKey={xAxisDataKey} 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: '#6b7280' }}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: '#6b7280' }}
        />
        <Tooltip
          content={({ active, payload, label }) => (
            <ChartTooltip 
              active={active} 
              payload={payload} 
              label={label} 
              formatter={(value, name) => valueFormatter(value)}
            />
          )}
          animationDuration={300}
        />
        <Legend wrapperStyle={{ paddingTop: 15 }} />
        {areas.map((area: any, index: number) => (
          <Area
            key={area.dataKey}
            type="monotone"
            dataKey={area.dataKey}
            name={area.name}
            stroke={area.stroke}
            fill={area.fill}
            fillOpacity={0.3}
            activeDot={{ r: 6 }}
            animationDuration={800}
            animationBegin={300 * index}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};
