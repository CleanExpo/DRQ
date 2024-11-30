export function useAriaExpanded(isExpanded: boolean): { 'aria-expanded': 'true' | 'false' } {
  return {
    'aria-expanded': isExpanded ? 'true' : 'false'
  };
}
