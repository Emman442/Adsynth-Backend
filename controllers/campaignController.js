const campaignModel = require("../models/campaignModel")
const userModel = require("../models/userModel")


exports.createCampaign = async(req, res, next) =>{
   try {
     const {name, purpose, start_date, end_date} = req.body

     const authenticatedUser = await userModel.findById(req.user._id)
 
     const newCampaign = await campaignModel.create({
         name,
         purpose,
         start_date,
         end_date,
         createdBy: req.user._id
     })


      authenticatedUser.campaigns.push(newCampaign._id)
      await authenticatedUser.save({validateBeforeSave: false})
     
 
     res.status(201).json({
        status: "success",
        data: {
            newCampaign
        }
     })
   } catch (error) {
    return res.status(500).json({
        message: "error Occured",
        error: error
    })
   }
}

exports.fetchUserCampaigns = async(req, res, next)=>{
    try {
        let userId;
        userId = req.params.id ? req.params.id : req.user._id;
        const user = await userModel.findById(userId).populate("campaigns");
        const campaigns = user.campaigns;

        res.status(200).json({
          status: "success",
          data: {
            campaigns,
          },
        });
    } catch (error) {
        return res.status(500).json({
          message: "error Occured",
          error: error,
        });
    }
}