const {Order, OrderDevice, OrderStatus}=require('../models/models');
const {asyncHandler}=require('../utils/utils');
const ApiError=require('../error/ApiError');

class OrderStatusController {
  create=asyncHandler(async (req, res, next)=>{
    let {orderId, statusOrderId}=req.body;
    if (!orderId) return next(ApiError.badRequest('Введите oderId!'));

    const orderStatuses=await OrderStatus.getAll({where: {orderId}, include: [StatusOrder]});

    if (orderStatuses.find(i=>i.statusOrder.name.toUpperCase==='FINISHED')) 
      next(ApiError.badRequest('Данный заказ завершен'));

    const orderStatus=await OrderStatus.create({orderId, statusOrderId});

    return res.json(orderStatus);
  })

}

module.exports=new OrderStatusController();