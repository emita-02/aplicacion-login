import { useCallback, useState } from 'react';

import { AuthOperationError, signInWithEmail, signInWithGoogle } from '../services/auth-service';
import type { SignInFieldErrors, SignInValues } from '../types/auth';
import { validateEmail, validatePassword, validateSignInForm } from '../validation';

const GENERIC_ERROR_MESSAGE = 'No pudimos iniciar sesión. Inténtalo de nuevo.';

export function useSignInForm() {
  const [values, setValues] = useState<SignInValues>({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState<SignInFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const clearFieldError = useCallback((field: keyof SignInValues) => {
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }, []);

  const setField = useCallback(
    (field: keyof SignInValues, value: string) => {
      setValues((current) => ({ ...current, [field]: value }));
      setFormError(null);
      clearFieldError(field);
    },
    [clearFieldError]
  );

  const handleBlur = useCallback(
    (field: keyof SignInValues) => {
      const value = values[field];

      if (!value.trim()) {
        return;
      }

      const message = field === 'email' ? validateEmail(value) : validatePassword(value);

      if (!message) {
        clearFieldError(field);
        return;
      }

      setFieldErrors((current) => ({ ...current, [field]: message }));
    },
    [clearFieldError, values]
  );

  const handleSubmit = useCallback(async () => {
    if (isSubmitting || isGoogleSubmitting) {
      return;
    }

    const normalizedValues: SignInValues = {
      email: values.email.trim(),
      password: values.password,
    };
    const errors = validateSignInForm(normalizedValues);

    setFieldErrors(errors);
    setFormError(null);

    if (errors.email || errors.password) {
      return;
    }

    setIsSubmitting(true);

    try {
      await signInWithEmail(normalizedValues);
      // The AuthProvider receives the new session and the protected route
      // replaces this screen. Keep the button disabled until that happens.
    } catch (error) {
      setFormError(error instanceof AuthOperationError ? error.message : GENERIC_ERROR_MESSAGE);
      setIsSubmitting(false);
    }
  }, [isSubmitting, isGoogleSubmitting, values]);

  const handleGoogleSignIn = useCallback(async () => {
    if (isSubmitting || isGoogleSubmitting) {
      return;
    }

    setFormError(null);
    setIsGoogleSubmitting(true);

    try {
      const outcome = await signInWithGoogle();

      // A cancelled flow returns to the form without an error message. A
      // successful flow keeps the button disabled until the new session
      // replaces this screen.
      if (outcome === 'cancelled') {
        setIsGoogleSubmitting(false);
      }
    } catch (error) {
      setFormError(
        error instanceof AuthOperationError ? error.message : GENERIC_ERROR_MESSAGE
      );
      setIsGoogleSubmitting(false);
    }
  }, [isSubmitting, isGoogleSubmitting]);

  return {
    values,
    fieldErrors,
    formError,
    isSubmitting,
    isGoogleSubmitting,
    setField,
    handleBlur,
    handleSubmit,
    handleGoogleSignIn,
  };
}
