import { useLinkingURL } from 'expo-linking';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';

import {
  AuthOperationError,
  confirmEmailCallback,
  getConfirmEmailRequestKey,
  parseAuthCallbackParams,
  type AuthCallbackRawParams,
} from '../services/auth-service';
import { parseDeepLinkParams } from '../utils/parse-deep-link-params';

const GENERIC_ERROR_MESSAGE =
  'No pudimos confirmar tu correo electrónico. Inténtalo de nuevo.';

export type ConfirmEmailStatus = 'loading' | 'success' | 'error';

type ConfirmationResult = {
  requestKey: string;
  status: Exclude<ConfirmEmailStatus, 'loading'>;
  errorMessage?: string;
};

export function useConfirmEmail() {
  const linkingUrl = useLinkingURL();
  const localParams = useLocalSearchParams();
  // useLocalSearchParams returns a new object on every render, so its content
  // is serialized to keep the memo dependency stable.
  const localParamsKey = JSON.stringify(localParams);

  const confirmationParams = useMemo(() => {
    const routeParams = JSON.parse(localParamsKey) as AuthCallbackRawParams;

    return parseAuthCallbackParams({
      ...parseDeepLinkParams(linkingUrl),
      ...routeParams,
    });
  }, [linkingUrl, localParamsKey]);

  const requestKey = getConfirmEmailRequestKey(confirmationParams);
  const [result, setResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    let isActive = true;

    confirmEmailCallback(confirmationParams)
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
  }, [confirmationParams, requestKey]);

  const matchesCurrentRequest = result?.requestKey === requestKey;

  return {
    status: matchesCurrentRequest ? result.status : 'loading',
    errorMessage: matchesCurrentRequest ? result.errorMessage ?? null : null,
  } satisfies {
    status: ConfirmEmailStatus;
    errorMessage: string | null;
  };
}
