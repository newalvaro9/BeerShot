import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import users from '../../../../lib/database/models/users'
import { compare } from 'bcrypt'
import connect from '../../../../lib/database/database'
import hasher from '../../../../utils/hasher'

export const authOptions = {
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                username: {
                    label: 'Username',
                    type: 'text'
                },
                password: {
                    label: 'Password',
                    type: 'password'
                }
            },
            async authorize(credentials: any) {

                if (credentials.type === 'login') {

                    const { username, password } = credentials as {
                        username: string
                        password: string
                    }

                    await connect();
                    const user = await users.findOne({ username: username });

                    if (user) {
                        if (await compare(password, user.password)) {
                            return user
                        } else {
                            throw new Error("CredencialesIncorrectas")
                        }
                    } else {
                        throw new Error("CredencialesIncorrectas")
                    }

                }
                else if (credentials.type === 'register') {
                    const { email, username, password } = credentials as {
                        email: string;
                        username: string;
                        password: string;
                    }

                    await connect();
                    const emailCheck = await users.findOne({ email: email });

                    if (!emailCheck) {
                        const usernameCheck = await users.findOne({ username: username })
                        if (!usernameCheck) {
                            const user = await users.create({
                                email: email,
                                username: username,
                                password: await hasher(password),
                            });
                            return user;
                        } else {
                            throw new Error("UsernamePicked");
                        }
                    } else {
                        throw new Error("EmailPicked");
                    }
                }
                else {
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: '/auth/login',
        error: '/auth/error',
        newUser: '/auth/register'
    },
    secret: process.env.JWT_SECRET
}

export default NextAuth(authOptions)