const express = require("express")
const User = require("../models/user")
const router = express.Router()

router
    .get('/getAllUsers', async (req, res) => {
        try {
            const users = await User.getAllUsers() // Exclude the password field
            res.send(users);
        } catch (err) {
            res.status(401).send({ message: err.message })
        }
    })

    .get('/getUserData', async (req, res) => {
        try {
            const user = await User.getUserData(req.query)
            res.send(user);
        } catch (err) {
            res.status(401).send({ message: err.message })
        }
    })


    .post('/login', async (req, res) => {
        try {
            const user = await User.login(req.body)
            res.send({ ...user, Password: undefined })
        } catch (err) {
            res.status(401).send({ message: err.message })
        }
    })

    .post('/register', async (req, res) => {
        try {
            const user = await User.register(req.body)
            res.send({ ...user, Password: undefined })
        } catch (err) {
            res.status(401).send({ message: err.message })
        }
    })

    .put('/updateUserName', async (req, res) => {
        try {
            let updatedUser = await User.editUsername(req.body)
            res.send({ ...updatedUser, Password: undefined })
        } catch (err) {
            res.status(401).send({ message: err.message })
        }
    })
    .put('/updatepassword', async (req, res) => {
        try {
            let updatedUser = await User.editPassword(req.body)
            res.send({ ...updatedUser, Password: undefined })
        } catch (err) {
            res.status(401).send({ message: err.message })
        }
    })

    .delete('/remove', async (req, res) => {
        try {
            await User.deleteAccount(req.body)
            res.send({ success: "We wish to see you again :(" })
        } catch (err) {
            res.status(401).send({ message: err.message })
        }
    })

module.exports = router