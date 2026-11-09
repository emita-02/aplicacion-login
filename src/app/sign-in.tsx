import { AuthScreen } from '@/features/auth/components/auth-screen';
import { SignInForm } from '@/features/auth/components/sign-in-form';

export default function SignInRoute() {
  return (
    <AuthScreen>
      <SignInForm />
    </AuthScreen>
  );
}
