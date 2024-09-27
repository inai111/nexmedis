import cookieParser from 'cookie-parser';
import dotEnv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import { connectToDB } from './database/database.js';
import { z, ZodError } from 'zod';
import User from './models/user.js'
import cors from 'cors';
import ResponseError from './errors/ResponseError.js'

dotEnv.config();
const app = express();
const secretKey = process.env.JWT_SECRET ?? "panahAsmaraByChrisye";
const portApp = process.env.BACKEND_PORT ?? 3000;
const corsOption = {
    methods: 'GET,POST,PUT',
    allowedHeaders: 'Content-Type,Accept',
    credentials: true,
    optionsSuccessStatus: 200,
    origin: 'http://localhost:5173'
}

connectToDB();

/**
 * untuk endpoint login saja,
 * jika pada cookie terdapat authToken, maka akan mengembalikan status 204 dan mengupdate cookie 
 */
const checkIsUserLogged = (req, res, next) => {
    try{
        const { username, password } = requestLogin.parse(req.body);
        const token = req.cookies.authToken;
        if (token) {
            jwt.verify(token, secretKey, (err, data) => {
                if (err) {
                    return next();
                }
    
                // jika telah login, tambah durasi cookie
            const token = jwt.sign({ username: data.username }, secretKey, { expiresIn: 60*30 });
            res.cookie('authToken', token, { httpOnly: 1, secure: 1 });
                // kembalikan 204 karena telah keadaan login
                return res.status(204).send();
            });
        } else next();
    }catch(err){
        if (err instanceof ZodError) {
            return res.status(422).send(formatingErrorZod(err.errors))
        }
    }
}

const authChecking = (req, res, next) => {
    const token = req.cookies.authToken;
    if (token) {
        jwt.verify(token, secretKey, (err, data) => {
            if (err) {
                return next();
            }
            req.user = data;
            next();
        });
    } else {
        return res.status(402).send({
            "message": "You can not access this web"
        });
    }
}


app.use(cors(corsOption));
app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());

const formatingErrorZod = (error) => error.reduce(
    (temp, err) => {
        const field = err.path[0];

        // check apakah index field sudah ada di temporary
        if (!temp['errors'][field]) {
            temp['errors'][field] = [];
        }

        // prevent message double pada satu field
        if (temp['errors'][field].findIndex((value) => value == err.message) < 0) {
            temp['errors'][field].push(err.message);
        }

        if (!temp['message']) temp['message'] = err.message;
        return temp;
    }, { 'errors': {} });

const requestLogin = z.object({
    username: z.string()
        .min(1, "Username field is required"),
    password: z.string()
        .min(1, 'Password field is required')
})
app.post('/login', checkIsUserLogged, async (req, res) => {
    try {
        const { username, password } = requestLogin.parse(req.body);
        const userCheck = await User.findOne().byName(username).exec();
        
        if (!userCheck) {
            // untuk kesalahan user tidak ditemukan
            throw new ResponseError({
                "message": "Username/email tidak terdaftar",
                "code": "ERR_USER_NOT_FOUND"
            }, 404);
        }

        const checkPassword = await userCheck.comparePassword(password);
        
        if (!checkPassword) throw new ResponseError({
            "message": "Username/password is invalid",
            "code": "ERR_WRONG_IDENTITY"
        }, 400);
        
        const token = jwt.sign({ username: username }, secretKey, { expiresIn: 60 * 30 });
        res.cookie('authToken', token, { httpOnly: 1, secure: 1 });
        return res.status(200).send({ 'message': "Success, now redirecting..."});
        
    } catch (err) {
        if (err instanceof ZodError) {
            return res.status(422).send(formatingErrorZod(err.errors))
        }

        if(err instanceof ResponseError){
            return res.status(err.statusCode).send(err.object);
        }

        return res.status(400).send();
    }
});


const requestRegister = z.object({
    username: z.string()
        .min(4, "Username field must be at least 4 character")
        .regex(/^[a-zA-Z0-9._]+$/, "Username can only contain letter, number, underscores and dots"),
    password: z.string()
        .min(8, 'Password must be at least 8 character')
        .regex(/[a-z]/, 'Password must be at least contain uppercase, lowercase and number')
        .regex(/[0-9]/, 'Password must be at least contain uppercase, lowercase and number')
        .regex(/[A-Z]/, 'Password must be at least contain uppercase, lowercase and number')
})

app.post('/register', async (req, res) => {
    try {
        const { username, password } = await requestRegister.parse(req.body);
        const userCheck = await User.findOne().byName(username).exec()
        // jika username ada maka lempar ke catch
        if (userCheck) throw new ResponseError({ message: 'Username already taken' }, 400);

        const user = new User();
        user.username = username;
        user.password = password;
        user.save();

        res.send({ 'message': "User created" });

    } catch (err) {
        let message;

        if (err instanceof ZodError) {
            return res.status(422).send(formatingErrorZod(err.errors));
        }

        if (err instanceof ResponseError) {
            return res.status(err.statusCode).send(err.object);
        }
    }

});

app.listen(portApp, () => console.log('run in localhost:' + portApp));