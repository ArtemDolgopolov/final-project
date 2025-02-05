import { auth } from "better-auth"; // Импорт хука напрямую
import Link from 'next/link';

export default async function Home() {
  const { data: session } = await auth.getSession()

  if (status === "loading") {
    return <p>Загрузка...</p>;
  }

  return (
    <div>
      <h1>Добро пожаловать!</h1>
      {session ? (
        <Link href="/create-form">
          <button>Перейти к редактору форм</button>
        </Link>
      ) : (
        <p>Пожалуйста, войдите в систему.</p>
      )}
    </div>
  );
}