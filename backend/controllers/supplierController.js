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
        firstName,
        lastName,
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
    if (!firstName || !lastName || !email || !address || !contact || !domain || !products || !prices || !password || !Array.isArray(userType) || !userType.length) {
        return res.status(400).json({ message
            :'All fields are required' })
    }

    // check for duplicate 
    const duplicate = await Supplier.findOne({ firstName }).lean().exec()
    if (duplicate) {
        return res.status(400).json({ message:'Duplicate firstname' })
    }

    //Hash password

    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const supplierObject = {
        firstName,
        lastName,
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
        res.status(201).json({ message: `New supplier ${firstName} created`})
    } else {
        res.status(400).json({ message: 'Invalid supplier data received'})
    } 
    
})



// @desc update a supplier
// @route PATCH /suppliers
// @access Private
const updateSupplier = asyncHandler (async (req,res) => {
    const {id,
        firstName,
        lastName,
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
    if (!id || !firstName || !lastName || !email || !address || !contact || !domain || !products || !prices || !password || !Array.isArray(userType) || !userType.length) {
        return res.status(400).json({ message
            :'All fields are required' })
    }

    const supplier = await Supplier.findById(id).exec()

    if (!supplier) {
        return res.status(400).json({ message: 'supplier not found'})
    }

    // check for duplicate 
    const duplicate = await Supplier.findOne({ firstName }).lean().exec()
    //Allow updates to t
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate firstName'})
    }

    supplier.firstName = firstName
    supplier.lastName = lastName
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

    res.json({ message: `${updatedSupplier.firstName} updated`})
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

    const reply = `Username ${result.firstName} with ID ${result.id} deleted`

    res.json(reply)
})