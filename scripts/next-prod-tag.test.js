import { describe, it, expect } from 'vitest';
import { computeNextTag } from './next-prod-tag.mjs';

describe('computeNextTag', () => {
  it('starts at .0 when no tags exist', () => {
    expect(computeNextTag('1.0.0', [])).toBe('1.0.0.0');
  });

  it('returns max + 1 for the matching base', () => {
    expect(computeNextTag('1.0.0', ['1.0.0.0', '1.0.0.1', '1.0.0.2'])).toBe('1.0.0.3');
  });

  it('ignores tags for other base versions', () => {
    expect(computeNextTag('1.0.0', ['0.9.0.5', '1.1.0.9', '1.0.0.4'])).toBe('1.0.0.5');
  });

  it('handles gaps by using the max, not the count', () => {
    expect(computeNextTag('1.0.0', ['1.0.0.0', '1.0.0.7'])).toBe('1.0.0.8');
  });
});
