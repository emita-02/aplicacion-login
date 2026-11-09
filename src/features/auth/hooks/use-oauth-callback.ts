import { useLinkingURL } from 'expo-linking';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';

import {
  AuthOperationError,
  completeOAuthCallback,
  getOAuthCallbackRequestKey,
  parseAuthCallbackParams,
  type AuthCallbackRawParams,
} from '../services/auth-service';
import { parseDeepLinkParams } from '../utils/parse-deep-link-params';

const GENERIC_ERROR_MESSAGE =
  'No pudimos iniciar sesión con Google. Inténtalo de nuevo.';

export type OAuthCallbackStatus = 'loading' | 'success' | 'error';

type OAuthCallbackResult = {
  requestKey: string;
  status: Exclude<OAuthCallbackStatus, 'loading'>;
  errorMessage?: string;
};

export function useOAuthCallback() {
  const linkingUrl = useLinkingURL();
  const localParams = useLocalSearchParams();
  // useLocalSearchParams returns a new object on every render, so its content
  // is serialized to keep the memo dependency stable.
  const localParamsKey = JSON.stringify(localParams);

  const callbackParams = useMemo(() => {
    const routeParams = JSON.parse(localParamsKey) as AuthCallbackRawParams;

    return parseAuthCallbackParams({
      ...parseDeepLinkParams(linkingUrl),
      ...routeParams,
    });
  }, [linkingUrl, localParamsKey]);

  const requestKey = getOAuthCallbackRequestKey(callbackParams);
  const [result, setResult] = useState<OAuthCallbackResult | null>(null);

  useEffect(() => {
    let isActive = true;

    completeOAuthCallback(callbackParams)
      .then(() => {
        if (isActive) {
          setResult({ requestKey, status: 'success' });
        }
      })
      .catch((error: unknown) => {
        if (!isActive) {
          return;
        }

        setResult({
          requestKey,
          status: 'error',
          errorMessage:
            error instanceof AuthOperationError
              ? error.message
              : GENERIC_ERROR_MESSAGE,
        });
      });

    return () => {
      isActive = false;
    };
  }, [callbackParams, requestKey]);

  const matchesCurrentRequest = result?.requestKey === requestKey;

  return {
    status: matchesCurrentRequest ? result.status : 'loading',
    errorMessage: matchesCurrentRequest ? result.errorMessage ?? null : null,
  } satisfies {
    status: OAuthCallbackStatus;
    errorMessage: string | null;
  };
}
