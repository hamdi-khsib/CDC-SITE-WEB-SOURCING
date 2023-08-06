const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            min: 2,
            max: 50
        },
        email: {
            type: String,
            required: true,
            unique: true,
            max: 50
        },
        password: {
            type: String,
            required: true,
            min: 5
        },
        address: {
            type: String,
            required: true
        },
        contact: {
            type: String,
            required: true
        },
        domain: {
            type: String,
            required: true
        },
        products: {
            type: String,
            required: true
        },
        prices: {
            type: String,
            required: true
        },
        userType: [{
            type: String,
            default: "Supplier"
        }]
    },
    { timestamps: true }
)

const Supplier = mongoose.model("Supplier", SupplierSchema
)

module.exports = Supplier