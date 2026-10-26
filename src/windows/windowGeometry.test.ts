import { bringToFront, clampBounds, clampResizeBounds } from './windowGeometry';

describe('clampBounds', () => {
  it('keeps bounds within workspace limits', () => {
    const workspace = { width: 1000, height: 800 };
    const minimum = { width: 200, height: 100 };

    expect(clampBounds({ x: 10, y: 20, width: 1200, height: 1000 }, workspace, minimum)).toEqual({
      x: 10,
      y: 20,
      width: 1000,
      height: 800,
    });
  });

  it('respects minimum dimensions', () => {
    const workspace = { width: 1000, height: 800 };
    const minimum = { width: 200, height: 100 };

    expect(clampBounds({ x: 10, y: 20, width: 50, height: 50 }, workspace, minimum)).toEqual({
      x: 10,
      y: 20,
      width: 200,
      height: 100,
    });
  });

  it('enforces reachable header space constraints', () => {
    const workspace = { width: 1000, height: 800 };
    const minimum = { width: 200, height: 100 };
    const reachableHeaderWidth = 96;
    const headerHeight = 38;

    // Test minimum X (dragged too far left)
    expect(clampBounds({ x: -2000, y: 50, width: 400, height: 300 }, workspace, minimum)).toEqual({
      x: -400 + reachableHeaderWidth,
      y: 50,
      width: 400,
      height: 300,
    });

    // Test maximum X (dragged too far right)
    expect(clampBounds({ x: 2000, y: 50, width: 400, height: 300 }, workspace, minimum)).toEqual({
      x: 1000 - reachableHeaderWidth,
      y: 50,
      width: 400,
      height: 300,
    });

    // Test minimum Y (dragged too far up)
    expect(clampBounds({ x: 100, y: -500, width: 400, height: 300 }, workspace, minimum)).toEqual({
      x: 100,
      y: 0,
      width: 400,
      height: 300,
    });

    // Test maximum Y (dragged too far down)
    expect(clampBounds({ x: 100, y: 2000, width: 400, height: 300 }, workspace, minimum)).toEqual({
      x: 100,
      y: 800 - headerHeight,
      width: 400,
      height: 300,
    });
  });
});

describe('clampResizeBounds', () => {
  it('behaves like clampBounds when no edge is provided', () => {
    const workspace = { width: 1000, height: 800 };
    const minimum = { width: 200, height: 100 };

    expect(clampResizeBounds({ x: 10, y: 20, width: 1200, height: 1000 }, workspace, minimum)).toEqual({
      x: 10,
      y: 20,
      width: 1000,
      height: 800,
    });
  });

  it('anchors correctly when resizing west', () => {
    const workspace = { width: 1000, height: 800 };
    const minimum = { width: 200, height: 100 };

    // Bounds passed in have width 1500, which will be clamped to 1000
    // Anchor X computation: bounds.x (100) + bounds.width (1500) - clampedWidth (1000) = 600
    expect(clampResizeBounds({ x: 100, y: 20, width: 1500, height: 300 }, workspace, minimum, 'west')).toEqual({
      x: 600,
      y: 20,
      width: 1000,
      height: 300,
    });
  });

  it('anchors correctly when resizing north', () => {
    const workspace = { width: 1000, height: 800 };
    const minimum = { width: 200, height: 100 };

    // Bounds passed in have height 1500, which will be clamped to 800
    // Anchor Y computation: bounds.y (100) + bounds.height (1500) - clampedHeight (800) = 800
    // Then clamped to maximumY = 800 - 38 = 762
    expect(clampResizeBounds({ x: 100, y: 100, width: 400, height: 1500 }, workspace, minimum, 'north')).toEqual({
      x: 100,
      y: 762,
      width: 400,
      height: 800,
    });
  });

  it('handles combination of north and west (north-west)', () => {
    const workspace = { width: 1000, height: 800 };
    const minimum = { width: 200, height: 100 };

    expect(clampResizeBounds({ x: 100, y: 100, width: 1500, height: 1500 }, workspace, minimum, 'north-west')).toEqual({
      x: 600,
      y: 762,
      width: 1000,
      height: 800,
    });
  });
});

describe('bringToFront', () => {
  it('increments zIndex for the target window to be highest', () => {
    const windows = [
      { id: 'win1', zIndex: 1, title: 'Window 1' },
      { id: 'win2', zIndex: 5, title: 'Window 2' },
      { id: 'win3', zIndex: 3, title: 'Window 3' },
    ];

    expect(bringToFront(windows, 'win1')).toEqual([
      { id: 'win1', zIndex: 6, title: 'Window 1' },
      { id: 'win2', zIndex: 5, title: 'Window 2' },
      { id: 'win3', zIndex: 3, title: 'Window 3' },
    ]);
  });

  it('handles empty window list', () => {
    expect(bringToFront([], 'win1')).toEqual([]);
  });

  it('leaves windows unchanged if id is not found', () => {
    const windows = [
      { id: 'win1', zIndex: 1 },
    ];

    expect(bringToFront(windows, 'win2')).toEqual([
      { id: 'win1', zIndex: 1 },
    ]);
  });
});
