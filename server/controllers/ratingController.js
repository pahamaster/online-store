const {Rating, Device } = require('../models/models');
const {asyncHandler}=require('../utils/utils');
const ApiError = require('../error/ApiError');

class RatingController {
  create=asyncHandler(async (req, res, next)=> {
    const { deviceId, rate } = req.body;
    const device = await Device.findOne({ where: { id: deviceId } });
    if (!device) return next(ApiError.badRequest('Такого товара не существует'));

    let rating = await Rating.findOne({ where: { deviceId, userId: req.user.id } });
    if (rating) return next(ApiError.badRequest('Этот пользователь уже ставил оценку этому товару'));

    rating = await Rating.create({ userId: req.user.id, deviceId, rate });

    return res.json(rating);
  })

  getRating=asyncHandler(async (req, res, next)=> {
    const { deviceId } = req.params;
    const device = await Device.findOne({ where: { id: deviceId } });
    if (!device) return next(ApiError.badRequest('Такого товара не существует'));
    const count = await Rating.count({ where: { deviceId } });
    const sum = await Rating.sum('rate', { where: { deviceId } });
    const rating = sum / count;
    return res.json(rating || 0);
  })

  getRate=asyncHandler(async (req, res, next)=>{
    const { deviceId } = req.params;
    const device = await Device.findOne({ where: { id: deviceId } });
    if (!device) return next(ApiError.badRequest('Такого товара не существует'));
    const data = await Rating.findOne({ where: { userId: req.user.id, deviceId } });
    return res.json(data?.rate || 0);
  })

}

module.exports = new RatingController();