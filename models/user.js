import { model, Schema } from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    username: { type: String, required: 1, index: { unique: 1 } },
    password: { type: String, required: 1 },
});

userSchema.pre('save', function (next) {
    let user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function (err, hashed) {
            if (err) return next(err);

            user.password = hashed;
            next();
        })
    })
});

userSchema.methods.comparePassword = async function (passwordString) {
    return await bcrypt.compare(passwordString, this.password);
}

userSchema.query.byName = function (username,cb) {
    // agar mencari sesuai dengan username
    return this.where({ username: new RegExp(username, 'i') });
};

export default model('User', userSchema);