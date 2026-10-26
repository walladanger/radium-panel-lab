import { render, screen } from '@testing-library/react';
import { EditorStatus } from './EditorStatus';

describe('EditorStatus', () => {
  it('renders default values', () => {
    render(<EditorStatus />);

    const bridgeStatus = screen.getByLabelText('Bridge status');
    expect(bridgeStatus).toHaveTextContent('No app connected');
    expect(bridgeStatus).toHaveAttribute('data-state', 'disconnected');

    expect(screen.getByLabelText('Unsynced changes')).toHaveTextContent('0 unsynced');
    expect(screen.getByLabelText('Session')).toHaveTextContent('No session');
  });

  it('renders connected state, unsynced count and session name', () => {
    render(<EditorStatus bridge="connected" unsynced={5} sessionName="My Session" />);

    const bridgeStatus = screen.getByLabelText('Bridge status');
    expect(bridgeStatus).toHaveTextContent('App connected');
    expect(bridgeStatus).toHaveAttribute('data-state', 'connected');

    expect(screen.getByLabelText('Unsynced changes')).toHaveTextContent('5 unsynced');
    expect(screen.getByLabelText('Session')).toHaveTextContent('My Session');
  });
});
