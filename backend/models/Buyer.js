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
        contact: {
            type: String,
            required: true
        },
        userType: [{
            type: String,
            default: "Buyer"
        }]
    },
    { timestamps: true }
)

const Buyer = mongoose.model("Buyer", SupplierSchema)

module.exports = Buyer