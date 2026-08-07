import React, { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip as PieTooltip, Legend, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as LineTooltip
} from 'recharts';
import { format, parseISO } from 'date-fns';

const COLORS = ['#2ecc71', '#3498db', '#f1c40f', '#e74c3c', '#9b59b6', '#34495e'];

const Charts = ({ summary, expenses }) => {
  // Prepare data for Pie Chart
  const pieData = useMemo(() => {
    if (!summary?.by_category) return [];
    return Object.entries(summary.by_category).map(([name, value]) => ({
      name,
      value
    }));
  }, [summary]);

  // Prepare data for Line Chart (spending over time from visible expenses)
  const lineData = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];
    
    // Group by date
    const grouped = expenses.reduce((acc, curr) => {
      const date = curr.date; // YYYY-MM-DD
      acc[date] = (acc[date] || 0) + parseFloat(curr.amount);
      return acc;
    }, {});

    // Sort by date ascending and format
    return Object.entries(grouped)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .map(([dateStr, total]) => ({
        date: format(parseISO(dateStr), 'MMM dd'),
        amount: total
      }));
  }, [expenses]);

  return (
    <div className="glass-card" style={{ marginBottom: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Spending Insights</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Pie Chart */}
        <div style={{ height: '300px' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>By Category</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <PieTooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#999'}}>No data available</div>
          )}
        </div>

        {/* Line Chart */}
        <div style={{ height: '300px' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Over Time</h3>
          {lineData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
                <XAxis dataKey="date" tick={{fontSize: 12, fill: 'var(--text-secondary)'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: 'var(--text-secondary)'}} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                <LineTooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Spent']} />
                <Line type="monotone" dataKey="amount" stroke="var(--primary-green)" strokeWidth={3} dot={{r: 4, fill: 'var(--primary-green)'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#999'}}>No data available</div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Charts;
