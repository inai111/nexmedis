import { Router } from "express";
import Auth from "../middlewares/Auth.js";
import CreateNewPostRequestParse from "../request/CreateNewPostRequest.js";
import { ZodError } from "zod";
import { formatingErrorZod } from '../utils/common.js';
import ResponseError from "../errors/ResponseError.js";
import post from "../models/post.js";
import { isValidObjectId } from "mongoose";
import UpdatePostRequestParse from "../request/UpdatePostRequest.js";
import CreateCommentRequest from "../request/CreateCommentRequest.js";

const postRoute = Router();

postRoute.route('/post')
    .get(Auth, (req, res) => {
        /**
         * akan digunakan untuk mendapatkan seluruh post milik
         */
        try {
            post.find({ user: req.user }, { comments: 0 }).then((posts) => {
                return res.status(200).send({
                    data:{
                        posts: posts.map(
                            (post) => {
                                post.images = post.images.map(image => `${req.get('host')}/${image}`);
                                return post;
                            }
                        )
                    }
                });
            })
        } catch (err) {
            return res.status(500).send({ message: "Server is Bug" });
        }

    })
    .post(Auth, (req, res) => {
        try {
            const { caption, images } = CreateNewPostRequestParse.parse(req.body);

            if (!caption && images.length == 0) throw new ResponseError({ message: "There is no any content to post." }, 400);

            const Post = new post();
            Post.caption = caption;
            Post.images = images;
            Post.user = req.user;
            Post.save()
                .then((val) => {
                    res.status(201).send({
                        message: 'Post Created',
                        post: {
                            caption: val.caption,
                            images: val.images.map((image) => `${req.get('host')}/${image}`),
                            createdAt: val.createdAt,
                            updatedAt: val.updatedAt,
                        }

                    });
                })
                .catch(err => {
                    throw new ResponseError({
                        message: "There is an error in server, we are currently can not store the post.",
                        error: err.message
                    }, 500);
                });

        } catch (err) {
            if (err instanceof ZodError) return res.status(422).send(formatingErrorZod(err.errors));
            if (err instanceof ResponseError) return res.status(err.statusCode).send(err.object);
            console.log(err.message)
            return res.status(500).send({ message: "Server is Bug" });
        }
    });
// untuk detail, update, delete
postRoute.route('/post/:id')
    .get(async (req, res) => {
        try {
            const id = req.params.id;

            if (!isValidObjectId(id)) throw new ResponseError({
                message: "Post in not found"
            }, 404);

            const postItem = await post.findById(id);

            if (!postItem) throw new ResponseError({
                message: "The post is not found"
            }, 404);

            postItem.images = postItem.images.map(image => `${req.get('host')}/${image}`);
            res.send({ data:{post: postItem} });
        } catch (err) {
            if (err instanceof ResponseError) {
                return res.status(err.statusCode).send(err.object);
            }
            res.status(500).send();
        }
    })
    .put(Auth, async (req, res) => {
        try {
            const id = req.params.id;

            if (!isValidObjectId(id)) throw new ResponseError({
                message: "Post in not found"
            }, 404);

            const postItem = await post.findOne({ user: req.user, _id: id });
            if (!postItem) throw new ResponseError({
                message: "The post is not found"
            }, 404);

            let { caption, images } = UpdatePostRequestParse.parse(req.body);
            images = images.map(image => image.replace(`${req.get('host')}/`, ''));

            if (!caption && images.length == 0) throw new ResponseError({
                message: "Unable to save"
            }, 400);


            postItem.caption = caption;
            postItem.images = images;
            const checkUpdateStatus = await postItem.save();
            // kurang penghapusan image

            res.status(204).send();
        } catch (err) {
            if (err instanceof ResponseError) return res.status(err.statusCode).send(err.object);
            if (err instanceof ZodError) return res.status(422).send(formatingErrorZod(err.errors));
            console.log(err.message)
            res.status(500).send();
        }

    })
    .delete(Auth, async (req, res) => {
        try {
            const id = req.params.id;

            if (!isValidObjectId(id)) throw new ResponseError({
                message: "Post in not found"
            }, 404);

            const deletedPost = await post.findByIdAndDelete(id, { user: req.user });

            if (!deletedPost) throw new ResponseError({
                message: "The post is not found"
            }, 404);

            const images = deletedPost.images;
            // kurang penghapusan image

            res.status(204).send();
        } catch (err) {
            if (err instanceof ResponseError) res.status(err.statusCode).send(err.object);
            res.status(500).send();
        }

    });

postRoute.patch('/post/:id/like', Auth,
    async (req, res) => {
        try {
            const id = req.params.id;

            if (!isValidObjectId(id)) throw new ResponseError({
                message: "Post in not found"
            }, 404);

            const postItem = await post.findById(id);

            if (!postItem) throw new ResponseError({
                message: "The post is not found"
            }, 404);

            // cari terlebih dahulu apakah user telah like post tersebut
            const isLiked = postItem.likes.includes(req.user._id);
            if (isLiked) {
                postItem.likes.pull(req.user);
                --postItem.likesCount;
            } else {
                postItem.likes.push(req.user)
                ++postItem.likesCount;
            }

            await postItem.save();
            res.status(204).send();
        } catch (err) {
            if (err instanceof ResponseError) res.status(err.statusCode).send(err.object);
            console.log(err.message);
            res.status(500).send();
        }

    })

postRoute.patch('/post/:id/comment', Auth,
    async (req, res) => {
        try {
            const id = req.params.id;

            if (!isValidObjectId(id)) throw new ResponseError({
                message: "Post in not found"
            }, 404);
            
            const { body } = CreateCommentRequest.parse(req.body);

            const postItem = await post.findByIdAndUpdate(id,{
                $push:{
                    comments:{user:req.user,body}
                },
                $inc:{commentsCount:1}
            },{new:true});

            if (!postItem) throw new ResponseError({
                message: "The post is not found"
            }, 404);

            res.status(204).send();
        } catch (err) {
            if (err instanceof ResponseError) res.status(err.statusCode).send(err.object);
            if (err instanceof ZodError) res.status(422).send(formatingErrorZod(err.errors));
            console.log(err.message);
            res.status(500).send();
        }
    })

export default postRoute;