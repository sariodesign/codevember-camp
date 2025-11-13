import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function Instruments() {
    const cookieStore = await cookies()
    const supabase = await createClient();
    const { data: Instruments } = await supabase.from("instruments").select();

    return <pre>{JSON.stringify(Instruments, null, 2)}</pre>
}