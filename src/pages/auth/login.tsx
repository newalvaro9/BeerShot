import { useRef, useState } from 'react'
import { signIn } from "next-auth/react";
import { useRouter } from 'next/router';

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
        signIn('credentials', {
            redirect: false,
            username: usernameRef!.current!.value,
            password: passwordRef!.current!.value,
            type: "login",
        }).then(({ error }: any) => {
            if (!error || error.length === 0) {
                router.push('/');
            }
            else if (error === "CredencialesIncorrectas") {
                setError("Usuario o contraseña incorrecto.");
            }
            else {
                setError("Error en el servidor. Intente de nuevo");
            }
        })
    }

    return (
        <Layout title={"Login - BeerShoot"}>
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

                        <button type="button" onClick={handleSignIn} className={`${styles["submit-input"]} ${buttons["button-3"]}`}>Login</button>
                        <a className={styles['forgot']} href="/reset/password">¿Ha olvidado su contraseña?</a>
                    </div>
                </div>
            </form>
        </Layout>
    )
}
