import { renderHook } from '@testing-library/react';
import { useAriaExpanded } from '../useAriaExpanded';

describe('useAriaExpanded', () => {
  it('should return true when expanded', () => {
    const { result } = renderHook(() => useAriaExpanded(true));
    expect(result.current['aria-expanded']).toBe('true');
  });

  it('should return false when not expanded', () => {
    const { result } = renderHook(() => useAriaExpanded(false));
    expect(result.current['aria-expanded']).toBe('false');
  });

  it('should update when expanded state changes', () => {
    const { result, rerender } = renderHook(
      ({ isExpanded }) => useAriaExpanded(isExpanded),
      { initialProps: { isExpanded: false } }
    );

    expect(result.current['aria-expanded']).toBe('false');

    rerender({ isExpanded: true });
    expect(result.current['aria-expanded']).toBe('true');
  });

  it('should maintain type safety', () => {
    const { result } = renderHook(() => useAriaExpanded(true));
    const ariaExpanded: 'true' | 'false' = result.current['aria-expanded'];
    expect(typeof ariaExpanded).toBe('string');
    expect(['true', 'false']).toContain(ariaExpanded);
  });
});
