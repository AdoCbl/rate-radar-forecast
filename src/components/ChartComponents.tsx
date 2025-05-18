
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
  Area
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
      <div className="bg-white p-4 border border-gray-200 shadow-sm rounded-lg">
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
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
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
        />
        <Legend wrapperStyle={{ paddingTop: 15 }} />
        {bars.map((bar) => (
          <Bar 
            key={bar.dataKey} 
            dataKey={bar.dataKey} 
            name={bar.name} 
            fill={bar.fill} 
            radius={[4, 4, 0, 0]} 
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export const CustomScatterChart: React.FC<any> = ({ 
  data, 
  xDomain, 
  yDomain, 
  height = 300, 
  onClick,
  xTicks,
  yTicks,
  xTickFormatter,
  yTickFormatter
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }} onClick={onClick}>
        <CartesianGrid strokeDasharray="3 3" />
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
        <Tooltip 
          cursor={{ strokeDasharray: '3 3' }} 
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-lg">
                  <p className="text-sm font-medium">{`Year: ${data.year || data.x}`}</p>
                  <p className="text-sm" style={{ color: data.fill }}>
                    {`Rate: ${data.displayRate || data.y}%`}
                  </p>
                  {data.participant && (
                    <p className="text-xs text-gray-500">{data.participant}</p>
                  )}
                </div>
              );
            }
            return null;
          }}
        />
        <Scatter 
          data={data} 
          fill="#2563EB" 
          shape={(props) => {
            const { cx, cy, fill } = props;
            return (
              <circle 
                cx={cx} 
                cy={cy} 
                r={6} 
                strokeWidth={1}
                stroke="#fff"
                fill={fill || "#2563EB"} 
              />
            );
          }}
        />
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
        />
        <Legend wrapperStyle={{ paddingTop: 15 }} />
        {areas.map((area: any) => (
          <Area
            key={area.dataKey}
            type="monotone"
            dataKey={area.dataKey}
            name={area.name}
            stroke={area.stroke}
            fill={area.fill}
            fillOpacity={0.3}
            activeDot={{ r: 6 }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};
