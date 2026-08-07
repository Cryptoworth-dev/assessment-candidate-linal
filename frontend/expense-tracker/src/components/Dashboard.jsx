import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

import FilterBar from './FilterBar';
import ExpenseList from './ExpenseList';
import ExpenseModal from './ExpenseModal';
import DashboardWidgets from './DashboardWidgets';

const Dashboard = () => {
  const [summary, setSummary] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [pagination, setPagination] = useState(null);


  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    start_date: '',
    end_date: '',
    page: 1,
    sort_by: 'date',
    sort_dir: 'desc'
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const fetchData = useCallback(async () => {
    try {

      const expensesRes = await api.get('/expenses', { params: filters });
      setExpenses(expensesRes.data.data.data);
      setPagination(expensesRes.data.data);

      const summaryRes = await api.get('/expenses/summary', { params: filters });
      setSummary(summaryRes.data.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }, [filters]);

  const handleSort = (column) => {
    setFilters(prev => {
      if (prev.sort_by === column) {
        return { ...prev, sort_dir: prev.sort_dir === 'asc' ? 'desc' : 'asc', page: 1 };
      }
      return { ...prev, sort_by: column, sort_dir: 'asc', page: 1 };
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleOpenAddModal = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      fetchData();
    } catch (err) {
      console.error('Error deleting expense', err);
      alert('Failed to delete expense.');
    }
  };

  const handleExport = async () => {
    try {
      const res = await api.get('/expenses/export', { 
        params: filters,
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'expenses.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error('Error exporting CSV', err);
      alert('Failed to export expenses.');
    }
  };

  return (
    <div className="app-container">
      <FilterBar 
        filters={filters} 
        setFilters={(newFilters) => {
             setFilters(prev => {
               const updated = typeof newFilters === 'function' ? newFilters(prev) : newFilters;
               if (updated.search !== prev.search || updated.category !== prev.category || updated.start_date !== prev.start_date || updated.end_date !== prev.end_date) {
                 updated.page = 1;
               }
               return updated;
             });
        }} 
        onAddClick={handleOpenAddModal}
        onExport={handleExport}
      />
      
      <ExpenseList 
        expenses={expenses} 
        pagination={pagination}
        filters={filters}
        onPageChange={handlePageChange}
        onSort={handleSort}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
      />

      <div style={{ marginTop: '2rem' }}>
        <DashboardWidgets summary={summary} expenses={expenses} filters={filters} setFilters={setFilters} />
      </div>

      <ExpenseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        expense={editingExpense}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default Dashboard;
