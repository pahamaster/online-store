const {Type, Brand}=require('../models/models');
const {asyncHandler}=require('../utils/utils');
const ApiError=require('../error/ApiError');

class BrandController {
  create=asyncHandler(async (req, res, next)=> {
    let {name}=req.body;
    name=name?.trim();
    if (!name) return next(ApiError.badRequest('Введите наименование бренда'));
    let brand=await Brand.findOne({where: {name}});
    if (brand) return next(ApiError.badRequest('Бренд с таким именем уже существует'));

    brand=await Brand.create({name});
    return res.json(brand);
  })

  update=asyncHandler(async (req, res, next)=> {
    const {id}=req.body;
    let {name}=req.body;
    name=name?.trim();
    if (!name) return next(ApiError.badRequest('Введите наименование бренда'));
    const [count]=await Brand.update({name}, {where: {id}}); 
    return res.json(count);
  })

  getAll=asyncHandler(async (req, res)=>{
    let query = {
      include: [{
        model: Type
      }],
      order: ['name']
    };

    const brands=await Brand.findAll(query);
    return res.json(brands);
  })
}

module.exports=new BrandController();