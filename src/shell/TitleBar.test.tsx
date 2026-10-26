import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TitleBar, shouldStartTitleBarDragging } from './TitleBar';
import { type NativeWindowService } from '../windows/nativeWindowService';

describe('shouldStartTitleBarDragging', () => {
  it('returns true for primary button (0) on generic element', () => {
    const el = document.createElement('div');
    expect(shouldStartTitleBarDragging(el, 0)).toBe(true);
  });

  it('returns false for non-primary button (e.g. 1, 2)', () => {
    const el = document.createElement('div');
    expect(shouldStartTitleBarDragging(el, 1)).toBe(false);
    expect(shouldStartTitleBarDragging(el, 2)).toBe(false);
  });

  it('returns false for button elements', () => {
    const btn = document.createElement('button');
    expect(shouldStartTitleBarDragging(btn, 0)).toBe(false);
  });

  it('returns false for elements inside a button', () => {
    const btn = document.createElement('button');
    const span = document.createElement('span');
    btn.appendChild(span);
    expect(shouldStartTitleBarDragging(span, 0)).toBe(false);
  });

  it('returns true for null target', () => {
    // Current implementation checks `target instanceof Element`, so if target is null,
    // the second part of `!(target instanceof Element && target.closest('button'))` is `!(false)`, which is `true`.
    expect(shouldStartTitleBarDragging(null, 0)).toBe(true);
  });

  it('returns true for input elements', () => {
    // Current implementation only checks for closest('button'), so input returns true.
    const input = document.createElement('input');
    expect(shouldStartTitleBarDragging(input, 0)).toBe(true);
  });
});

describe('TitleBar', () => {
  const createMockNativeWindowService = (): NativeWindowService => ({
    minimize: vi.fn().mockResolvedValue(undefined),
    toggleMaximize: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined),
    startDragging: vi.fn().mockResolvedValue(undefined),
  });

  it('renders default elements', () => {
    render(<TitleBar />);
    expect(screen.getByText('Radium Panel Lab Studio')).toBeInTheDocument(); // PRODUCT_NAME default
    expect(screen.getByRole('button', { name: /Minimize window/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Maximize window/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Close window/i })).toBeInTheDocument();
  });

  it('renders custom product name and logo', () => {
    render(<TitleBar productName="CustomApp" logo={<div data-testid="custom-logo" />} />);
    expect(screen.getByText('CustomApp')).toBeInTheDocument();
    expect(screen.getByTestId('custom-logo')).toBeInTheDocument();
  });

  it('invokes nativeWindowService minimize when no handler is provided', async () => {
    const user = userEvent.setup();
    const service = createMockNativeWindowService();
    render(<TitleBar nativeWindowService={service} />);

    await user.click(screen.getByRole('button', { name: /Minimize window/i }));
    expect(service.minimize).toHaveBeenCalledOnce();
  });

  it('invokes onMinimize callback when provided', async () => {
    const user = userEvent.setup();
    const service = createMockNativeWindowService();
    const onMinimize = vi.fn();
    render(<TitleBar onMinimize={onMinimize} nativeWindowService={service} />);

    await user.click(screen.getByRole('button', { name: /Minimize window/i }));
    expect(onMinimize).toHaveBeenCalledOnce();
    expect(service.minimize).not.toHaveBeenCalled();
  });

  it('invokes nativeWindowService toggleMaximize when no handler is provided', async () => {
    const user = userEvent.setup();
    const service = createMockNativeWindowService();
    render(<TitleBar nativeWindowService={service} />);

    await user.click(screen.getByRole('button', { name: /Maximize window/i }));
    expect(service.toggleMaximize).toHaveBeenCalledOnce();
  });

  it('invokes onToggleMaximize callback when provided', async () => {
    const user = userEvent.setup();
    const service = createMockNativeWindowService();
    const onToggleMaximize = vi.fn();
    render(<TitleBar onToggleMaximize={onToggleMaximize} nativeWindowService={service} />);

    await user.click(screen.getByRole('button', { name: /Maximize window/i }));
    expect(onToggleMaximize).toHaveBeenCalledOnce();
    expect(service.toggleMaximize).not.toHaveBeenCalled();
  });

  it('toggles maximized aria-label state when uncontrolled', async () => {
    const user = userEvent.setup();
    const service = createMockNativeWindowService();
    render(<TitleBar nativeWindowService={service} />);

    const maximizeBtn = screen.getByRole('button', { name: /Maximize window/i });
    await user.click(maximizeBtn);
    expect(screen.getByRole('button', { name: /Restore window/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Restore window/i }));
    expect(screen.getByRole('button', { name: /Maximize window/i })).toBeInTheDocument();
  });

  it('respects isMaximized prop', () => {
    const service = createMockNativeWindowService();
    const { rerender } = render(<TitleBar nativeWindowService={service} isMaximized={true} />);
    expect(screen.getByRole('button', { name: /Restore window/i })).toBeInTheDocument();

    rerender(<TitleBar nativeWindowService={service} isMaximized={false} />);
    expect(screen.getByRole('button', { name: /Maximize window/i })).toBeInTheDocument();
  });

  it('invokes nativeWindowService close when no handler is provided', async () => {
    const user = userEvent.setup();
    const service = createMockNativeWindowService();
    render(<TitleBar nativeWindowService={service} />);

    await user.click(screen.getByRole('button', { name: /Close window/i }));
    expect(service.close).toHaveBeenCalledOnce();
  });

  it('invokes onClose callback when provided', async () => {
    const user = userEvent.setup();
    const service = createMockNativeWindowService();
    const onClose = vi.fn();
    render(<TitleBar onClose={onClose} nativeWindowService={service} />);

    await user.click(screen.getByRole('button', { name: /Close window/i }));
    expect(onClose).toHaveBeenCalledOnce();
    expect(service.close).not.toHaveBeenCalled();
  });

  it('starts dragging on primary pointer down in drag region', async () => {
    const user = userEvent.setup();
    const service = createMockNativeWindowService();
    render(<TitleBar nativeWindowService={service} />);

    const dragRegion = screen.getByTestId('title-bar-drag-region');
    await user.pointer({ keys: '[MouseLeft]', target: dragRegion });
    expect(service.startDragging).toHaveBeenCalledOnce();
  });

  it('does not start dragging on non-primary pointer down in drag region', async () => {
    const user = userEvent.setup();
    const service = createMockNativeWindowService();
    render(<TitleBar nativeWindowService={service} />);

    const dragRegion = screen.getByTestId('title-bar-drag-region');
    await user.pointer({ keys: '[MouseRight]', target: dragRegion });
    expect(service.startDragging).not.toHaveBeenCalled();
  });

  it('does not start dragging on pointer down inside a window control button', async () => {
    const user = userEvent.setup();
    const service = createMockNativeWindowService();
    render(<TitleBar nativeWindowService={service} />);

    const minimizeBtn = screen.getByRole('button', { name: /Minimize window/i });
    await user.pointer({ keys: '[MouseLeft]', target: minimizeBtn });
    expect(service.startDragging).not.toHaveBeenCalled();
  });
});
