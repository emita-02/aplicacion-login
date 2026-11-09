type AuthStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

// Node-based server rendering does not provide localStorage. The browser keeps
// using its own localStorage; SSR uses a throwaway in-memory store.
const memoryStorage: AuthStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

export const authStorage: AuthStorage =
  typeof localStorage === 'undefined' ? memoryStorage : localStorage;
