import { useRef, useState } from 'react'
import { signIn } from "next-auth/react";
import { useRouter } from 'next/router';
import Layout from '@/components/layout';
import styles from '../../styles/Login.module.css';
import buttons from '../../styles/Buttons.module.css'

export default function Register() {

    const emailRef = useRef<HTMLInputElement>(null)
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirm_passwordRef = useRef<HTMLInputElement>(null)

    const [showError, setShowError] = useState(false);
    const [error, setError] = useState<string>("")

    const router = useRouter();

    const handleSignIn = () => {

        if (passwordRef === confirm_passwordRef) {
            signIn('credentials', {
                redirect: false,
                email: emailRef!.current!.value,
                username: usernameRef!.current!.value,
                password: passwordRef!.current!.value,
                type: "register",
            }).then(({ error }: any) => {
                if (!error || error.length === 0) {
                    router.push('/');
                }
                else if (error === "EmailPicked") {
                    setShowError(true);
                    setError("El correo electrónico ya está en uso");
                }
                else if (error === "UsernamePicked") {
                    setShowError(true);
                    setError("El nombre de usuario ya está en uso");
                }
                else {
                    setShowError(true);
                    setError("Hubo un error al registrarte")
                }
            })
        } else {
            setShowError(true)
            setError("Las contraseñas no coinciden")
        }
    }

    return (
        <Layout title={"Register - Climbing Up"}>
            <form action="/api/auth/callback/credentials" method="POST">
                <div className={styles["up-login-card"]}>
                    <div className={styles["login-card"]}>
                        <h2 style={{ "textAlign": "center", "color": "#eff3f5" }}>Register</h2>

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
                                    Email
                                </label>
                                <input className={styles["email-input"]} type="text" name="email" ref={emailRef} required />
                            </div>

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

                            <div className={styles["form-group"]}>
                                <label className="label" htmlFor="username">
                                    Confirm password
                                </label>
                                <input className={styles["confirm_password-input"]} type="password" name="confirm_password" ref={confirm_passwordRef} required />
                            </div>
                        </div>

                        <button type="button" onClick={handleSignIn} className={`${styles["submit-input"]} ${buttons["button-3"]}`}>Register</button>
                    </div>
                </div>
            </form>
        </Layout>
    )
}