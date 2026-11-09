import 'expo-sqlite/localStorage/install';

/**
 * Native storage backed by expo-sqlite. The install module defines the global
 * localStorage before this module reads it.
 */
export const authStorage = localStorage;
