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