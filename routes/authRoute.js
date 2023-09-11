const express = require('express')
const { 
    createUser,
    loginUser,
    getAllUsers,
    getUser,
    deleteUser,
    updatedUser,
    blockUser,
    unBlockUser, 
    handleRefreshToken,
    logout,
    updatePassword
} = require('../controllers/userController')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')
const router = express.Router()

router.post('/register', createUser)
router.put('/password',authMiddleware ,updatePassword)
router.post('/login', loginUser)
router.get('/refresh', handleRefreshToken)
router.get('/logout', logout)
router.get('/all-users', getAllUsers)
router.get('/:id', authMiddleware, isAdmin, getUser)
router.delete('/:id', deleteUser)
router.put('/edit-user',authMiddleware, updatedUser)
router.put('/block-user/:id',authMiddleware, isAdmin, blockUser)
router.put('/unblock-user/:id',authMiddleware, isAdmin, unBlockUser)


module.exports = router