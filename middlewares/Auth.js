import dotEnv from 'dotenv';
import jwt from 'jsonwebtoken';
import ResponseError from "../errors/ResponseError.js";
import user from '../models/user.js';

/**
 * Middleware untuk check cookie dari authToken.
 * jika ada dan benar maka akan mengisi @param req dengan isi authToken tersebut
 * jika tidak ada akan mengembalikan status code 401
 */
dotEnv.config();
const Auth = (req, res, next) => {
    try {
        const token = req.cookies.authToken;
        const secretKey = process.env.JWT_SECRET ?? "panahAsmaraByChrisye";

        if (!token) throw new ResponseError({
            "message": "You can not access this resource yet."
        }, 401);
        
        jwt.verify(token, secretKey, (err, data) => {
            if (err instanceof jwt.TokenExpiredError) throw new ResponseError({
                "message": "Your token is expired"
            }, 419);
            
            if (err) throw new ResponseError({
                "message": "You can not access this resource yet."
            }, 401);

            const token = jwt.sign({ username: data.username }, secretKey, { expiresIn: 60 * 30 });
            res.cookie('authToken', token, { httpOnly: 1, secure: 1 });

            user.findOne({username:data.username}).then((user)=>{
                req.user = user;
                
                next();
            });
        });
    } catch (err) {
        if (err instanceof ResponseError) {
            return res.status(err.statusCode).send(err.object);
        }
        return res.status(500).send({ message: "Error in Server" });
    }
}

export default Auth;