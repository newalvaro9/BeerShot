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
            <h1>Logged in as {(session.user as any).username}</h1>
            <button onClick={() => signOut()}>Log out</button>
          </>

        ) : (
          <>
            <h1>Not logged in</h1>
            <button onClick={() => signIn()}>Log in</button>
            <button onClick={() => router.push(`/auth/register?callbackUrl=${encodeURIComponent(window.location.href)}`)}>Register</button>
          </>
        )
      }

    </Layout>
  )
}
