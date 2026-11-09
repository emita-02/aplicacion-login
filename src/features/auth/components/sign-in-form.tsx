import { Text, View } from 'react-native';

import { useSignInForm } from '../hooks/use-sign-in-form';
import { AuthCard } from './auth-card';
import { AuthFooterLink } from './auth-footer-link';
import { FormBanner } from './form-banner';
import { FormField } from './form-field';
import { GoogleSignInButton } from './google-sign-in-button';
import { PrimaryButton } from './primary-button';

export function SignInForm() {
  const {
    values,
    fieldErrors,
    formError,
    isSubmitting,
    isGoogleSubmitting,
    setField,
    handleBlur,
    handleSubmit,
    handleGoogleSignIn,
  } = useSignInForm();

  return (
    <AuthCard title="Inicia sesión" subtitle="Accede para continuar organizando tus tareas.">
      {formError ? <FormBanner message={formError} /> : null}

      <View className="gap-4">
        <FormField
          label="Correo electrónico"
          value={values.email}
          onChangeText={(value) => setField('email', value)}
          onBlur={() => handleBlur('email')}
          error={fieldErrors.email}
          placeholder="tu@correo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
        />
        <FormField
          label="Contraseña"
          value={values.password}
          onChangeText={(value) => setField('password', value)}
          onBlur={() => handleBlur('password')}
          error={fieldErrors.password}
          placeholder="Tu contraseña"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={handleSubmit}
        />
      </View>

      <PrimaryButton
        label="Iniciar sesión"
        loadingLabel="Iniciando sesión…"
        isLoading={isSubmitting}
        disabled={isGoogleSubmitting}
        onPress={handleSubmit}
      />

      <View className="flex-row items-center gap-3">
        <View className="h-px flex-1 bg-taskdo-gray" />
        <Text className="text-xs font-medium text-taskdo-brown">o</Text>
        <View className="h-px flex-1 bg-taskdo-gray" />
      </View>

      <GoogleSignInButton
        isLoading={isGoogleSubmitting}
        disabled={isSubmitting}
        onPress={handleGoogleSignIn}
      />

      <AuthFooterLink prompt="¿Aún no tienes cuenta?" actionLabel="Regístrate" href="/sign-up" />
    </AuthCard>
  );
}
