import type { PropsWithChildren } from 'react';
import { Text, View } from 'react-native';

type AuthCardProps = PropsWithChildren<{
  title: string;
  subtitle: string;
}>;

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <View className="gap-5 rounded-3xl border border-taskdo-gray bg-taskdo-cream p-5 shadow-sm">
      <View className="gap-1">
        <Text className="text-xl font-bold text-taskdo-brown">{title}</Text>
        <Text className="text-sm leading-5 text-taskdo-brown">{subtitle}</Text>
      </View>
      {children}
    </View>
  );
}
