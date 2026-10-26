import { render, screen } from '@testing-library/react';
import { LogoMark } from './LogoMark';
import { PRODUCT_NAME } from '../app/brand';

describe('LogoMark', () => {
  it('renders default logo mark with correct attributes', () => {
    render(<LogoMark />);
    const svg = screen.getByRole('img', { name: PRODUCT_NAME });
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('logo-mark');
    expect(svg).toHaveAttribute('focusable', 'false');
  });

  it('renders with custom title as aria-label', () => {
    render(<LogoMark title="Custom Logo" />);
    const svg = screen.getByRole('img', { name: 'Custom Logo' });
    expect(svg).toBeInTheDocument();
  });
});
