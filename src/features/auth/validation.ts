import type { SignInFieldErrors, SignInValues, SignUpFieldErrors, SignUpValues } from './types/auth';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(value: string) {
  return value.trim();
}

export function normalizeFullName(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

export function validateEmail(value: string) {
  const email = normalizeEmail(value);

  if (!email) {
    return 'Ingresa tu correo electrónico.';
  }

  if (!EMAIL_PATTERN.test(email)) {
    return 'Ingresa un correo electrónico válido.';
  }

  return undefined;
}

export function validatePassword(value: string) {
  if (!value) {
    return 'Ingresa tu contraseña.';
  }

  if (value.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres.';
  }

  if (!/\p{L}/u.test(value) || !/\d/.test(value)) {
    return 'La contraseña debe incluir al menos una letra y un número.';
  }

  return undefined;
}

export function validateFullName(value: string) {
  const fullName = normalizeFullName(value);

  if (!fullName) {
    return 'Ingresa tu nombre completo.';
  }

  if (fullName.replace(/\s/g, '').length < 3) {
    return 'El nombre debe tener al menos 3 caracteres.';
  }

  return undefined;
}

export function validatePasswordConfirmation(password: string, confirmation: string) {
  if (!confirmation) {
    return 'Confirma tu contraseña.';
  }

  if (password !== confirmation) {
    return 'Las contraseñas no coinciden.';
  }

  return undefined;
}

export function validateSignInForm(values: SignInValues): SignInFieldErrors {
  const errors: SignInFieldErrors = {};
  const emailError = validateEmail(values.email);
  const passwordError = validatePassword(values.password);

  if (emailError) {
    errors.email = emailError;
  }

  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
}

export function validateSignUpForm(values: SignUpValues): SignUpFieldErrors {
  const errors: SignUpFieldErrors = {};
  const fullNameError = validateFullName(values.fullName);
  const emailError = validateEmail(values.email);
  const passwordError = validatePassword(values.password);
  const confirmationError = validatePasswordConfirmation(values.password, values.confirmPassword);

  if (fullNameError) {
    errors.fullName = fullNameError;
  }

  if (emailError) {
    errors.email = emailError;
  }

  if (passwordError) {
    errors.password = passwordError;
  }

  if (confirmationError) {
    errors.confirmPassword = confirmationError;
  }

  return errors;
}
