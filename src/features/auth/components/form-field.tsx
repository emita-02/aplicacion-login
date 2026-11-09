import { useState } from 'react';
import {
  Pressable,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

type FormFieldProps = Omit<TextInputProps, 'className' | 'style'> & {
  label: string;
  error?: string;
};

const PLACEHOLDER_COLOR = '#684f4899';

export function FormField({ label, error, secureTextEntry, ...inputProps }: FormFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordField = Boolean(secureTextEntry);
  const hasError = Boolean(error);

  return (
    <View className="gap-1.5">
      <Text className="text-sm font-semibold text-taskdo-brown">{label}</Text>
      <View
        className={`flex-row items-center rounded-2xl bg-taskdo-blue px-3 ${
          hasError ? 'border-2 border-taskdo-brown' : 'border border-taskdo-gray'
        }`}>
        <TextInput
          className="flex-1 py-3 text-base text-taskdo-brown"
          placeholderTextColor={PLACEHOLDER_COLOR}
          selectionColor="#684f48"
          secureTextEntry={isPasswordField && !isPasswordVisible}
          accessibilityLabel={label}
          {...inputProps}
        />
        {isPasswordField ? (
          <Pressable
            onPress={() => setIsPasswordVisible((current) => !current)}
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="px-2 py-2 active:opacity-70">
            <Text className="text-sm font-semibold text-taskdo-brown">
              {isPasswordVisible ? 'Ocultar' : 'Ver'}
            </Text>
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text accessibilityRole="alert" className="text-sm font-medium text-taskdo-brown">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
