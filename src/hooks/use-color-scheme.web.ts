/**
 * Task-do uses only the light theme.
 * The explicit web implementation avoids hydration mismatches during static rendering.
 */
export function useColorScheme() {
  return 'light' as const;
}
