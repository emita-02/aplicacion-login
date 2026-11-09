import { Text, View } from 'react-native';

type FormBannerProps = {
  message: string;
  tone?: 'error' | 'info';
};

export function FormBanner({ message, tone = 'error' }: FormBannerProps) {
  return (
    <View
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      className={`rounded-2xl border px-4 py-3 ${
        tone === 'error' ? 'border-taskdo-brown bg-taskdo-blue' : 'border-taskdo-gray bg-taskdo-blue'
      }`}>
      <Text className="text-sm font-medium text-taskdo-brown">{message}</Text>
    </View>
  );
}
