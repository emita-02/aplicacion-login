
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/auth-provider';

export default function ProfileScreen() {
  const { user } = useAuth();

  const initialName =
    typeof user?.user_metadata?.full_name === 'string'
      ? user.user_metadata.full_name
      : '';

  const [name, setName] = useState(initialName);
  const [nameInput, setNameInput] = useState(initialName);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);

  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    const updatedName =
      typeof user?.user_metadata?.full_name === 'string'
        ? user.user_metadata.full_name
        : '';

    setName(updatedName);
    setNameInput(updatedName);
  }, [user?.id, user?.user_metadata?.full_name]);

  const displayName = name.trim() || user?.email?.split('@')[0] || 'Usuario';

  const initial = displayName.charAt(0).toUpperCase();

  const isEmailVerified = Boolean(user?.email_confirmed_at);

  const handleSaveName = async () => {
    const trimmedName = nameInput.trim();

    if (!trimmedName) {
      Alert.alert('Nombre requerido', 'Ingresa tu nombre completo.');
      return;
    }

    if (trimmedName.length < 3) {
      Alert.alert('Nombre inválido', 'El nombre debe tener al menos 3 caracteres.');
      return;
    }

    if (trimmedName === name) {
      setIsEditingName(false);
      return;
    }

    setIsSavingName(true);

    const { data, error } = await supabase.auth.updateUser({
      data: {
        ...user?.user_metadata,
        full_name: trimmedName,
      },
    });

    setIsSavingName(false);

    if (error) {
      Alert.alert('Error', 'No se pudo actualizar el nombre. Inténtalo nuevamente.');
      return;
    }

    const savedName =
      typeof data.user.user_metadata.full_name === 'string'
        ? data.user.user_metadata.full_name
        : trimmedName;

    setName(savedName);
    setNameInput(savedName);
    setIsEditingName(false);

    Alert.alert('Perfil actualizado', 'Tu nombre se actualizó correctamente.');
  };

  const handleChangePassword = async () => {
    if (!user?.email) {
      Alert.alert('Error', 'No se encontró el correo de tu cuenta.');
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Campos incompletos', 'Completa todos los campos.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Contraseña inválida', 'La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Contraseñas diferentes', 'Las contraseñas nuevas no coinciden.');
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert('Contraseña inválida', 'La nueva contraseña debe ser diferente a la actual.');
      return;
    }

    setIsUpdatingPassword(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      setIsUpdatingPassword(false);
      Alert.alert('Contraseña incorrecta', 'Verifica tu contraseña actual.');
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setIsUpdatingPassword(false);

    if (error) {
      Alert.alert('Error', 'No se pudo actualizar la contraseña. Inténtalo nuevamente.');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordModalVisible(false);

    Alert.alert('Contraseña actualizada', 'Tu contraseña se cambió correctamente.');
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que deseas salir de tu cuenta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase.auth.signOut();

            if (error) {
              Alert.alert('Error', 'No se pudo cerrar la sesión.');
            }
          },
        },
      ],
    );
  };

  return (
    <View className="flex-1 bg-taskdo-blue">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="flex-grow px-5 pb-8 pt-6"
      >
        <Text className="mb-6 text-2xl font-bold text-taskdo-brown">
          Perfil de Usuario
        </Text>

        {/* Información del usuario */}
        <View className="mb-5 items-center rounded-3xl border border-taskdo-gray bg-white px-5 py-7">
          <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-taskdo-brown">
            <Text className="text-3xl font-bold text-taskdo-cream">
              {initial}
            </Text>
          </View>

          <Text className="text-xl font-bold text-taskdo-brown">
            {displayName}
          </Text>

          <Text className="mt-1 text-sm text-taskdo-brown/60">
            {user?.email}
          </Text>

          <View className="mt-4 rounded-full bg-taskdo-cream px-4 py-2">
            <Text className="text-xs font-semibold text-taskdo-brown">
              {isEmailVerified ? '✓ Cuenta Verificada' : 'Correo pendiente de verificación'}
            </Text>
          </View>
        </View>

        {/* Editar nombre */}
        <View className="mb-4 rounded-3xl border border-taskdo-gray bg-white p-5">
          <Text className="mb-4 text-lg font-bold text-taskdo-brown">
            Información personal
          </Text>

          <Text className="mb-2 text-sm font-semibold text-taskdo-brown">
            Nombre completo
          </Text>

          {isEditingName ? (
            <>
              <TextInput
                value={nameInput}
                onChangeText={setNameInput}
                placeholder="Ingresa tu nombre"
                placeholderTextColor="#9A8B85"
                autoCapitalize="words"
                autoCorrect={false}
                className="rounded-xl border border-taskdo-gray bg-taskdo-blue/40 px-4 py-3 text-base text-taskdo-brown"
              />

              <View className="mt-4 flex-row gap-3">
                <Pressable
                  onPress={() => {
                    setNameInput(name);
                    setIsEditingName(false);
                  }}
                  disabled={isSavingName}
                  className="flex-1 items-center rounded-xl border border-taskdo-gray py-3"
                >
                  <Text className="font-semibold text-taskdo-brown">
                    Cancelar
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleSaveName}
                  disabled={isSavingName}
                  className="flex-1 items-center rounded-xl bg-taskdo-brown py-3"
                >
                  {isSavingName ? (
                    <ActivityIndicator color="#F9E7C7" />
                  ) : (
                    <Text className="font-semibold text-white">
                      Guardar
                    </Text>
                  )}
                </Pressable>
              </View>
            </>
          ) : (
            <View className="flex-row items-center justify-between">
              <Text className="flex-1 text-base text-taskdo-brown">
                {displayName}
              </Text>

              <Pressable
                onPress={() => {
                  setNameInput(name);
                  setIsEditingName(true);
                }}
                className="rounded-xl bg-taskdo-cream px-4 py-2"
              >
                <Text className="font-semibold text-taskdo-brown">
                  Editar
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Seguridad */}
        <View className="mb-5 rounded-3xl border border-taskdo-gray bg-white p-5">
          <Text className="mb-4 text-lg font-bold text-taskdo-brown">
            Seguridad
          </Text>

          <Pressable
            onPress={() => setPasswordModalVisible(true)}
            className="flex-row items-center justify-between rounded-2xl bg-taskdo-blue/40 p-4"
          >
            <View className="flex-1">
              <Text className="font-semibold text-taskdo-brown">
                Cambiar contraseña
              </Text>
              <Text className="mt-1 text-xs text-taskdo-brown/60">
                Actualiza la contraseña de tu cuenta
              </Text>
            </View>

            <Text className="text-xl text-taskdo-brown">›</Text>
          </Pressable>

          <View className="mt-4 rounded-2xl bg-taskdo-cream/60 p-4">
            <Text className="font-semibold text-taskdo-brown">
              Estado de la cuenta
            </Text>
            <Text className="mt-2 text-sm text-taskdo-brown">
              Estado: Usuario activo
            </Text>
            <Text className="mt-1 text-sm text-taskdo-brown">
              Seguridad: Sesión protegida
            </Text>
          </View>
        </View>

        {/* Cerrar sesión */}
        <Pressable
          onPress={handleLogout}
          className="items-center rounded-2xl border border-red-200 bg-white py-4"
        >
          <Text className="font-bold text-red-600">
            Cerrar Sesión
          </Text>
        </Pressable>
      </ScrollView>

      {/* Modal de cambio de contraseña */}
      <Modal
        visible={passwordModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1 justify-center bg-black/40 px-5"
        >
          <View className="rounded-3xl bg-white p-6">
            <Text className="mb-2 text-xl font-bold text-taskdo-brown">
              Cambiar contraseña
            </Text>

            <Text className="mb-5 text-sm text-taskdo-brown/60">
              Ingresa tu contraseña actual y establece una nueva.
            </Text>

            <Text className="mb-2 text-sm font-semibold text-taskdo-brown">
              Contraseña actual
            </Text>
            <TextInput
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              autoCapitalize="none"
              placeholder="Tu contraseña actual"
              className="mb-4 rounded-xl border border-taskdo-gray bg-taskdo-blue/40 px-4 py-3 text-taskdo-brown"
            />

            <Text className="mb-2 text-sm font-semibold text-taskdo-brown">
              Nueva contraseña
            </Text>
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              autoCapitalize="none"
              placeholder="Mínimo 6 caracteres"
              className="mb-4 rounded-xl border border-taskdo-gray bg-taskdo-blue/40 px-4 py-3 text-taskdo-brown"
            />

            <Text className="mb-2 text-sm font-semibold text-taskdo-brown">
              Confirmar nueva contraseña
            </Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              placeholder="Repite la nueva contraseña"
              className="mb-5 rounded-xl border border-taskdo-gray bg-taskdo-blue/40 px-4 py-3 text-taskdo-brown"
            />

            <View className="flex-row gap-3">
              <Pressable
                onPress={() => {
                  setPasswordModalVisible(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                disabled={isUpdatingPassword}
                className="flex-1 items-center rounded-xl border border-taskdo-gray py-3"
              >
                <Text className="font-semibold text-taskdo-brown">
                  Cancelar
                </Text>
              </Pressable>

              <Pressable
                onPress={handleChangePassword}
                disabled={isUpdatingPassword}
                className="flex-1 items-center rounded-xl bg-taskdo-brown py-3"
              >
                {isUpdatingPassword ? (
                  <ActivityIndicator color="#F9E7C7" />
                ) : (
                  <Text className="font-semibold text-white">
                    Actualizar
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
