import { AuthScreen } from '@/features/auth/components/auth-screen';
import { SignUpForm } from '@/features/auth/components/sign-up-form';

export default function SignUpRoute() {
  return (
    <AuthScreen>
      <SignUpForm />
    </AuthScreen>
  );
}
