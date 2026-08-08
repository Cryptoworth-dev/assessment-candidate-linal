import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingScreen from '../LoadingScreen';

describe('LoadingScreen', () => {
  it('renders default message', () => {
    render(<LoadingScreen />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders custom message', () => {
    render(<LoadingScreen message="Authenticating..." />);
    expect(screen.getByText('Authenticating...')).toBeInTheDocument();
  });

  it('renders the spinner', () => {
    const { container } = render(<LoadingScreen />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('renders the logo', () => {
    render(<LoadingScreen />);
    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();
  });
});
