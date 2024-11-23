/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from '../SearchBar';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn().mockReturnValue(new URLSearchParams())
}));

describe('SearchBar', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders search input', () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it('updates search query on input change', () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: 'water damage' } });
    expect(input).toHaveValue('water damage');
  });

  it('navigates to search page on form submission', () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/search/i);
    const form = screen.getByRole('search');

    fireEvent.change(input, { target: { value: 'water damage' } });
    fireEvent.submit(form);

    expect(mockRouter.push).toHaveBeenCalledWith('/search?q=water+damage');
  });

  it('trims whitespace from search query', () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/search/i);
    const form = screen.getByRole('search');

    fireEvent.change(input, { target: { value: '  water damage  ' } });
    fireEvent.submit(form);

    expect(mockRouter.push).toHaveBeenCalledWith('/search?q=water+damage');
  });

  it('prevents navigation for empty search', () => {
    render(<SearchBar />);
    const form = screen.getByRole('search');

    fireEvent.submit(form);

    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('displays search icon', () => {
    render(<SearchBar />);
    expect(screen.getByLabelText(/search/i)).toBeInTheDocument();
  });

  it('handles keyboard navigation', () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/search/i);

    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(mockRouter.push).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: 'water damage' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(mockRouter.push).toHaveBeenCalledWith('/search?q=water+damage');
  });

  it('preserves existing URL parameters', () => {
    const mockSearchParams = new URLSearchParams('locale=en-AU');
    (require('next/navigation').useSearchParams as jest.Mock)
      .mockReturnValue(mockSearchParams);

    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/search/i);
    const form = screen.getByRole('search');

    fireEvent.change(input, { target: { value: 'water damage' } });
    fireEvent.submit(form);

    expect(mockRouter.push).toHaveBeenCalledWith('/search?locale=en-AU&q=water+damage');
  });
});
