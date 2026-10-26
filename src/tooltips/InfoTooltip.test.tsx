import { render, screen, act, fireEvent } from '@testing-library/react';
import { InfoTooltip } from './InfoTooltip';
import { vi } from 'vitest';

describe('InfoTooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllTimers();
  });

  it('is hidden by default', () => {
    render(
      <InfoTooltip title="Test Tooltip">
        <button>Trigger</button>
      </InfoTooltip>
    );
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('is shown after the default 400ms delay on pointer enter', () => {
    render(
      <InfoTooltip title="Test Tooltip">
        <button>Trigger</button>
      </InfoTooltip>
    );

    const wrapper = screen.getByRole('button', { name: 'Trigger' }).parentElement!;
    fireEvent.pointerEnter(wrapper);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByRole('tooltip')).toHaveTextContent('Test Tooltip');
  });

  it('is shown after a custom delay on focus', () => {
    render(
      <InfoTooltip title="Focus Tooltip" delay={600}>
        <button>Trigger</button>
      </InfoTooltip>
    );

    const wrapper = screen.getByRole('button', { name: 'Trigger' }).parentElement!;
    fireEvent.focus(wrapper);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(599);
    });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByRole('tooltip')).toHaveTextContent('Focus Tooltip');
  });

  it('is hidden on pointer leave/blur', () => {
    render(
      <InfoTooltip title="Test Tooltip">
        <button>Trigger</button>
      </InfoTooltip>
    );

    const wrapper = screen.getByRole('button', { name: 'Trigger' }).parentElement!;
    fireEvent.pointerEnter(wrapper);

    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    fireEvent.pointerLeave(wrapper);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    fireEvent.focus(wrapper);
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    fireEvent.blur(wrapper);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('cancels a pending show when leaving before the delay', () => {
    render(
      <InfoTooltip title="Test Tooltip">
        <button>Trigger</button>
      </InfoTooltip>
    );

    const wrapper = screen.getByRole('button', { name: 'Trigger' }).parentElement!;
    fireEvent.pointerEnter(wrapper);

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    fireEvent.pointerLeave(wrapper);

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('wires aria-describedby to the tooltip id when visible', () => {
    render(
      <InfoTooltip title="Aria Tooltip">
        <button>Trigger</button>
      </InfoTooltip>
    );

    const trigger = screen.getByRole('button', { name: 'Trigger' });
    const wrapper = trigger.parentElement!;
    expect(trigger).not.toHaveAttribute('aria-describedby');

    fireEvent.pointerEnter(wrapper);
    act(() => {
      vi.advanceTimersByTime(400);
    });

    const tooltip = screen.getByRole('tooltip');
    expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
  });

  it('uses the label as title when no title is given', () => {
    render(
      <InfoTooltip label="Label Tooltip">
        <button>Trigger</button>
      </InfoTooltip>
    );

    const wrapper = screen.getByRole('button', { name: 'Trigger' }).parentElement!;
    fireEvent.pointerEnter(wrapper);
    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(screen.getByRole('tooltip')).toHaveTextContent('Label Tooltip');
  });

  it('renders optional detail fields only when provided', () => {
    render(
      <InfoTooltip
        title="Detail Tooltip"
        description="A description"
        guidance="Some guidance"
        shortcut="Ctrl+S"
        status="Saved"
        warning="A warning"
      >
        <button>Trigger</button>
      </InfoTooltip>
    );

    const wrapper = screen.getByRole('button', { name: 'Trigger' }).parentElement!;
    fireEvent.pointerEnter(wrapper);
    act(() => {
      vi.advanceTimersByTime(400);
    });

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Detail Tooltip');
    expect(tooltip).toHaveTextContent('A description');
    expect(tooltip).toHaveTextContent('Some guidance');
    expect(tooltip).toHaveTextContent('Ctrl+S');
    expect(tooltip).toHaveTextContent('Saved');
    expect(tooltip).toHaveTextContent('A warning');
  });
});
