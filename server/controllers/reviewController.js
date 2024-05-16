const {Review, Device, User, Brand}=require('../models/models');
const {asyncHandler}=require('../utils/utils');
const ApiError=require('../error/ApiError');

class ReviewController {
  create=asyncHandler(async (req, res, next)=>{
    let {title, body, deviceId}=req.body;

    title=title?.trim();
    if (!title) return next(ApiError.badRequest('Введите заголовок'));
    body=body?.trim();
    if (!body) return next(ApiError.badRequest('Введите отзыв'));

    if (!deviceId) return next(ApiError.badRequest('Введите Id товара'));
    const device = await Device.findOne({ where: { id: deviceId } });
    if (!device) return next(ApiError.badRequest('Такого товара не существует'));

    let review = await Review.findOne({ where: { deviceId, userId: req.user.id } });
    if (review) return next(ApiError.badRequest('Этот пользователь уже оставлял отзыв этому товару'));

    review=await Review.create({title, body, deviceId, userId: req.user.id});
    return res.json(review);
  })

  update=asyncHandler(async (req, res, next)=>{
    let {title, body, deviceId}=req.body;

    title=title?.trim();
    body=body?.trim();
    if (!title && !body) return next(ApiError.badRequest('Введите заголовок или текст отзыва'));

    if (!deviceId) return next(ApiError.badRequest('Введите Id товара'));
    const device = await Device.findOne({ where: { id: deviceId } });
    if (!device) return next(ApiError.badRequest('Такого товара не существует'));

    let review = await Review.findOne({ where: { deviceId, userId: req.user.id } });
    if (!review) return next(ApiError.badRequest('Этот пользователь ещё не оставлял отзыв этому товару'));

    let query={};
    if (title) query.title=title;
    if (body) query.body=body;

    const [count]=await Review.update(query, {where: {deviceId, userId: req.user.id}});
    return res.json(count);
  })

  getByUserIdAndDeviceId=asyncHandler(async (req, res, next)=>{
    const {userId, deviceId, limit=5, page=1}=req.query;
    const offset=page*limit-limit;
    if (!userId && !deviceId) return next(ApiError.badRequest('Укажите userId и/или deviceId'));
    let query={
      where: {}, limit, offset, order:['title'],
      include: [{model: User}, {model: Device, attributes: ['name'], include: [{model: Brand, attributes: ['name']}]}]
    };
    if (userId) query.where.userId=userId;
    if (deviceId) query.where.deviceId=deviceId;
    const review=await Review.findAndCountAll(query);
    return res.json(review);
  })
}

module.exports=new ReviewController();