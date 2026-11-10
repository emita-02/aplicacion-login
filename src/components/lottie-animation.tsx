
import LottieView from 'lottie-react-native';
import { View } from 'react-native';

const animations = {
  loading: require('@/assets/animations/loading.json'),
  success: require('@/assets/animations/success.json'),
  error: require('@/assets/animations/error.json'),
  emptyList: require('@/assets/animations/empty-list.json'),
};

type AnimationName = keyof typeof animations;

type LottieAnimationProps = {
  name: AnimationName;
  size?: number;
  loop?: boolean;
  autoPlay?: boolean;
};

export function LottieAnimation({
  name,
  size = 160,
  loop = false,
  autoPlay = true,
}: LottieAnimationProps) {
  return (
    <View className="items-center justify-center">
      <LottieView
        source={animations[name]}
        autoPlay={autoPlay}
        loop={loop}
        style={{ width: size, height: size }}
      />
    </View>
  );
}
