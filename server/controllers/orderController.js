const {Order, OrderDevice, OrderStatus, OrderStatusName, User, Device, Basket, BasketDevice, Brand, Type}=require('../models/models');
const {asyncHandler, asyncTransHandler}=require('../utils/utils');
const ApiError=require('../error/ApiError');
const { Op } = require("sequelize");
const sequelize=require('../db.js');

class OrderController {

  create=asyncTransHandler(async (req, res, transaction, next)=>{
    const basket=await Basket.findOne({where: {userId: req.user.id}, 
      attributes: ['id']});

    let query = {
      where: {basketId: basket.id},
      attributes: [ 'count'],
      include: [
        {
          model: Device,
          required: true, // INNER JOIN
          attributes: [ 'id', 'price', 'count'],
        }
      ]
    };

    const basketDevices=await BasketDevice.findAll(query);

    let deviceLacks=false;
    basketDevices.forEach(i=>
      {if (i.count>i.device.count) deviceLacks=true}
    );
    if (deviceLacks) 
      return next(ApiError.badRequest('Товара на складе не хватает для заказа!')); 
    
    const order=await Order.create({userId: req.user.id, statusId: 1}, {transaction});
    await OrderStatus.create({orderId: order.id, statusId: 1}, {transaction});
    await BasketDevice.destroy({where: {basketId: basket.id}, transaction}); 

    for (const i of basketDevices){
      await OrderDevice.create({
        orderId: order.id,
        deviceId: i.device.id,
        price: i.device.price,
        count: i.count,
      }, {transaction});
      await Device.update({count: i.device.count-i.count}, {where: {id: i.device.id}, transaction});
    }

    await transaction.commit();
    return res.json(order);
  });

  update=asyncHandler(async (req, res, next)=>{
    let {orderId, statusId, admin}=req.body;

    if (!orderId) return next(ApiError.badRequest('Введите orderId!'));

    const orderStatuses=await OrderStatus.findAll({where: {orderId}, 
      include: [{model: OrderStatusName, as: 'status'}]});

    if (orderStatuses.find(i=>i.status.finished)) 
      return next(ApiError.badRequest('Данный заказ завершен!'));

    if (admin) {
      const count=await Order.update({adminId: req.user.id},{where: {id: orderId}});
      return res.json(count);
    }

    if (!statusId) return next(ApiError.badRequest('Введите StatusId'));

    const order=await Order.findOne({where: {id: orderId}, 
      include: [{model: User, as: 'admin'}]
    });
    if (!order) return next(ApiError.badRequest('Такого заказа не существует'));
    if (order.admin.email!==req.user.email) 
      return next(ApiError.badRequest('Этот заказ обрабатывается другим администратором'));

    const orderStatus=await OrderStatus.create({orderId, statusId});
    //await Order.update({statusId, adminId: req.user.id},{where: {id: orderId}});
    await Order.update({statusId},{where: {id: orderId}});

    return res.json(orderStatus);
  })

  getByAdmin=asyncHandler(async (req, res)=>{
    const {limit=5, page=1, orderId, displayMethod=0}=req.query;
    const offset=page*limit-limit;
    if (!orderId) {
      const ordersDisplayMethod=[
        '', //'Все',
        `WHERE ("adminId"=${req.user.id})`, //'Моё сопровождение',
        `WHERE (finished=TRUE AND "adminId"=${req.user.id})`, //'Моё сопровождение законченные',
        `WHERE (finished=FALSE AND "adminId"=${req.user.id}) OR "adminId" IS NULL`, //'Моё сопровождение незаконченные и без сопровождения',
        `WHERE "adminId" IS NULL`, //'Без сопровождения',
      ];

      const queryCount=`SELECT COUNT(orders.id) FROM orders 
      LEFT OUTER JOIN "order_statusNames" AS "status" ON status.id="orders"."statusId"
      ${ordersDisplayMethod[displayMethod]} 
      `;
      const [[{count}]]=await sequelize.query(queryCount);
      
      const queryOrders=`
      SELECT "order".id, "order"."createdAt", finished, admin.email AS admin_email, "user".email AS user_email,
      admin.name AS admin_name, "user".name AS user_name, status.namerus as status_namerus,
      account.sum
      FROM orders AS "order"
      LEFT OUTER JOIN "order_statusNames" AS "status" ON status.id="order"."statusId" 
      LEFT OUTER JOIN users AS admin ON "order"."adminId"=admin.id 
      LEFT OUTER JOIN users AS "user" ON "order"."userId"="user".id
      LEFT OUTER JOIN (
        SELECT SUM(t1.sum), t1."orderId"
        FROM 
        (SELECT count*price AS sum, "orderId"
        FROM order_devices) AS t1
        GROUP BY t1."orderId"
      ) AS account ON "order".id=account."orderId"
      ${ordersDisplayMethod[displayMethod]} 
      ORDER BY id LIMIT ${limit} OFFSET ${offset}`;

      //WHERE (finished=FALSE AND "adminId"=${req.user.id}) OR "adminId" IS NULL  //Своё сопровождение незаконченные и без сопровождения
      //WHERE (finished=FALSE AND "adminId"!=${req.user.id}) OR "adminId" IS NULL  //Чужое сопровождение незаконченные и без сопровождения
      //WHERE (finished=TRUE AND "adminId"=${req.user.id})                        //Своё сопровождение законченные
      //WHERE ("adminId"=${req.user.id})                                          //Своё сопровождение
      //WHERE "adminId" IS NULL                //Без сопровождения

      const [orders]=await sequelize.query(queryOrders);
      for (let i=0; i<orders.length; i++) {
        const queryStatus=`
        SELECT order_status.id, order_status."createdAt", order_status."orderId", order_status."statusId", 
        status.name AS status_name, 
        status.namerus AS status_namerus, 
        status.finished AS status_finished, 
        status.attention AS status_attention
        FROM order_statuses AS order_status
        LEFT OUTER JOIN "order_statusNames" AS status ON order_status."statusId" = status.id
        WHERE order_status."orderId" IN (${orders[i].id}) 
        ORDER BY order_status."createdAt" DESC LIMIT 1`;
        const [status]=await sequelize.query(queryStatus);
        orders[i].status_createdAt=status[0].createdAt;
      }
      return res.json({count, rows: orders});
    } else {
      const query = {
        limit, offset, order: ['createdAt'],
        include: [],
        where: {
          //[Op.or]: [{ adminId: req.user.id }, { adminId: null }]
          id: orderId
        }
      };
  
      query.include.push({model: User, as: 'user'});
      query.include.push({model: OrderStatusName,
        as: 'status',
      });
      query.include.push({model: OrderDevice, 
        include: [{model: Device,
          include: [{model: Brand},{model: Type}]
        }]
      });
      query.include.push({model: OrderStatus,
        separate: true,
        order: [['createdAt', 'DESC']],
        // limit: 1,
        include: [{model: OrderStatusName,
           as: 'status'
          }]
      });
      query.include.push({model: User,
        as: 'admin', foreignKey: 'adminId'
      });
   
      const orders=await Order.findOne(query);
      //console.log(orders);
      return res.json(orders);
    }
  });

  getByUser=asyncHandler(async (req, res)=>{
    const {limit=5, page=1, orderId}=req.query;
    const offset=page*limit-limit;
    const query = {
      limit, offset, order: ['createdAt'],
      include: [],
      where: {userId: req.user.id}
    };
    
    if (orderId) query.where.id=orderId;

    const count=await Order.count(query);

    query.include.push({model: OrderStatusName,
      as: 'status',
    });
    query.include.push({model: OrderDevice, 
      include: [{model: Device,
        include: [{model: Brand},{model: Type}]
      }]
    });

    query.include.push({model: OrderStatus,
      order: [['createdAt', 'DESC']],
      separate: true,
      // limit: 1,
      include: [{model: OrderStatusName,
         as: 'status'
        }]
    });

    const orders=await Order.findAll(query);
    
    return res.json({count, rows:orders});
  })

}

module.exports=new OrderController();