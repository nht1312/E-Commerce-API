const express = require('express')
const { 
    createProduct,
    getProduct,
    getAllProduct, 
    updateProduct,
    deleteProduct} = require('../controllers/productController')
const router = express.Router()
const { isAdmin, authMiddleware} = require('../middlewares/authMiddleware')

router.post('/',authMiddleware, isAdmin , createProduct)
router.put('/:id',authMiddleware, isAdmin , updateProduct)
router.delete('/:id',authMiddleware, isAdmin , deleteProduct)
router.get('/:id', getProduct)
router.get('/', getAllProduct)


module.exports = router