import { useCallback, useState } from 'react';

import { AuthOperationError, signUpWithEmail, type SignUpOutcome } from '../services/auth-service';
import type { SignUpFieldErrors, SignUpValues } from '../types/auth';
import {
  normalizeFullName,
  validateEmail,
  validateFullName,
  validatePassword,
  validatePasswordConfirmation,
  validateSignUpForm,
} from '../validation';

const GENERIC_ERROR_MESSAGE = 'No pudimos crear tu cuenta. Inténtalo de nuevo.';

export function useSignUpForm() {
  const [values, setValues] = useState<SignUpValues>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState<SignUpFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SignUpOutcome | null>(null);

  const clearFieldError = useCallback((field: keyof SignUpValues) => {
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
    (field: keyof SignUpValues, value: string) => {
      setValues((current) => ({ ...current, [field]: value }));
      setFormError(null);
      clearFieldError(field);

      if (field === 'password') {
        clearFieldError('confirmPassword');
      }
    },
    [clearFieldError]
  );

  const handleBlur = useCallback(
    (field: keyof SignUpValues) => {
      const value = values[field];

      if (!value.trim()) {
        return;
      }

      let message: string | undefined;

      switch (field) {
        case 'fullName':
          message = validateFullName(value);
          break;
        case 'email':
          message = validateEmail(value);
          break;
        case 'password':
          message = validatePassword(value);
          break;
        case 'confirmPassword':
          message = validatePasswordConfirmation(values.password, value);
          break;
      }

      if (!message) {
        clearFieldError(field);
        return;
      }

      setFieldErrors((current) => ({ ...current, [field]: message }));
    },
    [clearFieldError, values]
  );

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) {
      return;
    }

    const normalizedValues: SignUpValues = {
      fullName: normalizeFullName(values.fullName),
      email: values.email.trim(),
      password: values.password,
      confirmPassword: values.confirmPassword,
    };
    const errors = validateSignUpForm(normalizedValues);

    setFieldErrors(errors);
    setFormError(null);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const outcome = await signUpWithEmail(normalizedValues);
      setResult(outcome);
    } catch (error) {
      setFormError(error instanceof AuthOperationError ? error.message : GENERIC_ERROR_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, values]);

  return {
    values,
    fieldErrors,
    formError,
    isSubmitting,
    result,
    setField,
    handleBlur,
    handleSubmit,
  };
}
