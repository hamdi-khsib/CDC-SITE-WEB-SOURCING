import Supplier from "../models/Supplier.js";
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')


// @desc Get all suppliers
// @route GET /suppliers
// @access Private
const getAllSuppliers = asyncHandler (async (req,res) => {
    const suppliers = await Supplier.find().select('-password').lean()
    if (!suppliers?.length) {
        return res.status(400).json({ message: 'No suppliers found'})
    }
    res.json(suppliers)
})


// @desc create new supplier
// @route POST /suppliers
// @access Private
const createNewSupplier = asyncHandler (async (req,res) => {
    const {
        username,
        email,
        password,
        picturePath,
        address,
        contact,
        domain,
        products,
        prices,
        userType
    } = req.body
    
    // confirm data
    if (!username || !email || !address || !contact || !domain || !products || !prices || !password || !Array.isArray(userType) || !userType.length) {
        return res.status(400).json({ message
            :'All fields are required' })
    }

    // check for duplicate 
    const duplicate = await Supplier.findOne({ username }).lean().exec()
    if (duplicate) {
        return res.status(400).json({ message:'Duplicate firstname' })
    }

    //Hash password

    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const supplierObject = {
        username,
        email,
        password: hashedPwd,
        picturePath,
        address,
        contact,
        domain,
        products,
        prices,
        userType
    }

    //Create and store a new user

    const supplier = await Supplier.create(supplierObject)

    if (supplier) {
        res.status(201).json({ message: `New supplier ${username} created`})
    } else {
        res.status(400).json({ message: 'Invalid supplier data received'})
    } 
    
})



// @desc update a supplier
// @route PATCH /suppliers
// @access Private
const updateSupplier = asyncHandler (async (req,res) => {
    const {id,
        username,
        email,
        password,
        picturePath,
        address,
        contact,
        domain,
        products,
        prices,
        userType
    } = req.body

    // confirm data
    if (!id || !username || !email || !address || !contact || !domain || !products || !prices || !password || !Array.isArray(userType) || !userType.length) {
        return res.status(400).json({ message
            :'All fields are required' })
    }

    const supplier = await Supplier.findById(id).exec()

    if (!supplier) {
        return res.status(400).json({ message: 'supplier not found'})
    }

    // check for duplicate 
    const duplicate = await Supplier.findOne({ username }).lean().exec()
    //Allow updates to t
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username'})
    }

    supplier.username = username
    supplier.email = email
    supplier.address = address
    supplier.contact = contact
    supplier.domain = domain
    supplier.products = products
    supplier.prices = prices
    supplier.userType = userType

    if (password) {
        //Hash password
        supplier.password = await bcrypt.hash(password, 10)
    }

    const updatedSupplier = await supplier.save()

    res.json({ message: `${updatedSupplier.username} updated`})
})

// @desc delete a supplier
// @route DELETE /suppliers
// @access Private
const deleteSupplier = asyncHandler (async (req,res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'Supplier ID required'})
    }

    const supplier = await Supplier.findById(id).exec()

    if(!supplier) {
        return res.status(400).json({ message: 'Supplier not found'})
    }

    const result = await supplier.deleteOne()

    const reply = `Username ${result.username} with ID ${result.id} deleted`

    res.json(reply)
})

module.exports= {
    getAllSuppliers,
    createNewSupplier,
    updateSupplier,
    deleteSupplier
}