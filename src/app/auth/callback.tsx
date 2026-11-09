import { AuthScreen } from '@/features/auth/components/auth-screen';
import { OAuthCallbackStatus } from '@/features/auth/components/oauth-callback-status';

export default function OAuthCallbackRoute() {
  return (
    <AuthScreen>
      <OAuthCallbackStatus />
    </AuthScreen>
  );
}
