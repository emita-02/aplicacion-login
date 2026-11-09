import { ActivityIndicator, Pressable, Text, View } from 'react-native';

type GoogleSignInButtonProps = {
  isLoading?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export function GoogleSignInButton({
  isLoading = false,
  disabled = false,
  onPress,
}: GoogleSignInButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      className={`min-h-12 flex-row items-center justify-center gap-2 rounded-2xl border border-taskdo-gray bg-taskdo-blue px-5 py-3.5 ${
        isDisabled ? 'opacity-60' : 'active:opacity-80'
      }`}>
      {isLoading ? (
        <ActivityIndicator size="small" colorClassName="accent-taskdo-brown" />
      ) : (
        <View className="h-6 w-6 items-center justify-center rounded-full bg-taskdo-cream">
          <Text className="text-sm font-bold text-taskdo-brown">G</Text>
        </View>
      )}
      <Text className="text-base font-semibold text-taskdo-brown">
        {isLoading ? 'Conectando con Google…' : 'Continuar con Google'}
      </Text>
    </Pressable>
  );
}
