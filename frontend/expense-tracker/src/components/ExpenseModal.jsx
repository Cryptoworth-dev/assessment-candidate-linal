import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import api from '../api/axios';

const ExpenseModal = ({ isOpen, onClose, expense, onSuccess }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (expense) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        date: expense.date
      });
    } else {
      setFormData({
        description: '',
        amount: '',
        category: '',
        date: ''
      });
    }
    setErrors({});
    setServerError('');
  }, [expense, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    const amt = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amt)) {
      newErrors.amount = 'Amount must be a number';
    } else if (amt <= 0) {
      newErrors.amount = 'Amount must be greater than zero';
    }

    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.date) newErrors.date = 'Date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError('');

    try {
      if (expense) {
        await api.put(`/expenses/${expense.id}`, formData);
      } else {
        await api.post('/expenses', formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      if (err.response && err.response.status === 422) {
        const backendErrors = err.response.data.errors;
        const mappedErrors = {};
        for (let key in backendErrors) {
          mappedErrors[key] = backendErrors[key][0];
        }
        setErrors(mappedErrors);
      } else {
        setServerError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '2.5rem' }}>
        <div className="modal-header" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {expense ? 'Edit Expense' : 'Add Expense'}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {serverError && <div className="error-text" style={{marginBottom: '1rem'}}>{serverError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Description <span style={{ color: 'var(--error)' }}>*</span>
            </label>
            <input 
              type="text"
              className="form-input"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="e.g. Team lunch at Chipotle"
            />
            {errors.description && <div className="error-text">{errors.description}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">
              Amount <span style={{ color: 'var(--error)' }}>*</span>
            </label>
            <div className="input-with-icon">
              <span>$</span>
              <input 
                type="number"
                step="0.01"
                className="form-input"
                style={{ width: '100%' }}
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
                placeholder="0.00"
              />
            </div>
            {errors.amount && <div className="error-text">{errors.amount}</div>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">
                Category <span style={{ color: 'var(--error)' }}>*</span>
              </label>
              <select 
                className="form-input"
                style={{ width: '100%' }}
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="">Select category...</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Utilities">Utilities</option>
                <option value="Rent">Rent</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Health">Health</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && <div className="error-text">{errors.category}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Date <span style={{ color: 'var(--error)' }}>*</span>
              </label>
              <input 
                type="date"
                className="form-input"
                style={{ width: '100%' }}
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
              {errors.date && <div className="error-text">{errors.date}</div>}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <button type="button" className="btn-outline" onClick={onClose} style={{ flex: 1, justifyContent: 'center', color: 'var(--text-primary)', fontWeight: 600 }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ flex: 1, justifyContent: 'center', backgroundColor: '#a7f3d0', color: '#065f46', fontWeight: 600 }}>
              <Save size={18} /> {isSubmitting ? 'Saving...' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
