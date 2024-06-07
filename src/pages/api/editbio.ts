import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

import connect from "../../../lib/database/database";
import users from "../../../lib/database/models/users";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.redirect("/");

    if (!req.body) return res.status(400).end();

    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(403).end();

    const { newBio } = req.body as {
        newBio: string;
    };

    try {
        await connect();
        await users.findOneAndUpdate(
            { userid: session.user.userid },
            { biography: newBio }
        );

        return res.status(200).end();
    } catch (err) {
        return res.status(500).end();
    }
}