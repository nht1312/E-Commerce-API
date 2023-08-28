const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel')

const asyncHandler = require('express-async-handler')

// register 
const createUser = asyncHandler (async (req, res) => {
    const email = req.body.email
    const findUser = await User.findOne({email: email});

    if (!findUser)
    {
        //create a new user
        const newUser = await User.create(req.body)
        res.json(newUser)
    }
    else
    {
        throw new Error('User already exists')
    }
})

//login the user
const loginUser = asyncHandler (async (req, res) => {
    const {email, password} = req.body
    // check if the user already exists
    const findUser = await User.findOne({email})
    if (findUser && await findUser.isPasswordMatched(password))
    {
        res.json({
            _id: findUser._id,
            firstName: findUser?.firstName,
            lastName: findUser?.lastName,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
        })
    } else {
        throw new Error('Invalid Credentials')
    }
})

//Get all Users
const getAllUsers = asyncHandler (async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers);
    } catch (error) {
        throw new Error(error)
    }
})

//Get a sigle User
const getUser = asyncHandler (async (req, res) => {
    const {id} = req.params
    try {
        const getUser = await User.findById(id)
        res.json({
            getUser
        })
    } catch (error) {
        throw new Error(error)
    }
})

//update a User
const updatedUser = asyncHandler (async (req, res) => {
    const {_id} = req.user
    try {
        const updatedUser = await User.findByIdAndUpdate(
            _id, 
            {
                firstName: req?.body.firstName,
                lastName: req?.body.lastName,
                email: req?.body.email,
                mobile: req?.body.mobile,
            },
            {
                new: true
            }
        )
        res.json(updatedUser)
    } catch (error) {
        throw new Error(error)
    }
})

//delete a User
const deleteUser = asyncHandler (async (req, res) => {
    const {id} = req.params
    try {
        const deleteUser = await User.findByIdAndDelete(id)
        res.json({
            deleteUser
        })
    } catch (error) {
        throw new Error(error)
    }
})

// Block the user
const blockUser = asyncHandler (async (req, res) => {
    const { id } = req.params
    try {
        const block = await User.findByIdAndUpdate(id, {
            isBlocked: true
        },
        {
            new: true
        }
        )
        res.json(block)
    } catch (error) {
        throw new Error(error)
    }
})
// Unblock the user
const unBlockUser = asyncHandler (async (req, res) => {
    const { id } = req.params
    try {
        const unBlock = await User.findByIdAndUpdate(id, {
            isBlocked: false
        },
        {
            new: true
        }
        )
        res.json(unBlock)
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = { 
    createUser,
    loginUser,
    getAllUsers,
    getUser,
    updatedUser,
    deleteUser,
    blockUser,
    unBlockUser
}