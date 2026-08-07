import { Search, Plus, Download } from 'lucide-react';
import { format, subDays, startOfYear } from 'date-fns';

const FilterBar = ({ filters, setFilters, onAddClick, onExport }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleDateRangeChange = (e) => {
    const val = e.target.value;
    const today = new Date();
    let start_date = '';
    const end_date = format(today, 'yyyy-MM-dd');

    if (val === '10') {
      start_date = format(subDays(today, 10), 'yyyy-MM-dd');
    } else if (val === '30') {
      start_date = format(subDays(today, 30), 'yyyy-MM-dd');
    } else if (val === '90') {
      start_date = format(subDays(today, 90), 'yyyy-MM-dd');
    } else if (val === '365') {
      start_date = format(startOfYear(today), 'yyyy-MM-dd');
    }

    setFilters(prev => ({
      ...prev,
      start_date,
      end_date: val === '' ? '' : end_date,
      date_range: val
    }));
  };

  const currentRange = filters.date_range || '';

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
          value={currentRange}
          onChange={handleDateRangeChange}
        >
          <option value="">All Time</option>
          <option value="10">Last 10 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
          <option value="365">This Year</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button className="btn-outline" onClick={onExport}>
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
