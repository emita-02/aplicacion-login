import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { useSignUpForm } from '../hooks/use-sign-up-form';
import type { SignUpOutcome } from '../services/auth-service';
import { AuthCard } from './auth-card';
import { AuthFooterLink } from './auth-footer-link';
import { FormBanner } from './form-banner';
import { FormField } from './form-field';
import { PrimaryButton } from './primary-button';

type SignUpResultPanelProps = {
  result: SignUpOutcome;
  onBackToSignIn: () => void;
};

function SignUpResultPanel({ result, onBackToSignIn }: SignUpResultPanelProps) {
  if (result.status === 'already-registered') {
    return (
      <AuthCard
        title="Esta cuenta ya existe"
        subtitle="El correo ingresado ya está registrado en Task-Do.">
        <FormBanner
          tone="info"
          message={`Ya existe una cuenta con ${result.email}. Inicia sesión para continuar.`}
        />
        <PrimaryButton label="Ir a iniciar sesión" onPress={onBackToSignIn} />
      </AuthCard>
    );
  }

  if (result.status === 'signed-in') {
    return (
      <AuthCard title="Cuenta creada" subtitle="Tu cuenta está lista para usarse.">
        <FormBanner tone="info" message="Serás redirigido a tus tareas." />
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Revisa tu correo"
      subtitle="Enviamos un enlace de confirmación para activar tu cuenta.">
      <View className="items-center">
        <View className="h-14 w-14 items-center justify-center rounded-full bg-taskdo-brown">
          <Text className="text-2xl font-bold text-taskdo-cream">✓</Text>
        </View>
      </View>

      <View className="gap-1.5 rounded-2xl border border-taskdo-gray bg-taskdo-blue px-4 py-3">
        <Text className="text-sm font-semibold text-taskdo-brown">{result.email}</Text>
        <Text className="text-sm leading-5 text-taskdo-brown">
          Abre el enlace del correo para confirmar tu cuenta. Si no lo encuentras, revisa la carpeta
          de spam.
        </Text>
      </View>

      <Text className="text-sm leading-5 text-taskdo-brown">
        Después de confirmar tu correo podrás iniciar sesión.
      </Text>

      <PrimaryButton label="Volver a iniciar sesión" onPress={onBackToSignIn} />
    </AuthCard>
  );
}

export function SignUpForm() {
  const { values, fieldErrors, formError, isSubmitting, result, setField, handleBlur, handleSubmit } =
    useSignUpForm();
  const router = useRouter();

  if (result) {
    return <SignUpResultPanel result={result} onBackToSignIn={() => router.replace('/sign-in')} />;
  }

  return (
    <AuthCard title="Crea tu cuenta" subtitle="Regístrate para empezar a organizar tus tareas.">
      {formError ? <FormBanner message={formError} /> : null}

      <View className="gap-4">
        <FormField
          label="Nombre completo"
          value={values.fullName}
          onChangeText={(value) => setField('fullName', value)}
          onBlur={() => handleBlur('fullName')}
          error={fieldErrors.fullName}
          placeholder="Tu nombre y apellido"
          autoCapitalize="words"
          autoCorrect={false}
          autoComplete="name"
          textContentType="name"
          returnKeyType="next"
        />
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
          placeholder="Mínimo 6 caracteres"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="next"
        />
        <FormField
          label="Confirmar contraseña"
          value={values.confirmPassword}
          onChangeText={(value) => setField('confirmPassword', value)}
          onBlur={() => handleBlur('confirmPassword')}
          error={fieldErrors.confirmPassword}
          placeholder="Repite tu contraseña"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="go"
          onSubmitEditing={handleSubmit}
        />
      </View>

      <PrimaryButton
        label="Registrarme"
        loadingLabel="Creando tu cuenta…"
        isLoading={isSubmitting}
        onPress={handleSubmit}
      />

      <AuthFooterLink prompt="¿Ya tienes cuenta?" actionLabel="Inicia sesión" href="/sign-in" />
    </AuthCard>
  );
}
