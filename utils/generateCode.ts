import hasher from "./hasher";

const generateCode: () => Promise<string> = async () => {
    const randomString = Math.random().toString(36).substring(2, 9);
    const result = await hasher(randomString);
    return result;
};

export default generateCode;