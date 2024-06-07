import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

import connect from "../../../lib/database/database";
import images from "../../../lib/database/models/images";
import generateLink from "../../../utils/generateLink";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.redirect("/upload");

    if (!req.body) return res.status(400).end();

    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(403).end();

    const { image, title, size } = req.body as {
        image: string;
        title: string;
        size: number;
    };

    const generatedLink = await generateLink(images);

    try {
        await connect();
        await images.create({
            link: generatedLink,
            title: title,
            image: image,
            size: size,
            date: Date.now(),
            publisher: session.user.userid,
        });

        return res.status(200).json({ newUrl: generatedLink });
    } catch (err) {
        return res.status(500).end();
    }
}

export const config = {
    api: {
        responseLimit: "4mb",
    },
};