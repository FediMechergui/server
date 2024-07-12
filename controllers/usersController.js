const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// Predefined set of allowed roles
const ALLOWED_ROLES = ["Employee", "Manager", "Admin"]

// Function to strip Zero Width Space characters
const stripZeroWidthSpace = (str) => str.replace(/[\u200B-\u200D\uFEFF]/g, '')

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users) {
        return res.status(400).json({ message: 'No users found' })
    }
    res.json(users)
})

const createNewUser = asyncHandler(async (req, res) => {
    let { username, password, roles } = req.body

    // Strip Zero Width Space characters
    username = stripZeroWidthSpace(username)
    roles = roles.map(role => stripZeroWidthSpace(role)).filter(role => ALLOWED_ROLES.includes(role))

    // Confirm data
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec()
    if (duplicate) {
        return res.status(400).json({ message: 'Duplicate username' })
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const userObject = { username, "password": hashedPwd, roles }

    // Create and store new user
    const user = await User.create(userObject)
    if (user) {
        res.status(200).json({ message: 'New user created ' + user.username })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})

const updateUser = asyncHandler(async (req, res) => {
    let { id, username, roles, active, password } = req.body

    // Strip Zero Width Space characters
    id = stripZeroWidthSpace(id)
    username = stripZeroWidthSpace(username)
    roles = roles.map(role => stripZeroWidthSpace(role)).filter(role => ALLOWED_ROLES.includes(role))

    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec()
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    user.username = username
    user.roles = roles
    user.active = active

    if (password) {
        user.password = await bcrypt.hash(password, 10) // salt rounds
    }

    const updatedUser = await user.save()
    res.json({ message: `${updatedUser.username} updated` })
})

const deleteUser = asyncHandler(async (req, res) => {
    let { id } = req.body

    // Strip Zero Width Space characters
    id = stripZeroWidthSpace(id)

    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    const note = await Note.findOne({ user: id }).lean().exec()
    if (note?.length) {
        return res.status(400).json({ message: 'User has assigned notes' })
    }

    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()
    const reply = `Username ${result.username} with ID ${result._id} deleted`
    res.json(reply)
})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}

