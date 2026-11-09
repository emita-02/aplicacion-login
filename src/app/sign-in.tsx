import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

/**
 * Temporary route anchor for unauthenticated users.
 * The sign-in form will be implemented in the next stage.
 */
export default function SignInRoute() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.content}>
        <ThemedText type="subtitle">Task-Do</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.subtitle}>
          Organiza. Prioriza. Cumple.
        </ThemedText>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
  },
  subtitle: {
    textAlign: 'center',
  },
});
