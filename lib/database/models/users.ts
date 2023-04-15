import mongoose from "mongoose";

const Users = new mongoose.Schema({
    id: { type: Number, unique: true, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    biography: { type: String },
    avatar: { type: Buffer },
});

Users.pre('save', async function (next) {
    if (this.isNew) {
        const count = await mongoose.model('Users').countDocuments();
        this.id = count + 1;
    }
    next();
});

export default mongoose.models.Users || mongoose.model('Users', Users)