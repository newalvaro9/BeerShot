import nodemailer from "nodemailer";
import type { NextApiRequest, NextApiResponse } from "next";

import connect from "../../../../lib/database/database";
import users from "../../../../lib/database/models/users";

import generateCode from "../../../../utils/generateCode";
import validateEmail from "../../../../utils/validateEmail";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.redirect("/");

    if (!req.body) return res.status(400).end();


    const { email } = req.body as {
        email: string;
    };

    if (!email || !validateEmail(email)) {
        return res.status(400).end();
    }

    await connect();

    const user = await users.findOne({ email: email });
    if (!user) return res.status(404).end();

    const restoreCode = await generateCode();
    console.log(restoreCode);

    // auth with gmail
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_SERVER_DIR,
            pass: process.env.MAIL_SERVER_PASS
        }
    });

    // email info
    const mailOptions = {
        from: process.env.MAIL_SERVER_DIR,
        to: email,
        subject: "Change BeerShot Password",
        html:
            `
                <h1>Someone has requested a password reset for the following account associated with your email: <strong>${user.username}</strong></h1>
                <span>If this was a mistake, ignore this email and nothing will happen.<br/> To restore your password click <a href="http://${req.headers.host}/reset/password?code=${restoreCode}">here</a>.</span>
                `
    };

    // send
    try {
        await transporter.sendMail(mailOptions);
        await users.findOneAndUpdate({ email: email }, { passwordToken: restoreCode });
        return res.status(200).end();
    } catch (error) {
        return res.status(500).end();
    }

}