import type { NextApiRequest, NextApiResponse } from 'next';

import connect from '../../../../lib/database/database';
import users from '../../../../lib/database/models/users';

import hasher from '../../../../utils/hasher';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.redirect('/');

    if (req.body) {

        const { code, password, repeat_password } = req.body as {
            code: string,
            password: string,
            repeat_password: string,
        }

        await connect();

        if (!code || !password || !repeat_password || password !== repeat_password) return res.status(400).end();

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