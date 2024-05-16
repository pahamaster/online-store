const {Basket, BasketDevice, Device, Brand, Type}=require('../models/models');
const {asyncHandler}=require('../utils/utils');
const ApiError=require('../error/ApiError');

class BasketDeviceController {
  create=asyncHandler(async (req, res, next)=> {
    const {deviceId}=req.body;
    let {count, addCount}=req.body;

    const device=await Device.findOne({where: {id: deviceId}});
    if (!device) return next(ApiError.badRequest('Такого товара не существует'));
    const basket=await Basket.findOne({where: {userId: req.user.id}});

    let basketDevice=await BasketDevice.findOne({where: {basketId: basket.id, deviceId}});

    if (basketDevice) {
      if (addCount) count=basketDevice.count+ +addCount;
      else {
        if (!count) count=basketDevice.count+1;
        if (count<1) count=1;
      }
      await BasketDevice.update({count}, {where: {basketId: basket.id, deviceId}}); 
    }
    else {
      if (!count || count<1) count=addCount;
      if (count<1) count=1;
      basketDevice=await BasketDevice.create({basketId: basket.id, deviceId, count});
    }
    return res.json(basketDevice);
  })

  delete=asyncHandler(async (req, res)=>{
    const {id}=req.query;
    const basket=await Basket.findOne({where: {userId: req.user.id}});

    let query={where: {basketId: basket.id}};
    if (id) query.where.id=id;
    const count=await BasketDevice.destroy(query); //В result кол-во удаленных строк
    return res.json(count);
  })


  getAll=asyncHandler(async (req, res)=>{
    const basket=await Basket.findOne({where: {userId: req.user.id}});

    let query = {
      where: {basketId: basket.id},
      include: [
        {
          model: Device,
          required: true, // INNER JOIN
          attributes: [ 'id', 'name', 'price', 'count'],
          include: [
            {
              model: Brand,
              required: true,
              attributes: ['name']
            },
            {
              model: Type,
              required: true,
              attributes: ['name']
            }
          ]
        }
      ]
    };

    const basketDevices=await BasketDevice.findAndCountAll(query);
    return res.json(basketDevices);
  })
}

module.exports=new BasketDeviceController();