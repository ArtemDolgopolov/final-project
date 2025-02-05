import { betterAuthClient } from '@/lib/client';
import { useRouter } from 'next/navigation';
import { FormEditor } from '../components/FormEditor';

export default function FormEditorPage() {
 const { data: session } = betterAuthClient.useSession();
  const router = useRouter();

  if (!session?.user) {
    if (typeof window !== 'undefined') {
      router.push('/');
    }
    return null;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Редактор формы</h1>
      <FormEditor />
    </div>
  );
}