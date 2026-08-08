import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Signin from '../Signin';
import api from '../../api/axios';

describe('Signin Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderSignin = () => {
    render(
      <BrowserRouter>
        <Signin />
      </BrowserRouter>
    );
  };

  it('renders the signin form', () => {
    renderSignin();
    expect(screen.getByRole('heading', { name: 'Welcome Back' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address *')).toBeInTheDocument();
    expect(screen.getByLabelText('Password *')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('displays validation errors when fields are empty', async () => {
    renderSignin();
    const button = screen.getByRole('button', { name: 'Sign In' });
    fireEvent.click(button);
  });

  it('handles successful signin', async () => {
    const postSpy = vi.spyOn(api, 'post').mockResolvedValueOnce({
      data: { data: { access_token: 'fake_token_123' } }
    });

    renderSignin();
    
    fireEvent.change(screen.getByLabelText('Email Address *'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password *'), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(postSpy).toHaveBeenCalledWith('/login', {
        email: 'test@example.com',
        password: 'password123'
      });
      expect(localStorage.getItem('auth_token')).toBe('fake_token_123');
    });
    
    postSpy.mockRestore();
  });

  it('handles signin error', async () => {
    const postSpy = vi.spyOn(api, 'post').mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } }
    });

    renderSignin();
    
    fireEvent.change(screen.getByLabelText('Email Address *'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password *'), { target: { value: 'wrongpass' } });
    
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password.')).toBeInTheDocument();
    });
    
    postSpy.mockRestore();
  });
});
