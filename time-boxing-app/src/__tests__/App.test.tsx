import { render, screen } from '@testing-library/react';
import App from '../App';
import '@testing-library/jest-dom';

test('renders header title', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /Timebox Control/i });
  expect(heading).toBeInTheDocument();
});