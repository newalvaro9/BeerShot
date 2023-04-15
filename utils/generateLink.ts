import type { Model, Document } from "mongoose";

const generateLink: (images: Model<Document<any, {}>>) => Promise<string> = async (images) => {
    let randomString;

    do {
        randomString = Math.random().toString(36).substring(2, 9);
    } while (await images.findOne({ link: randomString }));

    return randomString;
}

export default generateLink;