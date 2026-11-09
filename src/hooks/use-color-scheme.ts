/**
 * Task-do uses only the light theme.
 * This hook replaces the system color scheme so every screen stays consistent.
 */
export function useColorScheme() {
  return 'light' as const;
}
