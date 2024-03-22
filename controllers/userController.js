const userModel = require("../models/userModel")

exports.connectFacebook = catchAsync(async(req, res, next)=>{
    const facebookId = req.body
    const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {facebookId}, {new: true})
    res.status(200).json({
        status: "success",
        data: {
            updatedUser
        }
    })
})