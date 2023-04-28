import { useRef, useState } from 'react'
import { getSession, signIn } from "next-auth/react";
import type { GetServerSideProps } from 'next/types';
import { useRouter } from 'next/router';

import Layout from '@/components/layout';
import Alert from '@/components/alert';

import styles from '../../styles/Card.module.css';
import buttons from '../../styles/Buttons.module.css'

import validateEmail from '../../../utils/validateEmail';

export default function Register() {

    const emailRef = useRef<HTMLInputElement>(null)
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirm_passwordRef = useRef<HTMLInputElement>(null)

    const [error, setError] = useState<string>("")

    const router = useRouter();

    const handleSignIn = () => {

        const email = emailRef!.current!.value.trim();
        const username = usernameRef!.current!.value.trim();
        const password = passwordRef!.current!.value;
        const confirm_password = confirm_passwordRef!.current!.value;

        if (!email || !username || !password || !confirm_password) {
            setError('Please, fill in all fields');
            return;
        }

        if (validateEmail(email)) {
            if (password === confirm_password) {
                signIn('credentials', {
                    redirect: false,
                    email: email,
                    username: username,
                    password: password,
                    type: "register",
                }).then(({ error }: any) => {
                    if (!error || error.length === 0) {
                        router.push('/');
                    }
                    else if (error === "EmailPicked") {
                        setError("Email address is already in use");
                    }
                    else if (error === "UsernamePicked") {
                        setError("Username is already in use");
                    } else if (error === "Invalid") {
                        setError("Enter a valid email address");
                    }
                    else {
                        console.log(error)
                        setError("Server error, try again later")
                    }
                })
            } else {
                setError("Passwords do not match")
            }
        } else {
            setError("Enter a valid email address")
        }
    }

    return (
        <Layout title={"Register - BeerShoot"}>
            <form action="/api/auth/callback/credentials" method="POST">
                <div className={styles["card"]}>
                    <div className={styles["card-body"]}>
                        <h2 className={styles['title']}>Register</h2>

                        <Alert error={error} setError={setError} />

                        <div className={styles["forms"]}>

                            <div className={styles["form-group"]}>
                                <label className="label" htmlFor="username">
                                    Email
                                </label>
                                <input type="email" name="email" ref={emailRef} required />
                            </div>

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

                            <div className={styles["form-group"]}>
                                <label className="label" htmlFor="username">
                                    Confirm password
                                </label>
                                <input type="password" name="confirm_password" ref={confirm_passwordRef} required />
                            </div>
                        </div>

                        <button type="button" onClick={handleSignIn} className={`${styles["submit-input"]} ${buttons["button-3"]}`}>Register</button>
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