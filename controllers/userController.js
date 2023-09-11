const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler');
const validateMongodbId = require('../utils/validateMongoDbId');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');

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
        const refreshToken = await generateRefreshToken(findUser?.id)
        const updateUser = await User.findByIdAndUpdate(findUser._id, {
            refreshToken: refreshToken
        },
        {new: true})
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        })
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

// handle refreshToken
const handleRefreshToken = asyncHandler(async(req, res) => {
    const cookie = req.cookies
    // console.log(cookie);
    if (!cookie?.refreshToken)
        throw new Error('No refresh token in Cookie')
    const refreshToken = cookie.refreshToken
    // console.log(refreshToken);
    const user = await User.findOne({ refreshToken })
    if (!user)
        throw new Error('No refresh token present in db or not matching')
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id)
        {
            throw new Error('There is something wrong with refresh token')
        }
        const accessToken = generateToken(user?._id)
        res.json({accessToken})
    })
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
    validateMongodbId(id)
    try {
        const getUser = await User.findById(id)
        res.json({
            getUser
        })
    } catch (error) {
        throw new Error(error)
    }
})

// logout
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie?.refreshToken)
        throw new Error('No refresh token in Cookie')
    const refreshToken = cookie.refreshToken
    const user = await User.findOne({ refreshToken })
    if (!user)
    {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true
        })
        return res.sendStatus(204) // forbidden
    }
    await User.findOneAndUpdate(refreshToken, {
        refreshToken: ""
    })
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })
    return res.sendStatus(204)
})

//update a User
const updatedUser = asyncHandler (async (req, res) => {
    const {_id} = req.user
    validateMongodbId(_id)
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
    validateMongodbId(id)
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

// Change The password
const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { password } = req.body
    validateMongodbId(_id)
    const user = await User.findById(_id)
    if (password){
        user.password = password
        const updatedPassword = await user.save()
        res.json(updatedPassword)
    } else {
        res.json(user)
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
    unBlockUser,
    handleRefreshToken,
    logout,
    updatePassword
}