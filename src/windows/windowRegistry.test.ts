import { describe, it, expect } from 'vitest';
import { windowRegistry } from './windowRegistry';
import { editorWindowRegistry, editorWindowIds } from '../features/editor-windows/editorWindows';
import { DataExplorerWindow } from './DataExplorerWindow';

describe('windowRegistry', () => {
  it('includes all editor windows from editorWindowRegistry', () => {
    for (const id of editorWindowIds) {
      expect(windowRegistry[id]).toBeDefined();
      expect(windowRegistry[id]).toStrictEqual(editorWindowRegistry[id]);
    }
  });

  it('includes the data-explorer window with correct configuration', () => {
    expect(windowRegistry['data-explorer']).toBeDefined();

    const dataExplorerConfig = windowRegistry['data-explorer'];
    expect(dataExplorerConfig.id).toBe('data-explorer');
    expect(dataExplorerConfig.title).toBe('Data Explorer');
    expect(dataExplorerConfig.presentation).toBe('dual');

    expect(dataExplorerConfig.initialBounds).toStrictEqual({
      x: 80,
      y: 56,
      width: 720,
      height: 480,
    });

    expect(dataExplorerConfig.minimum).toStrictEqual({
      width: 360,
      height: 240,
    });

    expect(dataExplorerConfig.preserveState).toBe(true);
    expect(dataExplorerConfig.InternalContent).toBe(DataExplorerWindow);
  });

  it('does not contain any unexpected windows', () => {
    const expectedKeys = [...editorWindowIds, 'data-explorer'];
    const actualKeys = Object.keys(windowRegistry);

    expect(actualKeys.length).toBe(expectedKeys.length);
    for (const key of actualKeys) {
      expect(expectedKeys.includes(key as any)).toBe(true);
    }
  });
});
