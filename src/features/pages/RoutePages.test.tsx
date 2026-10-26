import { render, screen } from '@testing-library/react';
import { PRODUCT_NAME } from '../../app/brand';
import type { ShellRoute } from '../../navigation/navigationTypes';
import { RoutePage, renderRoute } from './RoutePages';

vi.mock('../canvas/CanvasPage', () => ({
  CanvasPage: () => <div data-testid="canvas-page" />
}));

describe('RoutePages', () => {
  it('renders CanvasPage for canvas route', () => {
    render(<RoutePage route="canvas" />);
    expect(screen.getByTestId('canvas-page')).toBeInTheDocument();
  });

  const routes: ShellRoute[] = [
    'projects',
    'production',
    'comments',
    'design-system',
    'agents',
    'settings',
    'about'
  ];

  const copies: Record<string, { title: string; intro: string; emptyTitle: string; emptyText: string }> = {
    projects: { title: 'Projects', intro: 'Each project points at one app you are building.', emptyTitle: 'No projects yet', emptyText: 'Projects arrive with sign-in in the next update.' },
    production: { title: 'Production', intro: 'The list of changes for a coding agent to make.', emptyTitle: 'No production list yet', emptyText: 'Make changes on the canvas to build one.' },
    comments: { title: 'Comments', intro: 'Notes pinned to parts of your app.', emptyTitle: 'No comments yet', emptyText: 'Use the Comment tool on the canvas to add one.' },
    'design-system': { title: 'Design system', intro: 'Colours, corners, spacing and motion for your app.', emptyTitle: 'No design tokens yet', emptyText: 'Connect an app to read its tokens.' },
    agents: { title: 'Agents', intro: 'Coding agents that read and finish your production list.', emptyTitle: 'No agents connected', emptyText: 'Agent access arrives in a later update.' },
    settings: { title: 'Settings', intro: 'Use Appearance in the navigation to change the accent colour.', emptyTitle: 'More settings soon', emptyText: 'Account and project settings arrive with sign-in.' },
    about: { title: 'About', intro: `${PRODUCT_NAME} lets you change any app visually and hands the changes to a coding agent.`, emptyTitle: 'Built on Ember Studio', emptyText: 'Version 0.1.0' },
  };

  it.each(routes)('renders exact texts and attributes for route %s', (route) => {
    const { container } = render(<RoutePage route={route} />);
    const copy = copies[route];

    const section = container.querySelector('section');
    expect(section).toHaveAttribute('data-route', route);
    expect(section).toHaveAttribute('aria-labelledby', `route-${route}`);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(copy.title);
    expect(heading).toHaveAttribute('id', `route-${route}`);

    // We expect 2 elements matching 'editor-empty__text' in total for each page
    // One for intro, one for empty text
    const introElement = screen.getByText(copy.intro);
    expect(introElement).toHaveClass('editor-empty__text');

    const emptyTitleElement = screen.getByText(copy.emptyTitle);
    expect(emptyTitleElement).toHaveClass('editor-empty__title');

    const emptyTextElement = screen.getByText(copy.emptyText);
    expect(emptyTextElement).toHaveClass('editor-empty__text');
  });

  it('renderRoute returns the same output as RoutePage', () => {
    const { container: containerPage } = render(<RoutePage route="projects" />);
    const { container: containerRenderRoute } = render(<>{renderRoute('projects')}</>);

    expect(containerRenderRoute.innerHTML).toBe(containerPage.innerHTML);
  });
});
