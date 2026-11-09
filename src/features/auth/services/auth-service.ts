import {
  isAuthPKCECodeVerifierMissingError,
  type AuthError,
  type EmailOtpType,
} from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

import { supabase } from '@/lib/supabase';

import { parseDeepLinkParams } from '../utils/parse-deep-link-params';

export const CONFIRM_EMAIL_REDIRECT_URL = 'applogindeber6://auth/confirm-email';
export const OAUTH_CALLBACK_URL = 'applogindeber6://auth/callback';

const GENERIC_ERROR_MESSAGE = 'No pudimos completar la operación. Inténtalo de nuevo.';
const NETWORK_ERROR_MESSAGE =
  'No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.';
const GENERIC_CONFIRMATION_ERROR_MESSAGE =
  'No pudimos confirmar tu correo electrónico. Inténtalo de nuevo o inicia sesión.';
const EXPIRED_CONFIRMATION_LINK_MESSAGE =
  'El enlace de confirmación no es válido o ya expiró. Solicita un correo de confirmación nuevo.';
const PKCE_VERIFIER_MISSING_MESSAGE =
  'No pudimos verificar el enlace en este dispositivo. Inicia sesión con tu correo y contraseña.';
const MISSING_CONFIRMATION_PARAMS_MESSAGE =
  'El enlace de confirmación está incompleto. Abre nuevamente el enlace del correo o inicia sesión.';
const OAUTH_GENERIC_ERROR_MESSAGE =
  'No pudimos iniciar sesión con Google. Inténtalo de nuevo.';
const OAUTH_CANCELLED_MESSAGE = 'El inicio de sesión con Google fue cancelado.';
const OAUTH_PKCE_VERIFIER_MISSING_MESSAGE =
  'No pudimos completar el inicio de sesión con Google en este dispositivo. Inténtalo de nuevo.';

export class AuthOperationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthOperationError';
  }
}

export type SignUpOutcome = {
  email: string;
  status: 'confirmation-required' | 'already-registered' | 'signed-in';
};

function mapAuthError(error: AuthError) {
  switch (error.code) {
    case 'invalid_credentials':
      return 'El correo o la contraseña no son correctos.';
    case 'email_not_confirmed':
      return 'Debes confirmar tu correo electrónico antes de iniciar sesión.';
    case 'user_already_exists':
    case 'email_exists':
      return 'Ya existe una cuenta con este correo electrónico.';
    case 'weak_password':
      return 'La contraseña no cumple con los requisitos de seguridad.';
    case 'over_email_send_rate_limit':
    case 'over_request_rate_limit':
      return 'Demasiados intentos. Espera un momento e inténtalo de nuevo.';
    case 'signup_disabled':
      return 'El registro no está disponible en este momento.';
    case 'provider_disabled':
    case 'email_provider_disabled':
      return 'El inicio de sesión con correo no está disponible en este momento.';
    case 'email_address_invalid':
    case 'validation_failed':
      return 'Revisa los datos ingresados e inténtalo de nuevo.';
    default:
      break;
  }

  const message = error.message.toLowerCase();

  if (message.includes('invalid login credentials')) {
    return 'El correo o la contraseña no son correctos.';
  }

  if (message.includes('email not confirmed')) {
    return 'Debes confirmar tu correo electrónico antes de iniciar sesión.';
  }

  if (message.includes('already registered') || message.includes('already exists')) {
    return 'Ya existe una cuenta con este correo electrónico.';
  }

  if (error.status === undefined || error.status === 0) {
    return 'No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.';
  }

  return GENERIC_ERROR_MESSAGE;
}

export async function signInWithEmail({ email, password }: { email: string; password: string }) {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    throw new AuthOperationError(mapAuthError(error));
  }
}

export async function signUpWithEmail({
  fullName,
  email,
  password,
}: {
  fullName: string;
  email: string;
  password: string;
}): Promise<SignUpOutcome> {
  const normalizedEmail = email.trim();

  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: CONFIRM_EMAIL_REDIRECT_URL,
    },
  });

  if (error) {
    throw new AuthOperationError(mapAuthError(error));
  }

  // Supabase returns an obfuscated user with no identities when the email is
  // already registered, to avoid revealing which addresses have an account.
  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    return { email: normalizedEmail, status: 'already-registered' };
  }

  if (data.session) {
    return { email: normalizedEmail, status: 'signed-in' };
  }

  return { email: normalizedEmail, status: 'confirmation-required' };
}

export type AuthCallbackParams = {
  code?: string;
  flowId?: string;
  tokenHash?: string;
  type?: EmailOtpType;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
  errorCode?: string;
  errorDescription?: string;
};

export type AuthCallbackRawParams = Record<string, string | string[] | undefined>;

function pickFirstValue(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value;
  const trimmed = candidate?.trim();

  return trimmed ? trimmed : undefined;
}

export function parseAuthCallbackParams(
  rawParams: AuthCallbackRawParams
): AuthCallbackParams {
  return {
    code: pickFirstValue(rawParams.code),
    flowId: pickFirstValue(rawParams.sb_flow_id),
    tokenHash: pickFirstValue(rawParams.token_hash),
    type: pickFirstValue(rawParams.type),
    accessToken: pickFirstValue(rawParams.access_token),
    refreshToken: pickFirstValue(rawParams.refresh_token),
    error: pickFirstValue(rawParams.error),
    errorCode: pickFirstValue(rawParams.error_code),
    errorDescription: pickFirstValue(rawParams.error_description),
  };
}

export function getConfirmEmailRequestKey(params: AuthCallbackParams) {
  if (params.code) {
    return `code:${params.code}:${params.flowId ?? ''}`;
  }

  if (params.tokenHash) {
    return `token_hash:${params.tokenHash}:${params.type ?? ''}`;
  }

  if (params.accessToken && params.refreshToken) {
    return `session:${params.accessToken}:${params.refreshToken}`;
  }

  if (params.error || params.errorCode || params.errorDescription) {
    return `error:${params.error ?? ''}:${params.errorCode ?? ''}`;
  }

  return 'missing-params';
}

function mapConfirmationError(error: AuthError) {
  if (isAuthPKCECodeVerifierMissingError(error)) {
    return PKCE_VERIFIER_MISSING_MESSAGE;
  }

  const code = error.code?.toLowerCase() ?? '';
  const message = error.message.toLowerCase();

  if (
    code === 'pkce_code_verifier_not_found' ||
    message.includes('code verifier')
  ) {
    return PKCE_VERIFIER_MISSING_MESSAGE;
  }

  if (
    code === 'otp_expired' ||
    code === 'flow_state_expired' ||
    code === 'flow_state_not_found' ||
    code === 'invalid_grant' ||
    code === 'invalid_token' ||
    message.includes('expired') ||
    message.includes('invalid') ||
    message.includes('already been used')
  ) {
    return EXPIRED_CONFIRMATION_LINK_MESSAGE;
  }

  if (error.status === undefined || error.status === 0) {
    return NETWORK_ERROR_MESSAGE;
  }

  return GENERIC_CONFIRMATION_ERROR_MESSAGE;
}

function mapCallbackError(params: AuthCallbackParams) {
  const errorCode = params.errorCode?.toLowerCase() ?? '';
  const description = params.errorDescription?.toLowerCase() ?? '';

  if (
    errorCode === 'otp_expired' ||
    params.error === 'access_denied' ||
    description.includes('expired') ||
    description.includes('invalid') ||
    description.includes('already')
  ) {
    return EXPIRED_CONFIRMATION_LINK_MESSAGE;
  }

  return GENERIC_CONFIRMATION_ERROR_MESSAGE;
}

async function performEmailConfirmation({
  code,
  flowId,
  tokenHash,
  type,
  accessToken,
  refreshToken,
  error,
  errorCode,
  errorDescription,
}: AuthCallbackParams) {
  if (error || errorCode || errorDescription) {
    throw new AuthOperationError(
      mapCallbackError({ error, errorCode, errorDescription })
    );
  }

  if (code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
      code,
      flowId ? { flowId } : undefined
    );

    if (exchangeError) {
      throw new AuthOperationError(mapConfirmationError(exchangeError));
    }

    return;
  }

  if (tokenHash) {
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type ?? 'signup',
    });

    if (verifyError) {
      throw new AuthOperationError(mapConfirmationError(verifyError));
    }

    return;
  }

  if (accessToken && refreshToken) {
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (sessionError) {
      throw new AuthOperationError(mapConfirmationError(sessionError));
    }

    return;
  }

  throw new AuthOperationError(MISSING_CONFIRMATION_PARAMS_MESSAGE);
}

// The same deep link can be delivered more than once (for example, a cold start
// plus a URL event, or React StrictMode mounting effects twice). Successful
// confirmations stay cached because their code or token can only be used once;
// failed attempts are removed so the user can retry after a transient error.
const confirmationRequests = new Map<string, Promise<void>>();

export function confirmEmailCallback(params: AuthCallbackParams) {
  const requestKey = getConfirmEmailRequestKey(params);
  const previousRequest = confirmationRequests.get(requestKey);

  if (previousRequest) {
    return previousRequest;
  }

  const request = performEmailConfirmation(params);

  confirmationRequests.set(requestKey, request);

  request.catch(() => {
    if (confirmationRequests.get(requestKey) === request) {
      confirmationRequests.delete(requestKey);
    }
  });

  return request;
}

export type GoogleSignInOutcome = 'success' | 'cancelled';

function mapOAuthSignInError(error: AuthError) {
  switch (error.code) {
    case 'provider_disabled':
      return 'El inicio de sesión con Google no está disponible en este momento.';
    case 'over_request_rate_limit':
      return 'Demasiados intentos. Espera un momento e inténtalo de nuevo.';
    default:
      break;
  }

  if (error.status === undefined || error.status === 0) {
    return NETWORK_ERROR_MESSAGE;
  }

  return OAUTH_GENERIC_ERROR_MESSAGE;
}

function mapOAuthApiError(error: AuthError) {
  if (isAuthPKCECodeVerifierMissingError(error)) {
    return OAUTH_PKCE_VERIFIER_MISSING_MESSAGE;
  }

  const code = error.code?.toLowerCase() ?? '';
  const message = error.message.toLowerCase();

  if (code === 'pkce_code_verifier_not_found' || message.includes('code verifier')) {
    return OAUTH_PKCE_VERIFIER_MISSING_MESSAGE;
  }

  if (code === 'access_denied') {
    return OAUTH_CANCELLED_MESSAGE;
  }

  if (error.status === undefined || error.status === 0) {
    return NETWORK_ERROR_MESSAGE;
  }

  return OAUTH_GENERIC_ERROR_MESSAGE;
}

function isOAuthCancellation(params: AuthCallbackParams) {
  const errorCode = params.errorCode?.toLowerCase() ?? '';
  const description = params.errorDescription?.toLowerCase() ?? '';

  return (
    params.error === 'access_denied' ||
    errorCode === 'access_denied' ||
    description.includes('access_denied') ||
    description.includes('cancel')
  );
}

function mapOAuthCallbackError(params: AuthCallbackParams) {
  if (isOAuthCancellation(params)) {
    return OAUTH_CANCELLED_MESSAGE;
  }

  return OAUTH_GENERIC_ERROR_MESSAGE;
}

export function getOAuthCallbackRequestKey(params: AuthCallbackParams) {
  if (params.code) {
    return `oauth-code:${params.code}`;
  }

  if (params.accessToken && params.refreshToken) {
    return `oauth-session:${params.accessToken}:${params.refreshToken}`;
  }

  return `oauth-callback:${params.error ?? ''}:${params.errorCode ?? ''}`;
}

function getOAuthRedirectUrl() {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return `${window.location.origin}/auth/callback`;
  }

  return OAUTH_CALLBACK_URL;
}

// The flow id returned by signInWithOAuth selects the correct PKCE verifier.
// It is kept in memory so a callback route that mounts from a cold start can
// still complete the exchange made by the same app process.
let pendingOAuthFlowId: string | null = null;

async function performOAuthCallback(params: AuthCallbackParams, flowId?: string) {
  if (params.error || params.errorCode || params.errorDescription) {
    throw new AuthOperationError(mapOAuthCallbackError(params));
  }

  if (params.code) {
    const resolvedFlowId = params.flowId ?? flowId ?? pendingOAuthFlowId ?? undefined;
    const { error } = await supabase.auth.exchangeCodeForSession(
      params.code,
      resolvedFlowId ? { flowId: resolvedFlowId } : undefined
    );

    if (error) {
      throw new AuthOperationError(mapOAuthApiError(error));
    }

    return;
  }

  if (params.accessToken && params.refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: params.accessToken,
      refresh_token: params.refreshToken,
    });

    if (error) {
      throw new AuthOperationError(mapOAuthApiError(error));
    }

    return;
  }

  throw new AuthOperationError(OAUTH_GENERIC_ERROR_MESSAGE);
}

// The OAuth callback may be delivered both to openAuthSessionAsync and to the
// callback route (for example on Android or after a cold start). Caching the
// request by authorization code prevents a double exchange.
const oauthCallbackRequests = new Map<string, Promise<void>>();

export function completeOAuthCallback(params: AuthCallbackParams, flowId?: string) {
  const requestKey = getOAuthCallbackRequestKey(params);
  const previousRequest = oauthCallbackRequests.get(requestKey);

  if (previousRequest) {
    return previousRequest;
  }

  const request = performOAuthCallback(params, flowId);

  oauthCallbackRequests.set(requestKey, request);

  request.catch(() => {
    if (oauthCallbackRequests.get(requestKey) === request) {
      oauthCallbackRequests.delete(requestKey);
    }
  });

  return request;
}

export async function signInWithGoogle(): Promise<GoogleSignInOutcome> {
  const redirectTo = getOAuthRedirectUrl();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      skipBrowserRedirect: Platform.OS !== 'web',
    },
  });

  if (error) {
    throw new AuthOperationError(mapOAuthSignInError(error));
  }

  if (!data.url) {
    throw new AuthOperationError(OAUTH_GENERIC_ERROR_MESSAGE);
  }

  pendingOAuthFlowId = data.flowId ?? null;

  if (Platform.OS === 'web') {
    // On web Supabase navigates the browser to the provider. The callback route
    // completes the PKCE exchange when the user returns to the app.
    return 'success';
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (result.type === 'cancel' || result.type === 'dismiss') {
    return 'cancelled';
  }

  if (result.type !== 'success') {
    throw new AuthOperationError(OAUTH_GENERIC_ERROR_MESSAGE);
  }

  const callbackParams = parseAuthCallbackParams(parseDeepLinkParams(result.url));

  // A consent denial arrives as a redirect with an `access_denied` error.
  // Treat it like closing the browser: return to the form without a banner.
  if (isOAuthCancellation(callbackParams)) {
    return 'cancelled';
  }

  await completeOAuthCallback(callbackParams, data.flowId ?? undefined);

  return 'success';
}
