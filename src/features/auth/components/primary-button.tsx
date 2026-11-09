import { ActivityIndicator, Pressable, Text } from 'react-native';

type PrimaryButtonProps = {
  label: string;
  loadingLabel?: string;
  isLoading?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export function PrimaryButton({
  label,
  loadingLabel = 'Procesando…',
  isLoading = false,
  disabled = false,
  onPress,
}: PrimaryButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      className={`min-h-12 flex-row items-center justify-center gap-2 rounded-2xl bg-taskdo-brown px-5 py-3.5 ${
        isDisabled ? 'opacity-60' : 'active:opacity-80'
      }`}>
      {isLoading ? <ActivityIndicator size="small" colorClassName="accent-taskdo-cream" /> : null}
      <Text className="text-base font-semibold text-taskdo-cream">
        {isLoading ? loadingLabel : label}
      </Text>
    </Pressable>
  );
}
