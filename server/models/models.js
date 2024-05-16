const sequelize=require('../db.js');
const {DataTypes}=require('sequelize');

const Order=sequelize.define('order', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  adminId: {type: DataTypes.INTEGER, foreignKey: true} 
}, {updatedAt: false});

const OrderDevice=sequelize.define('order_device', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  count: {type: DataTypes.SMALLINT, defaultValue: 1, allowNull: false},
  price: {type: DataTypes.INTEGER, validate: {min: 0}, allowNull: false},
  deviceId: {type: DataTypes.INTEGER, unique: 'deviceId_orderId'},
  orderId: {type: DataTypes.INTEGER, unique: 'deviceId_orderId'},
}, {timestamps: false});

const OrderStatus=sequelize.define('order_status', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, 
} ,{updatedAt: false});

const OrderStatusName=sequelize.define('order_statusName', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, allowNull: false, unique: true},
  namerus: {type: DataTypes.STRING, allowNull: false, unique: true},
  finished: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
  attention: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true},
}, {timestamps: false});

const User=sequelize.define('user', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  email: {type: DataTypes.STRING, unique: true},
  name: {type: DataTypes.STRING},
  //nick: {type: DataTypes.STRING, unique: true},
  password: {type: DataTypes.STRING, allowNull: false},
  role: {type: DataTypes.STRING, defaultValue: 'USER'},
});

const Basket=sequelize.define('basket', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  userId: {type: DataTypes.INTEGER, unique: true},
}, {timestamps: false});

const BasketDevice=sequelize.define('basket_device', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  count: {type: DataTypes.SMALLINT, validate: {min: 1}, defaultValue: 1, allowNull: false},
  deviceId: {type: DataTypes.INTEGER, unique: 'deviceId_basketId'},
  basketId: {type: DataTypes.INTEGER, unique: 'deviceId_basketId'},
});

const Device=sequelize.define('device', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, unique: true, allowNull: false},
  price: {type: DataTypes.INTEGER, validate: {min: 0}, allowNull: false},
  //rating: {type: DataTypes.INTEGER, defaultValue: 0},
  count: {type: DataTypes.INTEGER, validate: {min: 0}, defaultValue: 0, allowNull: false},
  expected: {type: DataTypes.DATEONLY},
  img: {type: DataTypes.STRING, allowNull: false},
}, {timestamps: false});

const Type=sequelize.define('type', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, unique: true, allowNull: false},
}, {timestamps: false});

const Brand=sequelize.define('brand', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, unique: true, allowNull: false},
}, {timestamps: false});

const Rating=sequelize.define('rating', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  rate: {type: DataTypes.INTEGER, allowNull: false},
  deviceId: {type: DataTypes.INTEGER, unique: 'deviceId_userId'},
  userId: {type: DataTypes.INTEGER, unique: 'deviceId_userId'},
}, {updatedAt: false});

const DeviceInfo=sequelize.define('device_info', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  title: {type: DataTypes.STRING, allowNull: false},
  description: {type: DataTypes.STRING, allowNull: false},
}, {timestamps: false});

const Review=sequelize.define('review', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  title: {type: DataTypes.STRING, allowNull: false},
  body: {type: DataTypes.TEXT, allowNull: false},
  deviceId: {type: DataTypes.INTEGER, unique: 'deviceId_userId'},
  userId: {type: DataTypes.INTEGER, unique: 'deviceId_userId'},
}, {updatedAt: false});

const TypeBrand=sequelize.define('type_brand', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
}, {timestamps: false});

//User.hasMany(Order);
Order.belongsTo(User, {
  as: 'user',
  foreignKey: 'userId' 
});

Order.belongsTo(User, 
  {
    as:'admin',
    foreignKey: 'adminId'
  }
)

////////////////////////////
Order.hasMany(OrderDevice);
OrderDevice.belongsTo(Order, 
  {
    //as: ['order'],
    constraints: false,
    foreignKey: ['orderId', 'deviceId']
  }
);
////////////////////////////

Order.hasMany(OrderStatus);
OrderStatus.belongsTo(Order);

//OrderStatusName.hasMany(Order);
Order.belongsTo(OrderStatusName, {
  as: 'status', 
  //constraints: false,
  foreignKey: 'statusId'
});

//OrderStatusName.hasMany(OrderStatus);
OrderStatus.belongsTo(OrderStatusName, {
  as: 'status',
  foreignKey: 'statusId'
});

Device.hasMany(OrderDevice);
OrderDevice.belongsTo(Device);

User.hasOne(Basket);
Basket.belongsTo(User);  //Basket содержит поле userId

User.hasMany(Rating);
Rating.belongsTo(User);

Basket.hasMany(BasketDevice);
BasketDevice.belongsTo(Basket);

Device.hasMany(BasketDevice);
BasketDevice.belongsTo(Device); //BasketDevice cодержит deviceId

Device.hasMany(DeviceInfo, {as: 'info'});
DeviceInfo.belongsTo(Device);

Device.hasMany(Rating);
Rating.belongsTo(Device);
/////////////
User.hasMany(Review);
Review.belongsTo(User);

Device.hasMany(Review);
Review.belongsTo(Device);
///////////////////
Type.hasMany(Device);
Device.belongsTo(Type);

Brand.hasMany(Device);
Device.belongsTo(Brand);

Type.belongsToMany(Brand, {through: TypeBrand});
Brand.belongsToMany(Type, {through: TypeBrand});

const orderStatusNameInit=async ()=>{
  const row=await OrderStatusName.findOne();
  if (!row) {
    const statusNames=[
      {name: 'Accepted', namerus: 'Принято в обработку', attention: true, finished: false},
      {name: 'Finished', namerus: 'Завершено', attention: false, finished: true},
      {name: 'Recall', namerus: 'Перезвонить', attention: true, finished: false},
      {name: 'Pay', namerus: 'Ждёт оплаты', attention: false, finished: false},
      {name: 'Paid', namerus: 'Оплачено', attention: true, finished: false},
      {name: 'Send', namerus: 'Отправляется', attention: false, finished: false},
      {name: 'Sent', namerus: 'Отправлено', attention: false, finished: false},
      {name: 'Cancelled', namerus: 'Отменено', attention: false, finished: true},
      {name: 'Received', namerus: 'Получено', attention: false, finished: false},
      {name: 'Dispute', namerus: 'Спор', attention: true, finished: false},
    ];
    for (const item of statusNames) {
      await OrderStatusName.create(item);
    }
  }
}

orderStatusNameInit();

module.exports={
  User,
  Basket,
  BasketDevice,
  Device,
  Rating,
  Type,
  Brand,
  TypeBrand,
  DeviceInfo,
  Review,
  Order,
  OrderDevice,
  OrderStatus,
  OrderStatusName,
}