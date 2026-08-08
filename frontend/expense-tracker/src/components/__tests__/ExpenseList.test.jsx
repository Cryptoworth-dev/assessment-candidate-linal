import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ExpenseList from '../ExpenseList';

describe('ExpenseList Component', () => {
  const mockExpenses = [
    {
      id: 1,
      description: 'Grocery Shopping',
      category: 'Food',
      date: '2023-10-15',
      amount: '120.50'
    },
    {
      id: 2,
      description: 'Uber Ride',
      category: 'Transport',
      date: '2023-10-16',
      amount: '15.00'
    }
  ];

  const mockPagination = {
    current_page: 1,
    last_page: 2,
    from: 1,
    to: 2,
    total: 12
  };

  const defaultProps = {
    expenses: [],
    pagination: null,
    filters: { sort_by: 'date', sort_dir: 'desc' },
    onPageChange: vi.fn(),
    onSort: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn()
  };

  it('renders empty state when no expenses', () => {
    render(<ExpenseList {...defaultProps} />);
    expect(screen.getByText('No expenses found matching your criteria.')).toBeInTheDocument();
  });

  it('renders a list of expenses', () => {
    render(<ExpenseList {...defaultProps} expenses={mockExpenses} />);
    
    expect(screen.getByText('Grocery Shopping')).toBeInTheDocument();
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('$120.50')).toBeInTheDocument();

    expect(screen.getByText('Uber Ride')).toBeInTheDocument();
    expect(screen.getByText('Transport')).toBeInTheDocument();
    expect(screen.getByText('$15.00')).toBeInTheDocument();
  });

  it('calls onSort when column headers are clicked', () => {
    render(<ExpenseList {...defaultProps} expenses={mockExpenses} />);
    
    fireEvent.click(screen.getByText(/Date/i));
    expect(defaultProps.onSort).toHaveBeenCalledWith('date');

    fireEvent.click(screen.getByText(/Amount/i));
    expect(defaultProps.onSort).toHaveBeenCalledWith('amount');
  });

  it('calls onEdit when edit button is clicked', () => {
    render(<ExpenseList {...defaultProps} expenses={mockExpenses} />);
    
    const editButtons = screen.getAllByRole('button', { name: 'Edit' });
    fireEvent.click(editButtons[0]);
    
    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockExpenses[0]);
  });

  it('calls onDelete when delete button is clicked and confirmed', () => {
    // Mock window.confirm
    vi.stubGlobal('confirm', vi.fn(() => true));
    
    render(<ExpenseList {...defaultProps} expenses={mockExpenses} />);
    
    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    fireEvent.click(deleteButtons[1]);
    
    expect(defaultProps.onDelete).toHaveBeenCalledWith(mockExpenses[1].id);
    
    vi.unstubAllGlobals();
  });

  it('renders pagination controls correctly', () => {
    render(<ExpenseList {...defaultProps} expenses={mockExpenses} pagination={mockPagination} />);
    
    expect(screen.getByText('Showing 1 to 2 of 12 entries')).toBeInTheDocument();
    
    const nextButton = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(nextButton);
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
  });
});
