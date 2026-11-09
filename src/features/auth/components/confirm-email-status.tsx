import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { useAuth } from '@/providers/auth-provider';

import { useConfirmEmail } from '../hooks/use-confirm-email';
import { AuthCard } from './auth-card';
import { FormBanner } from './form-banner';
import { PrimaryButton } from './primary-button';

const SUCCESS_REDIRECT_DELAY_MS = 2200;

export function ConfirmEmailStatus() {
  const { isAuthenticated } = useAuth();
  const { status, errorMessage } = useConfirmEmail();

  useEffect(() => {
    if (status !== 'success') {
      return;
    }

    const timeout = setTimeout(() => {
      router.replace('/');
    }, SUCCESS_REDIRECT_DELAY_MS);

    return () => clearTimeout(timeout);
  }, [status]);

  if (status === 'loading') {
    return (
      <AuthCard
        title="Confirmando tu correo"
        subtitle="Estamos verificando el enlace de confirmación.">
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
        title="¡Correo confirmado!"
        subtitle="Tu cuenta de Task-Do ya está activa.">
        <View accessibilityLiveRegion="polite" className="items-center gap-3">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-taskdo-brown">
            <Text className="text-2xl font-bold text-taskdo-cream">✓</Text>
          </View>
          <Text className="text-center text-sm leading-5 text-taskdo-brown">
            Tu correo quedó verificado correctamente. Te llevaremos a la
            aplicación en un momento.
          </Text>
        </View>
        <PrimaryButton label="Continuar ahora" onPress={() => router.replace('/')} />
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="No pudimos confirmar tu correo"
      subtitle="Revisa el enlace e inténtalo de nuevo.">
      <FormBanner
        message={
          errorMessage ??
          'No pudimos confirmar tu correo electrónico. Inténtalo de nuevo.'
        }
      />
      <PrimaryButton
        label={isAuthenticated ? 'Ir a Task-Do' : 'Volver al inicio de sesión'}
        onPress={() => router.replace(isAuthenticated ? '/' : '/sign-in')}
      />
    </AuthCard>
  );
}
