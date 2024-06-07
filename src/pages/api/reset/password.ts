import type { NextApiRequest, NextApiResponse } from "next";

import connect from "../../../../lib/database/database";
import users from "../../../../lib/database/models/users";

import hasher from "../../../../utils/hasher";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.redirect("/");

    if (req.body) {

        const { code, password, repeatPassword } = req.body as {
            code: string,
            password: string,
            repeatPassword: string,
        };

        await connect();

        if (!code || !password || !repeatPassword || password !== repeatPassword) return res.status(400).end();

        const hashedPass = await hasher(password);

        try {
            await users.findOneAndUpdate(
                { passwordToken: code },
                { password: hashedPass }
            );
        } catch (error) {
            return res.status(500).end();
        }

        res.status(200).end();
    }
}