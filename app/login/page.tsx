import LoginForm from '@/components/forms/LoginForm';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '../actions/getCurrentUser';

export default async function LoginPage() {
  const { data } = await getCurrentUser()

  if (data.user) {
    redirect("/test-login")
  }


  return (
    <div className="w-full h-screen flex">
      <LoginForm />
    </div>
  );
}
