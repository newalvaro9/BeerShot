const toAsterisk: (email: string) => string = (email) => {
    const [username, domain] = email.split("@");
    const prefix = username.slice(0, 2);
    const asteriskedUsername = "*".repeat(username.length - 2);
    const asteriskedDomain = "*".repeat(domain.length - 1);

    return `${prefix}${asteriskedUsername}@${domain[0]}${asteriskedDomain}`;
};

export default toAsterisk;