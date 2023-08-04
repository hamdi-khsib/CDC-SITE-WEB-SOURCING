import Supplier from "../models/Supplier";
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

/* read */

export const getSupplier = async (req, res) => {
    try {
        const { id } = req.params
        const supplier = await Supplier.findById(id)
        res.status(200).json(supplier)
    } catch (err) {
        res.status(404).json({ error: err.message})
    }
}

// @desc Get all users
// @route GET /users
// @access Private
const getAllSuppliers = asyncHandler (async (req,res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found'})
    }
    res.json(users)
})