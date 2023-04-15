import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter();

  if (session) {
    return (
      <>
        <h1>Has iniciado sesion</h1>
        <button onClick={() => signOut()}>Cerrar sesión</button>
      </>
    )
  }

  return (
    <>
      <h1>No has iniciado sesión</h1>
      <button onClick={() => signIn()}>Iniciar sesión</button>
      <button onClick={() => router.push(`/auth/register?callbackUrl=${encodeURIComponent(window.location.href)}`)}>Registrarse</button>
    </>
  )
}
