const express = require('express')
const User = require('../models/User')
const auth = require('../middleware/auth')

const router = express.Router()

router.get('/users', (req, res) => {
    res.status(200).send({ status: 'ok', data: '' })
})

router.post('/users', async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findByCredentials(email, password)
        if (!user) {
            return res.status(400).send({ error: 'Login failed! Check authentication credentials' })
        }
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (err) {
        res.status(400).send(err)
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.post('/users/me/logout', auth, async (req, res) => {
    const { user } = req

    try {
        user.tokens.splice(0, user.tokens.length)
        await user.save()
        res.send()
    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = router