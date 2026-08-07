import { Search, Plus, Download } from 'lucide-react';

const FilterBar = ({ filters, setFilters, onAddClick }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <div style={{ position: 'relative', flex: '2 1 300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-light)' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search descriptions..." 
            name="search"
            value={filters.search}
            onChange={handleChange}
            style={{ paddingLeft: '40px', width: '100%' }}
          />
        </div>
        
        <select 
          className="filter-select" 
          name="category"
          value={filters.category}
          onChange={handleChange}
          style={{ flex: '1 1 150px' }}
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
        
        <select 
          className="filter-select" 
          style={{ flex: '1 1 150px' }}
        >
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
          <option value="365">This Year</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button className="btn-outline">
          <Download size={16} /> Export as CSV
        </button>
        <button className="btn-primary" onClick={onAddClick}>
          <Plus size={18} /> Add New Expense
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
