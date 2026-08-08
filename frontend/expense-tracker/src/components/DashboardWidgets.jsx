import { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { CATEGORY_COLORS } from '../utils/constants';

const DashboardWidgets = ({ summary, filters, setFilters }) => {
  const [activeChart, setActiveChart] = useState('category');

  const activeLineColor = filters?.category && CATEGORY_COLORS[filters.category]
    ? CATEGORY_COLORS[filters.category]
    : '#10b981';

  const categoryData = useMemo(() => {
    if (!summary?.by_category) return [];

    const sorted = Object.entries(summary.by_category)
      .sort((a, b) => b[1] - a[1]);

    return sorted.map(([name, val]) => ({
      name,
      value: val
    }));
  }, [summary]);

  const lineData = useMemo(() => {
    if (!summary?.over_time) return [];

    return summary.over_time.map(item => ({
      date: format(parseISO(item.date), 'MMM d'),
      amount: item.total
    }));
  }, [summary]);

  return (
    <div className="widget-card" style={{ height: '500px', width: '100%' }}>
      <div className="widget-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <select
            className="filter-select"
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.9rem' }}
            value={activeChart}
            onChange={(e) => setActiveChart(e.target.value)}
          >
            <option value="category">Spending by Category</option>
            <option value="time">Spending Over Time</option>
          </select>
        </div>

        {activeChart === 'time' && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select
              className="filter-select"
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
              value={filters?.category || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value, page: 1 }))}
            >
              <option value="">All Categories</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Utilities">Utilities</option>
              <option value="Rent">Rent</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Health">Health</option>
              <option value="Other">Other</option>
            </select>
          </div>
        )}
      </div>

      <div style={{ flex: 1, position: 'relative' }}>
        {activeChart === 'category' ? (
          categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={130}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#64748b'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ lineHeight: '32px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>No category data available</div>
          )
        ) : (
          lineData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeLineColor} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={activeLineColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} padding={{ left: 10, right: 10 }} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Spent']} />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke={activeLineColor}
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>No data available</div>
          )
        )}
      </div>
    </div>
  );
};

export default DashboardWidgets;
