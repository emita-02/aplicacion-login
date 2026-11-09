import { AuthScreen } from '@/features/auth/components/auth-screen';
import { ConfirmEmailStatus } from '@/features/auth/components/confirm-email-status';

export default function ConfirmEmailRoute() {
  return (
    <AuthScreen>
      <ConfirmEmailStatus />
    </AuthScreen>
  );
}
