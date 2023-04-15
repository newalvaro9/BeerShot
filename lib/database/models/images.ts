import mongoose from "mongoose"

const Images = new mongoose.Schema({
    link: { type: String, required: true },
    title: { type: String, required: true },
    image: { type: Buffer, required: true },
    date: { type: Number, required: true },
    publisher: { type: Number, required: true },
    private: { type: Boolean, default: false },
})


export default mongoose.models.Images || mongoose.model('Images', Images)