const {Type, Brand}=require('../models/models');
const {asyncHandler}=require('../utils/utils');
const ApiError=require('../error/ApiError');

class TypeController {
  create=asyncHandler(async (req, res, next)=>{
    let {name}=req.body;
    name=name?.trim();
    if (!name) return next(ApiError.badRequest('Введите наименование типа'));
    let type=await Type.findOne({where: {name}});
    if (type) return next(ApiError.badRequest('Тип с таким именем уже существует'));

    type=await Type.create({name});
    return res.json(type);
  })

  update=asyncHandler(async (req, res, next)=>{
    const {id}=req.body;
    let {name}=req.body;
    name=name?.trim();
    if (!name) return next(ApiError.badRequest('Введите наименование типа'));
    const [count]=await Type.update({name}, {where: {id}}); 
    return res.json(count);
  })

  getAll=asyncHandler(async (req, res)=>{
    const query = {
      include: [{
        model: Brand
      }],
      order: ['name']
    };

    const types=await Type.findAll(query);
    return res.json(types);
  })
}

module.exports=new TypeController();