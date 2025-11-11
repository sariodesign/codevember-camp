import Link from 'next/link';

export default function Home() {
  return (
    <div className='w-full h-screen flex flex-col items-center justify-center gap-4'>
      <Link href='/signup'>Registrati</Link>
      <Link href='/login'>Accedi</Link>
    </div>
  );
}
