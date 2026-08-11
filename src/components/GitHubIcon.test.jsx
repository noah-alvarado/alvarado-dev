import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import GitHubIcon from './GitHubIcon.jsx';

describe('GitHubIcon', () => {
  it('renders an accessible external link to the given href', () => {
    render(<GitHubIcon href="https://github.com/noah-alvarado" label="GitHub profile" />);

    const link = screen.getByRole('link', { name: 'GitHub profile' });
    expect(link).toHaveAttribute('href', 'https://github.com/noah-alvarado');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
