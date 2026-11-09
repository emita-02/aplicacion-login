import { Text, View } from 'react-native';

import { useAuth } from '@/providers/auth-provider';

export function HomeHeader() {
  const { user } = useAuth();

  const fullName = user?.user_metadata?.full_name;

  const userName =
    typeof fullName === 'string' && fullName.trim().length > 0
      ? fullName.trim().split(' ')[0]
      : user?.email?.split('@')[0] ?? 'Usuario';

  const currentDate = new Date().toLocaleDateString('es-EC', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const formattedDate =
    currentDate.charAt(0).toUpperCase() + currentDate.slice(1);

  return (
    <View className="rounded-b-[28px] bg-taskdo-brown px-6 pb-8 pt-5">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-bold text-white">
            Task-Do
          </Text>

          <Text className="mt-1 text-sm text-taskdo-cream">
            Organiza tu día
          </Text>
        </View>

        <View className="h-12 w-12 items-center justify-center rounded-full bg-taskdo-cream">
          <Text className="text-xl font-bold text-taskdo-brown">
            {userName.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>

      <View className="mt-8">
        <Text className="text-3xl font-bold text-white">
          ¡Hola, {userName}!
        </Text>

        <Text className="mt-2 text-base text-taskdo-cream">
          ¿Qué planes tienes para hoy?
        </Text>

        <Text className="mt-5 text-sm text-white">
          {formattedDate}
        </Text>
      </View>
    </View>
  );
}