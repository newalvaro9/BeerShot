import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout';

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter();

  return (
    <Layout>
      {
        session ? (
          <>
            <h1>Has iniciado sesion</h1>
            <button onClick={() => signOut()}>Cerrar sesión</button>
          </>

        ) : (
          <>
            <h1>No has iniciado sesión</h1>
            <button onClick={() => signIn()}>Iniciar sesión</button>
            <button onClick={() => router.push(`/auth/register?callbackUrl=${encodeURIComponent(window.location.href)}`)}>Registrarse</button>
          </>
        )
      }

    </Layout>
  )
}
