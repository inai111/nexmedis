import { model, Schema, ObjectId, SchemaType, SchemaTypes } from "mongoose";
import user from "./user.js";

const postSchema = new Schema({
    user: { type: ObjectId, ref: user },
    caption: { type: String, required: false },
    images: [String],
    likesCount: { type: Number, default: 0 },
    likes: [
        {type:Schema.Types.ObjectId, ref:user}
    ],
    commentsCount: { type: Number, default: 0 },
    comments: [
        {
            user: { type: ObjectId, ref: user, required: true },
            body: { type: String, required: true },
            createdAt: { type: Date, required: true, default: Date.now },
        }
    ],
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
});

postSchema.pre('save', async function (next) {
    const post = this;
    if (post.isModified(['caption', 'images'])) post.updatedAt = Date.now();
    next();
})

export default model('Post', postSchema);