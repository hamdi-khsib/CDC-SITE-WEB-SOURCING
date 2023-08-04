import mongoose from "mongoose";

const SupplierSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            min: 2,
            max: 50
        },
        lastName: {
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
        picturePath: {
            type: String,
            default: ""
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

export default Supplier