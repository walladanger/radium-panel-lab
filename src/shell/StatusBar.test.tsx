import { render, screen } from '@testing-library/react';
import { StatusBar } from './StatusBar';

describe('StatusBar', () => {
  it('renders default text "Ready"', () => {
    render(<StatusBar />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('status-bar');
    expect(footer).toHaveTextContent('Ready');
  });

  it('renders custom children', () => {
    render(
      <StatusBar>
        <span data-testid="custom-child">Loading...</span>
      </StatusBar>
    );
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveTextContent('Loading...');
    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
  });
});
