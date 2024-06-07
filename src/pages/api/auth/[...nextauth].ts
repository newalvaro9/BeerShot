import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import users from "../../../../lib/database/models/users";
import { compare } from "bcrypt";
import connect from "../../../../lib/database/database";
import hasher from "../../../../utils/hasher";
import validateEmail from "../../../../utils/validateEmail";

export const authOptions: NextAuthOptions = {
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {},
            async authorize(credentials: any) {

                if (credentials.type === "login") {

                    const { username, password } = credentials as {
                        username: string
                        password: string
                    };

                    await connect();
                    const user = await users.findOne({ username: username });

                    if (user) {
                        if (await compare(password, user.password)) {
                            return user;
                        } else {
                            throw new Error("CredencialesIncorrectas");
                        }
                    } else {
                        throw new Error("CredencialesIncorrectas");
                    }

                }
                else if (credentials.type === "register") {
                    const { email, username, password } = credentials as {
                        email: string;
                        username: string;
                        password: string;
                    };

                    if (validateEmail(email)) {
                        await connect();
                        const emailCheck = await users.findOne({ email: email });

                        if (!emailCheck) {
                            const usernameCheck = await users.findOne({ username: username });
                            if (!usernameCheck) {
                                const user = await users.create({
                                    email: email,
                                    username: username,
                                    password: await hasher(password),
                                });
                                return { ...user.toObject(), userid: user.userid };
                            } else {
                                throw new Error("UsernamePicked");
                            }
                        } else {
                            throw new Error("EmailPicked");
                        }
                    } else {
                        throw new Error("Invalid");
                    }
                }
                else {
                    return null;
                }
            },

        }),
    ],
    callbacks: {
        // Gets called every time a session is called getServerSession(), useSession() etc.
        // What we return will be the returned object. The "token" param is the information of the user setted at the jwt function
        session: async ({ session, token }: { session: any, token: any }) => {
            session.user.userid = token.userid;
            session.user.email = token.email;
            session.user.username = token.username;

            return Promise.resolve(session);
        },
        // When creating a session the "user" parameter will contain the returned object from the "authorize" function
        // So when its only a session check it wouldn't
        jwt: async ({ token, user }: { token: any, user: any }) => {
            if (user) {
                token.userid = user.userid as number;
                token.email = user.email;
                token.username = user.username;
            }

            return Promise.resolve(token);
        },
    },
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
        newUser: "/auth/register"
    },
    secret: process.env.JWT_SECRET
};

export default NextAuth(authOptions);