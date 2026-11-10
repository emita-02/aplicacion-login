import { router } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';

import { useAuth } from '@/providers/auth-provider';

import { useOAuthCallback } from '../hooks/use-oauth-callback';
import { AuthCard } from './auth-card';
import { FormBanner } from './form-banner';
import { PrimaryButton } from './primary-button';


export function OAuthCallbackStatus() {
  const { isAuthenticated } = useAuth();
  const { status, errorMessage } = useOAuthCallback();


  if (status === 'loading') {
    return (
      <AuthCard
        title="Conectando con Google"
        subtitle="Estamos completando tu inicio de sesión.">
        <View
          accessibilityLiveRegion="polite"
          accessibilityRole="progressbar"
          className="items-center gap-3 py-2">
          <ActivityIndicator size="large" colorClassName="accent-taskdo-brown" />
          <Text className="text-sm font-medium text-taskdo-brown">
            Un momento, por favor…
          </Text>
        </View>
      </AuthCard>
    );
  }

  if (status === 'success') {
    return (
      <AuthCard
        title="¡Sesión iniciada!"
        subtitle="Ya puedes organizar tus tareas en Task-Do.">
        <View accessibilityLiveRegion="polite" className="items-center gap-3">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-taskdo-brown">
            <Text className="text-2xl font-bold text-taskdo-cream">✓</Text>
          </View>
          <Text className="text-center text-sm leading-5 text-taskdo-brown">
            Tu cuenta de Google quedó conectada correctamente. Presiona 
            <Text className="font-bold" > continuar </Text> 
            para ingresar a la aplicación.
          </Text>
        </View>
        <PrimaryButton label="Continuar ahora" onPress={() => router.replace('/')} />
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="No pudimos iniciar sesión con Google"
      subtitle="Vuelve a intentarlo desde el inicio de sesión.">
      <FormBanner
        message={errorMessage ?? 'No pudimos iniciar sesión con Google. Inténtalo de nuevo.'}
      />
      <PrimaryButton
        label={isAuthenticated ? 'Ir a Task-Do' : 'Volver al inicio de sesión'}
        onPress={() => router.replace(isAuthenticated ? '/' : '/sign-in')}
      />
    </AuthCard>
  );
}
