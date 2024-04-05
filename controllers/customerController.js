const customerModel = require("../models/customerModel")
const userModel = require("../models/userModel")

exports.createCustomer = async(req, res, next) =>{
    try {
        const {name, email, phoneNumber, address, city, country, state} = req.body
        const authenticatedUser = await userModel.findById(req.user._id)
    
        const newCustomer = await customerModel.create({
            name,
            email,
            phoneNumber,
            address,
            city,
            country,
            billing_address: req.body.blling_address?req.body.billing_address : authenticatedUser.address
    
        })


        res.status(201).json({
            status: "success",
            data: {
                newCustomer
            }
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Error Occured!",
            error: err
        })
    }
}