const {Order, OrderDevice, OrderStatus, OrderStatusName}=require('../models/models');
const {asyncHandler}=require('../utils/utils');
const ApiError=require('../error/ApiError');

class OrderStatusNameController {
  create=asyncHandler(async (req, res, next)=>{
    
  })

  getAll=asyncHandler(async(req, res, next)=>{
    const statuses=await OrderStatusName.findAll();
    return res.json(statuses);
  });

}

module.exports=new OrderStatusNameController();