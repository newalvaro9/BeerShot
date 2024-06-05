import { useRef, useState } from 'react'
import { GetServerSideProps } from 'next';
import { signOut } from 'next-auth/react';

import Layout from '@/components/layout';
import Alert from '@/components/alert';

import styles from '../../styles/Card.module.css';
import buttons from '../../styles/Buttons.module.css'

import toAsterisk from '../../../utils/toAsterisk';
import validateEmail from '../../../utils/validateEmail';

import connect from '../../../lib/database/database';
import users from '../../../lib/database/models/users';

export default function ResetEmail({ code }: { code: string | null }) {

    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const repeatPasswordRef = useRef<HTMLInputElement>(null)

    const [error, setError] = useState<string>("")

    const [sent, setSent] = useState<boolean>(false);

    const handleSendEmail = () => {
        const email = emailRef!.current!.value.trim();

        if (!email) {
            setError('Please, fill in all fields');
            return;
        }

        if (!validateEmail(email)) {
            setError("Enter a valid email address");
            return;
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
                        setError("Invalid email address");
                        break;
                    case 404:
                        setError("Invalid email address.");
                        break;
                    case 500:
                        setError("Server error, try again later");
                        break;
                    default:
                        setError("An unexpected error ocurred");
                }
            })
            .catch(error => {
                setError("Error while sending the request, try again later")
            });
    }

    const handleChangePassword = () => {
        const password = passwordRef!.current!.value;
        const repeat_password = repeatPasswordRef!.current!.value;



        if (!password || !repeat_password) {
            setError("Please, fill in all fields");
            return;
        }

        if (password === repeat_password) {
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
                            signOut({ callbackUrl: '/auth/login' });
                            break;
                        case 400:
                            setError("Passwords do not match");
                            break;
                        case 404:
                            setError("Invalid email address");
                            break;
                        case 500:
                            setError("Server error, try again later");
                            break;
                        default:
                            setError("An unexpected error ocurred, try again later");
                    }
                })
                .catch(error => {
                    setError("Error while sending the request, try again later")
                });
        } else {
            setError("Passwords do not match");
        }
    }


    return (
        <Layout title={"Change password - BeerShot"}>
            <div className={styles["card"]}>
                <div className={styles["card-body"]}>
                    <h2 className={styles['title']}>Account recover</h2>
                    <Alert error={error} setError={setError} />

                    {
                        code ? (
                            <>
                                <div className={styles["forms"]}>

                                    <div className={styles["form-group"]}>
                                        <label className="label" htmlFor="email">
                                            New password
                                        </label>
                                        <input type="password" name="password" ref={passwordRef} required />
                                    </div>

                                    <div className={styles["form-group"]}>
                                        <label className="label" htmlFor="email">
                                            Repeat new password
                                        </label>
                                        <input type="password" name="repeat_password" ref={repeatPasswordRef} required />
                                    </div>
                                </div>
                                <button type="button" onClick={handleChangePassword} className={`${styles["submit-input"]} ${buttons["button-3"]}`}>Change password</button>
                            </>
                        ) : (
                            <>
                                {sent ? (
                                    <h3 style={{ textAlign: 'center' }}>We have sent an email to<br />{toAsterisk(emailRef!.current!.value)}<br />with the instructions to recover your account</h3>
                                ) : (
                                    <>
                                        <div className={styles["forms"]}>

                                            <div className={styles["form-group"]}>
                                                <label className="label" htmlFor="email">
                                                    Account email
                                                </label>
                                                <input type="email" name="email" ref={emailRef} required />
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