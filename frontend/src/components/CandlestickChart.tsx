import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Bar } from 'recharts';
import { CandlestickData } from '@/components/ui/csvParser';

interface CandlestickChartProps {
  data: CandlestickData[];
  showVolume?: boolean;
}

const CandlestickChart = ({ data, showVolume = true }: CandlestickChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-96 bg-gradient-to-b from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">📊 Load data to see the chart</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis 
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            domain={['dataMin - 5', 'dataMax + 5']}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)'
            }}
            formatter={(value: any) => [`$${value.toFixed(2)}`, '']}
          />
          <Legend />
          
          <Line 
            type="monotone" 
            dataKey="high" 
            stroke="hsl(var(--success))" 
            strokeWidth={1}
            dot={false}
            name="High"
          />
          <Line 
            type="monotone" 
            dataKey="low" 
            stroke="hsl(var(--destructive))" 
            strokeWidth={1}
            dot={false}
            name="Low"
          />
          
          <Line 
            type="monotone" 
            dataKey="close" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--primary))', r: 3 }}
            fill="url(#colorPrice)"
            name="Close"
          />
        </ComposedChart>
      </ResponsiveContainer>

      {showVolume && (
        <ResponsiveContainer width="100%" height={100}>
          <ComposedChart data={data} margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value: any) => [value.toLocaleString(), 'Volume']}
            />
            <Bar dataKey="volume" fill="hsl(var(--secondary))" opacity={0.6} />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CandlestickChart;
