import type { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AuthScreenProps = PropsWithChildren;

function AuthBrandHeader() {
  return (
    <View className="items-center gap-2">
      <View className="h-16 w-16 items-center justify-center rounded-3xl bg-taskdo-brown shadow-md">
        <Text className="text-2xl font-bold tracking-wide text-taskdo-cream">TD</Text>
      </View>
      <Text className="text-3xl font-bold text-taskdo-brown">Task-Do</Text>
      <Text className="text-sm font-medium text-taskdo-brown">Organiza. Prioriza. Cumple.</Text>
    </View>
  );
}

export function AuthScreen({ children }: AuthScreenProps) {
  return (
    <View className="flex-1 bg-taskdo-blue">
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerClassName="flex-grow justify-center px-5 py-8"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View className="w-full max-w-md self-center gap-6">
              <AuthBrandHeader />
              {children}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
});
