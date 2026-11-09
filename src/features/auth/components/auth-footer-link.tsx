import { Link, type Href } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

type AuthFooterLinkProps = {
  prompt: string;
  actionLabel: string;
  href: Href;
};

export function AuthFooterLink({ prompt, actionLabel, href }: AuthFooterLinkProps) {
  return (
    <View className="flex-row flex-wrap items-center justify-center gap-1">
      <Text className="text-sm text-taskdo-brown">{prompt}</Text>
      <Link href={href} asChild>
        <Pressable accessibilityRole="link" className="active:opacity-70">
          <Text className="text-sm font-semibold text-taskdo-brown underline">{actionLabel}</Text>
        </Pressable>
      </Link>
    </View>
  );
}
