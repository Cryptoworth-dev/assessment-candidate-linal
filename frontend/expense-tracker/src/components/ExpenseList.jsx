import { format, parseISO } from 'date-fns';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { CATEGORY_COLORS } from '../utils/constants';

// Helper for applying opacity to hex colors
const hexToRgba = (hex, opacity) => {
  if (!hex) return 'rgba(107, 114, 128, 0.15)'; // Default gray with opacity
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const ExpenseList = ({ expenses, pagination, filters, onPageChange, onSort, onEdit, onDelete }) => {
  const renderSortIcon = (column) => {
    if (filters?.sort_by !== column) {
      return <ArrowDown size={14} color="#d1d5db" style={{ display: 'inline', marginLeft: '4px', verticalAlign: 'text-bottom' }} />;
    }
    return filters.sort_dir === 'asc' 
      ? <ArrowUp size={14} color="var(--primary-green)" style={{ display: 'inline', marginLeft: '4px', verticalAlign: 'text-bottom' }} /> 
      : <ArrowDown size={14} color="var(--primary-green)" style={{ display: 'inline', marginLeft: '4px', verticalAlign: 'text-bottom' }} />;
  };

  const getPageNumbers = () => {
    if (!pagination) return [];
    let start = Math.max(1, pagination.current_page - 2);
    let end = Math.min(pagination.last_page, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th style={{ width: '40%' }}>Description</th>
            <th style={{ width: '15%' }}>Category</th>
            <th onClick={() => onSort('date')} style={{ width: '15%', cursor: 'pointer', userSelect: 'none' }}>
              Date {renderSortIcon('date')}
            </th>
            <th onClick={() => onSort('amount')} style={{ width: '15%', cursor: 'pointer', userSelect: 'none' }}>
              Amount {renderSortIcon('amount')}
            </th>
            <th style={{ width: '15%', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length > 0 ? (
            expenses.map((expense) => {
              const catColor = CATEGORY_COLORS[expense.category] || '#6b7280';
              const badgeBg = hexToRgba(catColor, 0.15); // 15% opacity

              return (
                <tr key={expense.id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{expense.description}</td>
                  <td>
                    <span 
                      className="badge"
                      style={{ backgroundColor: badgeBg, color: catColor }}
                    >
                      {expense.category}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{format(parseISO(expense.date), 'MMM dd, yyyy')}</td>
                  <td className="amount-col">${parseFloat(expense.amount).toFixed(2)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      onClick={() => onEdit(expense)} 
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', marginRight: '1rem', fontSize: '0.85rem' }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => {
                        if(window.confirm('Are you sure you want to delete this expense?')) {
                          onDelete(expense.id);
                        }
                      }} 
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)', fontSize: '0.85rem' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                No expenses found matching your criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {pagination && (
        <div className="pagination-container">
          <span className="pagination-text">
            Showing {pagination.from || 0} to {pagination.to || 0} of {pagination.total} entries
          </span>
          <div className="pagination-controls">
            <button 
              className="page-btn" 
              disabled={pagination.current_page === 1}
              onClick={() => onPageChange(pagination.current_page - 1)}
            >
              Prev
            </button>
            
            {/* Dynamic page numbers */}
            {getPageNumbers().map(pageNum => (
              <button 
                key={pageNum}
                className={`page-btn ${pagination.current_page === pageNum ? 'active' : ''}`}
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </button>
            ))}

            <button 
              className="page-btn" 
              disabled={pagination.current_page === pagination.last_page || pagination.last_page === 0}
              onClick={() => onPageChange(pagination.current_page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
