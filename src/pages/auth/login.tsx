import { useEffect, useRef, useState } from 'react'
import { signIn } from "next-auth/react";
import { useRouter } from 'next/router';
import Layout from '@/components/layout';
import styles from '@/styles/Login.module.css';
import buttons from "@/styles/Buttons.module.css"

export default function Login() {

    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const [showError, setShowError] = useState(false);
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
                setShowError(true)
                setError("Usuario o contraseña incorrecto.");
            }
            else {
                setShowError(true)
                setError("Error en el servidor. Intente de nuevo");
            }
        })
    }

    return (
        <Layout title={"Login - Climbing Up"}>
            <form action="/api/auth/callback/credentials" method="POST">
                <div className={styles["up-login-card"]}>
                    <div className={styles["login-card"]}>
                        <h2 style={{ "textAlign": "center", "color": "#eff3f5" }}>Log in to continue</h2>

                        {error ? (
                            <div className="alert" style={{ display: showError ? 'block' : 'none' }}>
                                <span className="closebtn" onClick={() => setShowError(prev => !prev)}>&times;</span>
                                {error}
                            </div>
                        ) : <></>
                        }


                        <div className={styles["login-forms"]}>

                            <div className={styles["form-group"]}>
                                <label className="label" htmlFor="username">
                                    Username
                                </label>
                                <input className={styles["username-input"]} type="text" name="username" ref={usernameRef} required />
                            </div>

                            <div className={styles["form-group"]}>
                                <label className="label" htmlFor="password">
                                    Password
                                </label>
                                <input className={styles["password-input"]} type="password" name="password" ref={passwordRef} required />
                            </div>
                        </div>

                        <button type="button" onClick={handleSignIn} className={`${styles["submit-input"]} ${buttons["button-3"]}`}>Login</button>
                    </div>
                </div>
            </form>
        </Layout>
    )
}
