import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsProvider } from '../../settings/settingsStore';
import { createMemorySettingsAdapter, createSettingsService, defaultSettings } from '../../settings/settingsService';
import { CANVAS_LAYOUT_KEY, defaultCanvasLayout, readCanvasLayout, useCanvasLayout } from './canvasLayout';


describe('readCanvasLayout', () => {
  it('returns defaultCanvasLayout when extensionSettings is undefined', () => {
    expect(readCanvasLayout(undefined)).toEqual(defaultCanvasLayout);
  });

  it('returns defaultCanvasLayout when extensionSettings is empty', () => {
    expect(readCanvasLayout({})).toEqual(defaultCanvasLayout);
  });

  it('returns defaultCanvasLayout when CANVAS_LAYOUT_KEY is not an object', () => {
    expect(readCanvasLayout({ [CANVAS_LAYOUT_KEY]: 'string' })).toEqual(defaultCanvasLayout);
    expect(readCanvasLayout({ [CANVAS_LAYOUT_KEY]: null })).toEqual(defaultCanvasLayout);
  });

  it('returns defaultCanvasLayout when version is incorrect', () => {
    expect(readCanvasLayout({
      [CANVAS_LAYOUT_KEY]: { ...defaultCanvasLayout, version: 2 }
    })).toEqual(defaultCanvasLayout);
  });

  it('returns defaultCanvasLayout when leftRailOpen is not a boolean', () => {
    expect(readCanvasLayout({
      [CANVAS_LAYOUT_KEY]: { ...defaultCanvasLayout, leftRailOpen: 'true' }
    })).toEqual(defaultCanvasLayout);
  });

  it('returns defaultCanvasLayout when rightRailOpen is not a boolean', () => {
    expect(readCanvasLayout({
      [CANVAS_LAYOUT_KEY]: { ...defaultCanvasLayout, rightRailOpen: 'true' }
    })).toEqual(defaultCanvasLayout);
  });

  it('returns defaultCanvasLayout when rightTab is invalid', () => {
    expect(readCanvasLayout({
      [CANVAS_LAYOUT_KEY]: { ...defaultCanvasLayout, rightTab: 'invalid_tab' }
    })).toEqual(defaultCanvasLayout);
  });

  it('successfully reads valid settings', () => {
    const validLayout = { version: 1 as const, leftRailOpen: false, rightRailOpen: false, rightTab: 'comments' as const };
    expect(readCanvasLayout({
      [CANVAS_LAYOUT_KEY]: validLayout
    })).toEqual(validLayout);
  });
});

function TestComponent() {
  const { layout, update, reset } = useCanvasLayout();
  return (
    <div>
      <div data-testid="leftRailOpen">{layout.leftRailOpen.toString()}</div>
      <div data-testid="rightRailOpen">{layout.rightRailOpen.toString()}</div>
      <div data-testid="rightTab">{layout.rightTab}</div>
      <button onClick={() => update({ leftRailOpen: false, rightTab: 'production' })}>Update Layout</button>
      <button onClick={() => reset()}>Reset Layout</button>
    </div>
  );
}

describe('useCanvasLayout', () => {
  it('uses local layout when SettingsProvider is absent', async () => {
    const user = userEvent.setup();
    render(<TestComponent />);

    expect(screen.getByTestId('leftRailOpen').textContent).toBe('true');
    expect(screen.getByTestId('rightTab').textContent).toBe('inspector');

    await user.click(screen.getByRole('button', { name: 'Update Layout' }));
    expect(screen.getByTestId('leftRailOpen').textContent).toBe('false');
    expect(screen.getByTestId('rightTab').textContent).toBe('production');

    await user.click(screen.getByRole('button', { name: 'Reset Layout' }));
    expect(screen.getByTestId('leftRailOpen').textContent).toBe('true');
    expect(screen.getByTestId('rightTab').textContent).toBe('inspector');
  });

  it('reads layout from SettingsProvider', () => {
    const service = createSettingsService(createMemorySettingsAdapter());
    const initialSettings = {
      ...defaultSettings,
      extensionSettings: {
        [CANVAS_LAYOUT_KEY]: { version: 1, leftRailOpen: false, rightRailOpen: true, rightTab: 'production' }
      }
    };
    render(
      <SettingsProvider service={service} initialSettings={initialSettings}>
        <TestComponent />
      </SettingsProvider>
    );

    expect(screen.getByTestId('leftRailOpen').textContent).toBe('false');
    expect(screen.getByTestId('rightRailOpen').textContent).toBe('true');
    expect(screen.getByTestId('rightTab').textContent).toBe('production');
  });

  it('updates layout in SettingsProvider', async () => {
    const user = userEvent.setup();
    const service = createSettingsService(createMemorySettingsAdapter());
    render(
      <SettingsProvider service={service} initialSettings={defaultSettings}>
        <TestComponent />
      </SettingsProvider>
    );

    expect(screen.getByTestId('leftRailOpen').textContent).toBe('true');

    await user.click(screen.getByRole('button', { name: 'Update Layout' }));

    // Check UI updated
    expect(screen.getByTestId('leftRailOpen').textContent).toBe('false');
    expect(screen.getByTestId('rightTab').textContent).toBe('production');

    // Check service updated
    const saved = await service.load();
    expect(saved.extensionSettings[CANVAS_LAYOUT_KEY]).toEqual({
      ...defaultCanvasLayout,
      leftRailOpen: false,
      rightTab: 'production'
    });
  });

  it('resets layout in SettingsProvider', async () => {
    const user = userEvent.setup();
    const service = createSettingsService(createMemorySettingsAdapter());
    const initialSettings = {
      ...defaultSettings,
      extensionSettings: {
        [CANVAS_LAYOUT_KEY]: { version: 1, leftRailOpen: false, rightRailOpen: false, rightTab: 'comments' }
      }
    };
    render(
      <SettingsProvider service={service} initialSettings={initialSettings}>
        <TestComponent />
      </SettingsProvider>
    );

    expect(screen.getByTestId('leftRailOpen').textContent).toBe('false');

    await user.click(screen.getByRole('button', { name: 'Reset Layout' }));

    // Check UI updated
    expect(screen.getByTestId('leftRailOpen').textContent).toBe('true');
    expect(screen.getByTestId('rightTab').textContent).toBe('inspector');

    // Check service updated
    const saved = await service.load();
    expect(saved.extensionSettings[CANVAS_LAYOUT_KEY]).toEqual(defaultCanvasLayout);
  });
});
