const {DeviceInfo}=require('../models/models');
const {asyncHandler}=require('../utils/utils');
//const ApiError=require('../error/ApiError');

class InfoController {

  getAll=asyncHandler(async (req, res)=>{
    const query = {
      attributes: ['id', 'title', 'description', 'deviceId' ]
    };

    const infos=await DeviceInfo.findAll(query);
    return res.json(infos);
  })

  create=asyncHandler(async (req, res)=>{
    const {title, description, deviceId}=req.body;

    const infos=await DeviceInfo.create({title, description, deviceId});
    return res.json(infos);
  })
}

module.exports=new InfoController();