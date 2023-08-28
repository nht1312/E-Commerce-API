const express = require('express')
const { 
    createUser,
    loginUser,
    getAllUsers,
    getUser,
    deleteUser,
    updatedUser,
    blockUser,
    unBlockUser 
} = require('../controllers/userController')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')
const router = express.Router()

router.post('/register', createUser)
router.post('/login', loginUser)
router.get('/all-users', getAllUsers)
router.get('/:id', authMiddleware, isAdmin, getUser)
router.delete('/:id', deleteUser)
router.put('/edit-user',authMiddleware, updatedUser)
router.put('/block-user/:id',authMiddleware, isAdmin, blockUser)
router.put('/unblock-user/:id',authMiddleware, isAdmin, unBlockUser)


module.exports = router