const {asyncHandler, asyncTransHandler}=require('../utils/utils');
const ApiError=require('../error/ApiError');
const bcrypt=require('bcrypt');
const {User, Basket}=require('../models/models');
const jwt=require('jsonwebtoken');

const generateJwt=(id, email, role)=>{
  return jwt.sign(
    {id, email, role}, 
    process.env.SECRET_KEY, 
    {expiresIn: '24h'}
  );
}

class UserController {
  registration=asyncTransHandler(async (req, res, transaction, next)=>{
    // const {email, password, role}=req.body;
    const {email, password}=req.body;
    if (!email || !password) {
      return next(ApiError.badRequest('Некорректный email или пароль'));
    }
    const candidate=await User.findOne({where: {email}});
    if (candidate) {
      return next(ApiError.badRequest('Пользователь с таким email уже существует'));
    }
    let role = 'USER';
    const count = await User.count();
    if (!count) {
      role = 'ADMIN';
    }
    const hashPassword=await bcrypt.hash(password, 5);
    const user=await User.create({email, role, password: hashPassword}, {transaction}); 
    await Basket.create({userId: user.id}, {transaction});
    const token=generateJwt(user.id, email, user.role);

    await transaction.commit();
    return res.json({token});
  })

  login=asyncHandler(async (req, res, next)=>{
    const {email, password}=req.body;
    const user=await User.findOne({where: {email}});
    if (!user) {
      return next(ApiError.internal('Пользователь не найден'));
    }
    let comparePassword=bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.internal('Неверный пароль'));
    }
    const token=generateJwt(user.id, email, user.role);
    return res.json({token});
  })

  getOne=asyncHandler(async (req, res)=>{
    const {id}=req.params;
    const freak=await User.findOne({where: {id}})
    return res.json(freak);
  })

  getAll=asyncHandler(async (req, res)=>{
    const users=await User.findAll();
    return res.json(users);
  })

  update=asyncHandler(async (req, res, next)=>{
    const {id, role}=req.body;
    const [count]=await User.update({role}, {where: {id}}); 
    return res.json(count);
  })

  async check(req, res) {
    const token=generateJwt(req.user.id, req.user.email, req.user.role);
    res.json({token});
  }
}

module.exports=new UserController();