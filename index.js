import cookieParser from 'cookie-parser';
import dotEnv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import { connectToDB } from './database/database.js';
import { ZodError } from 'zod';
import User from './models/user.js'
import cors from 'cors';
import ResponseError from './errors/ResponseError.js'
import postRoute from './routes/post.js';
import { formatingErrorZod } from './utils/common.js';
import Auth from './middlewares/Auth.js';
import CreateNewUserRequestParse from './request/CreateNewUserRequest.js';
import SignInUserRequestParse from './request/SignInUserRequest.js';
import post from './models/post.js';
import user from './models/user.js';


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
    try {
        const { username, password } = requestLogin.parse(req.body);
        const token = req.cookies.authToken;
        if (token) {
            jwt.verify(token, secretKey, (err, data) => {
                if (err) {
                    return next();
                }

                // jika telah login, tambah durasi cookie
                const token = jwt.sign({ username: data.username }, secretKey, { expiresIn: 60 * 30 });
                res.cookie('authToken', token, { httpOnly: 1, secure: 1 });
                // kembalikan 204 karena telah keadaan login
                return res.status(204).send();
            });
        } else next();
    } catch (err) {
        if (err instanceof ZodError) {
            return res.status(422).send(formatingErrorZod(err.errors))
        }
    }
}


app.use(cors(corsOption));
app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());


app.post('/login', checkIsUserLogged, async (req, res) => {
    try {
        const { username, password } = SignInUserRequestParse.parse(req.body);
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
        return res.status(200).send({ 'message': "Success, now redirecting..." });

    } catch (err) {
        if (err instanceof ZodError) {
            return res.status(422).send(formatingErrorZod(err.errors))
        }

        if (err instanceof ResponseError) {
            return res.status(err.statusCode).send(err.object);
        }

        return res.status(400).send();
    }
});

app.post('/register', async (req, res) => {
    try {
        const { username, password } = await CreateNewUserRequestParse.parse(req.body);
        const userCheck = await User.findOne().byName(username).exec()
        // jika username ada maka lempar ke catch
        if (userCheck) throw new ResponseError({ message: 'Username already taken' }, 400);

        const user = new User();
        user.username = username;
        user.password = password;
        user.save();

        res.send({ 'message': "User created" });

    } catch (err) {
        if (err instanceof ZodError) {
            return res.status(422).send(formatingErrorZod(err.errors));
        }

        if (err instanceof ResponseError) {
            return res.status(err.statusCode).send(err.object);
        }

        res.status(500).send();
    }

});

app.get('/posts', async (req, res) => {
    const filter = {};
    const username = req.query.username;
    if (username) {
        filter.user = await user.findOne({ username });
    }

    try {
        const posts = await post.find(
            filter,
            { comments: 0 }
        );

        const resources = posts.map(post => {
            const item = post.toJSON();
            item.images = item.images.map(image => `${req.get('host')}/${image}`)
            item.liked = item.likes.includes(req.user);
            return item;
        })

        res.send({
            data: {
                posts: resources
            }
        });

    } catch (err) {
        res.status(500).send();
    }
});

app.get('/upload-image', Auth, (req, res) => {

})

app.use(postRoute)

app.listen(portApp, () => console.log('run in localhost:' + portApp));