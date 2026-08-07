import React from 'react';
import { DollarSign, PieChart } from 'lucide-react';

const SummaryCards = ({ summary }) => {
  return (
    <div className="summary-grid">
      <div className="glass-card stat-card">
        <div className="stat-icon">
          <DollarSign size={24} />
        </div>
        <div className="stat-details">
          <h3>Total Spend</h3>
          <p>${summary?.total_spend?.toFixed(2) || '0.00'}</p>
        </div>
      </div>
      
      <div className="glass-card stat-card">
        <div className="stat-icon">
          <PieChart size={24} />
        </div>
        <div className="stat-details">
          <h3>Top Category</h3>
          <p>
            {summary?.by_category && Object.keys(summary.by_category).length > 0 
              ? Object.entries(summary.by_category).sort((a,b) => b[1] - a[1])[0][0]
              : 'N/A'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
