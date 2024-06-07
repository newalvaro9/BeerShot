import "next-auth";

declare module "next-auth" {
    interface User {
        email: string;
        sub: string;
        userid: number;
        username: string;
        iat: number;
        exp: number;
        jti: string;
    }

    interface Session {
        user: User;
    }
}