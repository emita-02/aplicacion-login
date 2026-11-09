import * as ExpoCrypto from 'expo-crypto';

/**
 * React Native / Hermes does not provide the Web Crypto API.
 * Supabase PKCE needs `crypto.getRandomValues()` and `crypto.subtle.digest('SHA-256')`,
 * so this module installs the missing pieces using the official Expo module.
 */
const SUPPORTED_DIGEST_ALGORITHMS = new Set<string>([
  ExpoCrypto.CryptoDigestAlgorithm.SHA1,
  ExpoCrypto.CryptoDigestAlgorithm.SHA256,
  ExpoCrypto.CryptoDigestAlgorithm.SHA384,
  ExpoCrypto.CryptoDigestAlgorithm.SHA512,
]);

function getAlgorithmName(algorithm: AlgorithmIdentifier): string {
  return typeof algorithm === 'string' ? algorithm : algorithm.name;
}

async function digest(algorithm: AlgorithmIdentifier, data: BufferSource): Promise<ArrayBuffer> {
  const algorithmName = getAlgorithmName(algorithm);

  if (!SUPPORTED_DIGEST_ALGORITHMS.has(algorithmName)) {
    throw new Error(`Web Crypto polyfill: unsupported digest algorithm "${algorithmName}".`);
  }

  return ExpoCrypto.digest(algorithmName as ExpoCrypto.CryptoDigestAlgorithm, data);
}

const existingCrypto = globalThis.crypto as Partial<Crypto> | undefined;

if (typeof existingCrypto?.getRandomValues !== 'function' || !existingCrypto.subtle) {
  const webCryptoPolyfill = {
    getRandomValues: <T extends Parameters<typeof ExpoCrypto.getRandomValues>[0]>(array: T): T =>
      ExpoCrypto.getRandomValues(array),
    randomUUID: (): string => ExpoCrypto.randomUUID(),
    subtle: { digest },
  };

  Object.defineProperty(globalThis, 'crypto', {
    configurable: true,
    enumerable: true,
    value: webCryptoPolyfill,
    writable: true,
  });
}
