import { useRef, useState } from 'react'
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

import Layout from '@/components/layout';

import styles from '../../styles/Login.module.css';
import buttons from '../../styles/Buttons.module.css'

import toAsterisk from '../../../utils/toAsterisk';
import validateEmail from '../../../utils/validateEmail';

import connect from '../../../lib/database/database';
import users from '../../../lib/database/models/users';
import { signOut } from 'next-auth/react';

export default function ResetEmail({ code }: { code: string | null }) {

    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const repeatPasswordRef = useRef<HTMLInputElement>(null)

    const [showError, setShowError] = useState(false);
    const [error, setError] = useState<string>("")

    const [sent, setSent] = useState<boolean>(false);

    const router = useRouter();

    const handleSendEmail = () => {
        let email = emailRef!.current!.value;
        email = email.trim();

        if (!validateEmail(email)) {
            setError("El correo electrónco no es válido")
        }

        const data = {
            email: email
        }

        fetch('/api/reset/sendemail', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                switch (response.status) {
                    case 200:
                        setSent(true)
                        break;
                    case 400:
                        setShowError(true)
                        setError("El correo electrónico no es válido.");
                        break;
                    case 404:
                        setShowError(true)
                        setError("El correo electrónico no es válido.");
                        break;
                    case 500:
                        setShowError(true)
                        setError("Error en el servidor. Intente de nuevo");
                        break;
                    default:
                        setShowError(true)
                        setError("Ha ocurrido un error inesperado.");
                }
            })
            .catch(error => {
                setError("Error al enviar la petición. Intente de nuevo")
            });
    }

    const handleChangePassword = () => {
        const password = passwordRef!.current!.value;
        const repeat_password = repeatPasswordRef!.current!.value;

        const data = {
            code: code,
            password: password,
            repeat_password: repeat_password,
        }

        fetch('/api/reset/password', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                switch (response.status) {
                    case 200:
                        router.push('/auth/login');
                        break;
                    case 400:
                        setShowError(true)
                        setError("Las contraseñas no coinciden.");
                        break;
                    case 404:
                        setShowError(true)
                        setError("El correo electrónico no es válido.");
                        break;
                    case 500:
                        setShowError(true)
                        setError("Error en el servidor. Intente de nuevo");
                        break;
                    default:
                        setShowError(true)
                        setError("Ha ocurrido un error inesperado.");
                }
            })
            .catch(error => {
                setError("Error al enviar la petición. Intente de nuevo")
            });
    }


    return (
        <Layout title={"Change password - BeerShoot"}>
            <div className={styles["up-login-card"]}>
                <div className={styles["login-card"]}>
                    <h2 style={{ "textAlign": "center", "color": "#eff3f5" }}>Account recover</h2>
                    {
                        code ? (
                            <>
                                {error && (
                                    <div className="alert" style={{ display: showError ? 'block' : 'none' }}>
                                        <span className="closebtn" onClick={() => setShowError(prev => !prev)}>&times;</span>
                                        {error}
                                    </div>
                                )}
                                
                                <>
                                    <div className={styles["login-forms"]}>

                                        <div className={styles["form-group"]}>
                                            <label className="label" htmlFor="email">
                                                New password
                                            </label>
                                            <input className={styles["email-input"]} type="password" name="password" ref={passwordRef} required />
                                        </div>

                                        <div className={styles["form-group"]}>
                                            <label className="label" htmlFor="email">
                                                Repeat new password
                                            </label>
                                            <input className={styles["email-input"]} type="password" name="repeat_password" ref={repeatPasswordRef} required />
                                        </div>
                                    </div>
                                    <button type="button" onClick={handleChangePassword} className={`${styles["submit-input"]} ${buttons["button-3"]}`}>Change password</button>
                                </>
                            </>
                        ) : (
                            <>
                                {error && (
                                    <div className="alert" style={{ display: showError ? 'block' : 'none' }}>
                                        <span className="closebtn" onClick={() => setShowError(prev => !prev)}>&times;</span>
                                        {error}
                                    </div>
                                )}

                                {sent ? (
                                    <h3 style={{ textAlign: 'center' }}>We have sent an email to<br />{toAsterisk(emailRef!.current!.value)}<br />with the instructions to recover your account</h3>
                                ) : (
                                    <>
                                        <div className={styles["login-forms"]}>

                                            <div className={styles["form-group"]}>
                                                <label className="label" htmlFor="email">
                                                    Account email
                                                </label>
                                                <input className={styles["email-input"]} type="text" name="email" ref={emailRef} required />
                                            </div>
                                        </div>
                                        <button type="button" onClick={handleSendEmail} className={`${styles["submit-input"]} ${buttons["button-3"]}`}>Send email</button>
                                    </>
                                )}
                            </>
                        )
                    }
                </div>
            </div>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { query } = context;
    if (query?.code) {
        await connect();
        const is = await users.findOne({ passwordToken: query.code });
        if (is) {
            return {
                props: {
                    code: query.code
                }
            }
        } else {
            return {
                props: {
                    code: null
                }
            }
        }
    } else {
        return {
            props: {
                code: null
            }
        }
    }


}