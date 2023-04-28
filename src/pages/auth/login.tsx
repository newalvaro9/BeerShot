import { useRef, useState } from 'react'
import { getSession, signIn } from "next-auth/react";
import { useRouter } from 'next/router';
import type { GetServerSideProps } from 'next/types';

import Layout from '@/components/layout';
import Alert from '@/components/alert';

import styles from '@/styles/Card.module.css';
import buttons from "@/styles/Buttons.module.css"

export default function Login() {

    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const [error, setError] = useState<string>("")

    const router = useRouter();

    const handleSignIn = () => {

        const username = usernameRef!.current!.value.trim();
        const password = passwordRef!.current!.value;

        if (!username || !password) {
            setError('Please, fill in all fields');
            return;
        }

        signIn('credentials', {
            redirect: false,
            username: username,
            password: password,
            type: "login",
        }).then(({ error }: any) => {
            if (!error || error.length === 0) {
                router.push('/');
            }
            else if (error === "CredencialesIncorrectas") {
                setError("Incorrect username or password");
            }
            else {
                setError("Server error, try again later");
            }
        })
    }

    return (
        <Layout title={"Iniciar sesión - BeerShoot"}>
            <form action="/api/auth/callback/credentials" method="POST">
                <div className={styles["card"]}>
                    <div className={styles["card-body"]}>
                        <h2 className={styles['title']}>Log in to continue</h2>

                        <Alert error={error} setError={setError} />

                        <div className={styles["forms"]}>

                            <div className={styles["form-group"]}>
                                <label className="label" htmlFor="username">
                                    Username
                                </label>
                                <input type="text" name="username" ref={usernameRef} required />
                            </div>

                            <div className={styles["form-group"]}>
                                <label className="label" htmlFor="password">
                                    Password
                                </label>
                                <input type="password" name="password" ref={passwordRef} required />
                            </div>
                        </div>

                        <button type="button" onClick={handleSignIn} className={`${styles["submit-input"]} ${buttons["button-3"]}`}>Log in</button>
                        <a className={styles['forgot']} href="/reset/password">Forgot your password?</a>
                    </div>
                </div>
            </form>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (session) {
        return {
            redirect: {
                destination: "/users",
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
}