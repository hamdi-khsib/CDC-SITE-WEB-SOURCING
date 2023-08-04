import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Supplier from "../models/Supplier.js"

/* register supplier */

export const register = async (req, res) => {
    try {
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

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt)

        const newSupplier = new Supplier({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            address,
            contact,
            domain,
            products,
            prices,
            userType
        })

        const savedSupplier = await newSupplier.save()
        res.status(201).json(savedSupplier)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

/*  logging in */

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const supplier = await Supplier.findOne({ email: email})
        if (!supplier) return  res.status(400).json({ message: "Supplier does not exist"})

        const isMatch = await bcrypt.compare(password, supplier.password)
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials"})

        const token = jwt.sign({ id: supplier._id }, process.env.JWT_SECRET)
        delete supplier.password
        es.status(400).json({ token, supplier })

        } catch(err) {
        res.status(500).json({ error: err.message})
    }
}