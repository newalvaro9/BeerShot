const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const validateEmail: (email: string) => boolean = (email) => {
    return emailRegex.test(email);
};

export default validateEmail;
