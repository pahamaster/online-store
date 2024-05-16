const uuid = require('uuid');
const path = require('path');
const {Device, DeviceInfo, TypeBrand, Type, Brand} = require('../models/models');
const ApiError=require('../error/ApiError');
const {asyncHandler, asyncTransHandler}=require('../utils/utils');
const { Op } = require("sequelize");
const defaultImage='ru_default_large.jpg';

class DeviceController {
  create=asyncTransHandler(async (req, res, transaction, next)=>{
    let {name, price, brandId, typeId} = req.body;
    
    brandId=parseInt(brandId, 10);
    typeId=parseInt(typeId, 10);
    name=name?.trim();

    if (!typeId) return next(ApiError.badRequest('Введите тип'));
    if (!brandId) return next(ApiError.badRequest('Введите бренд'));
    if (!name) return next(ApiError.badRequest('Введите наименование товара'));

    let device=await Device.findOne({where: {name}})
    if (device) 
      return next(ApiError.badRequest('Товар с таким именем уже существует'));

    // const type=await Type.findOne({where:{id: typeId}});
    // if (!type) next(ApiError.badRequest('Тип #'+typeId+' не существует'));
    // const brand=await Brand.findOne({where:{id: brandId}});
    // if (!brand) next(ApiError.badRequest('Бренд #'+brandId+' не существует'));
    
    const countTypeBrand=await TypeBrand.count({where: {typeId, brandId}});
    if (countTypeBrand==0) await TypeBrand.create({typeId, brandId}, {transaction});
    
    let {fileName}=req.body;
    if (!fileName) fileName=defaultImage;

    if (req?.files) {
      const { img } = req?.files;
      if (img) {
        fileName = uuid.v4() + ".jpg";
        img.mv(path.resolve(__dirname, '..', 'static', fileName));
      }
    }

    device = await Device.create({ name, price, brandId, typeId, img: fileName }, {transaction});

    let {info}=req.body;
    if (info) {
      info=JSON.parse(info);
      for (const i of info)
        await DeviceInfo.create({
          title: i.title,
          description: i.description,
          deviceId: device.id
        }, {transaction});
    }

    await transaction.commit();
    return res.json(device);
  })

  update=asyncTransHandler(async (req, res, transaction, next)=> {
    const {id, price, brandId, typeId, addCount} = req.body;

    let count;

    const device=await Device.findOne({where: {id}});
    if (!device) return next(ApiError.badRequest(`Товара с Id #${id} не существует`));

    if (addCount) {
      [count]=await Device.update({count: device.count + +addCount}, {where: {id}});
      await transaction.commit();
      return res.json(count);
    }

    let {name}=req.body;
    name=name?.trim();
    if (!name) return next(ApiError.badRequest('Введите наименование товара'));

    if (device.brandId!=brandId || device.typeId!=typeId) {
      const count=await Device.count({where: {brandId: device.brandId, typeId: device.typeId}});
      if (count==1) await TypeBrand.destroy({where: {brandId: device.brandId, typeId: device.typeId}, transaction});
      const countTypeBrand=await TypeBrand.count({where: {typeId, brandId}});
      if (countTypeBrand==0) await TypeBrand.create({typeId, brandId}, {transaction});
    }

    if (req?.files) {
      const { img } = req?.files;
      if (img) {
        let fileName = uuid.v4() + ".jpg";
        img.mv(path.resolve(__dirname, '..', 'static', fileName));
        [count] = await Device.update({name, price, brandId, typeId, img: fileName }, {where: {id}, transaction});
      }
      else [count] = await Device.update({ name, price, brandId, typeId}, {where: {id}, transaction});
    }
    else [count] = await Device.update({ name, price, brandId, typeId}, {where: {id}, transaction});
    
    let {info, infoForDelete}=req.body;

    if (info && count) {
      info=JSON.parse(info);
      for (const i of info) 
        if (i?.id)
          await DeviceInfo.update({title: i.title, description: i.description}, {where: {id: i.id}, transaction});
        else
          await DeviceInfo.create({title: i.title, description: i.description, deviceId: id}, {transaction});
    }

    if (infoForDelete && count) {
      info=JSON.parse(infoForDelete);
      for (const i of info) await DeviceInfo.destroy({where: {id: i}, transaction});
    }

    await transaction.commit();
    return res.json(count);
  })

  getAll=asyncHandler(async(req, res)=> {
    const {brandId, typeId, limit=9, page=1, substr, instock}=req.query;
    let devices;
    const offset=page*limit-limit;
    if (substr?.trim()) {
      let arStr=substr.trim().split(/\s* /).map(i=>'%'+i+'%');
      let queryBrandLike={
        include: [
          {
            model: Brand,
            where: {name: {[Op.iLike]: {[Op.any]: arStr}}}
          }, {
            model: Type
          }
        ],
        where: {}
      }
      //queryBrandLike.include[0].where.name={[Op.iLike]: {[Op.any]: arStr}};
      let queryTypeLike={
        include: [
          {
            model: Brand
          }, {
            model: Type,
            where: {name: {[Op.iLike]: {[Op.any]: arStr}}}
          }
        ],
        where: {}
      }
      //queryTypeLike.include[1].where.name={[Op.iLike]: {[Op.any]: arStr}};
      let queryDeviceLike={
        include: [
          {
            model: Brand
          }, {
            model: Type
          }
        ],
        where: {name: {[Op.iLike]: {[Op.any]: arStr}}}
      }
      if (instock=='true') {
        queryDeviceLike.where.count={[Op.ne]: 0};
        queryTypeLike.where.count={[Op.ne]: 0};
        queryBrandLike.where.count={[Op.ne]: 0};
      }
      if (brandId) {
        queryBrandLike.where.brandId=brandId;
        queryTypeLike.where.brandId=brandId;
        queryDeviceLike.where.brandId=brandId;
      }
      if (typeId) {
        queryBrandLike.where.typeId=typeId;
        queryTypeLike.where.typeId=typeId;
        queryDeviceLike.where.typeId=typeId;
      }
      //queryDeviceLike.where.name={[Op.iLike]: {[Op.any]: arStr}};
      
      const d1=await Device.findAndCountAll(queryDeviceLike);
      const d2=await Device.findAndCountAll(queryBrandLike);
      const d3=await Device.findAndCountAll(queryTypeLike);

      const d=[...d1.rows, ...d2.rows, ...d3.rows];

      let setId=new Set([]);
      const ds=d.filter(item=>{        //Удаляем дубликаты
        const f=setId.has(item.id);
        setId.add(item.id);
        return !f;
      });
      devices={
        count: ds.length,
        rows: ds.slice(offset, offset+ +limit)
      };
      return res.json(devices);
    }

    let query={
      include: [
        {model: Brand}, 
        {model: Type}
      ],
      where: {}, limit, offset, order: ['name']
    }
    
    if (brandId) query.where.brandId=brandId;
    if (typeId) query.where.typeId=typeId;
    if (instock=='true') query.where.count={[Op.ne]: 0}
    devices= await Device.findAndCountAll(query);
    return res.json(devices);
  })

  getAllExport=asyncHandler(async(req, res)=> {
    const query={
      attributes: [
        'id', 'name', 'price', 'typeId', 'brandId', 'img'
      ]
    }
    const devices= await Device.findAll(query);
    return res.json(devices);
  })

  getOne=asyncHandler(async (req, res)=>{
    const {id}=req.params;
    const device=await Device.findOne(
      {
        where: {id},
        include: [
          {model: DeviceInfo, as: 'info'},
          {model: Brand}, 
          {model: Type}
        ]
      }
    )
    return res.json(device);
  })
}

module.exports = new DeviceController();