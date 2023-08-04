import Supplier from "../models/Supplier";

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