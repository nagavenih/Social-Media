const express = require("express")
const UserPosts = require("../models/post")
const router = express.Router()

router
    .get('/GetAllPosts', async (req, res) => {
        try {
            const post = await UserPosts.getAllPosts()
            res.send(post)
        } catch (err) {
            res.status(401).send({ message: err.message })
        }
    })

    .get('/GetUserPosts', async (req, res) => {
        try {
            const post = await UserPosts.getSpecificUserPosts(req.query)
            if (post.length != 0) {
                post.sort((a, b) => {
                    return new Date(a.CreatedOn) - new Date(b.CreatedOn); // descending
                })
                res.send(post)
            }
            else {
                throw Error`There is no post !!`
            }
        } catch (err) {
            res.status(401).send({ message: err.message })
        }
    })

    .post('/AddPost', async (req, res) => {
        try {
            const post = await UserPosts.addpost(req.body)
            post.sort((a, b) => {
                return new Date(a.CreatedOn) - new Date(b.CreatedOn); // descending
            })
            res.send(post)
        } catch (err) {
            res.status(401).send({ message: err.message })
        }
    })

    .delete('/removeUserPost', async (req, res) => {
        try {
            await UserPosts.deleteapost(req.body)
            res.send({ success: "Post Deleted Successfully!!" })
        } catch (err) {
            res.status(401).send({ message: err.message })
        }
    })

module.exports = router