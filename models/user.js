import { query } from "express";
import { model, Schema } from "mongoose";

const userSchema = new Schema({
    username: String,
    password: String,
});

userSchema.query.byName = function (username){
    // agar mencari sesuai dengan username
    return this.where({ username: new RegExp(username,'i')});
};

export default model('User',userSchema);