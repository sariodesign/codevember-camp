import LoginForm from '@/components/forms/LoginForm';
import { checkSession } from '../actions/checkSession';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const { data } = await checkSession()

  if (data.session) {
    redirect("/test-login")
  }


  return (
    <div className="w-full h-screen flex">
      <LoginForm />
    </div>
  );
}
