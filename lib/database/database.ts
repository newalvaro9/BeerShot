import mongoose from "mongoose";

const connect = () => {
    mongoose.connect(process.env.DB_URL as string)
        .then(() => console.log("Conectado a MongoDB"))
        .catch(err => console.error(err));
};

export default connect;