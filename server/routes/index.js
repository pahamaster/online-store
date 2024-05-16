const Router=require('express');
const router=new Router();
const userRouter=require('./userRouter');
const brandRouter=require('./brandRouter');
const typeRouter=require('./typeRouter');
const deviceRouter=require('./deviceRouter');
const basketDeviceRouter=require('./basketDeviceRouter');
const ratingRouter=require('./ratingRouter');
const infoRouter=require('./infoRouter');
const reviewRouter=require('./reviewRouter');
const orderRouter=require('./orderRouter');
const orderStatusNameRouter=require('./orderStatusNameRouter');

router.use('/user', userRouter);
router.use('/type', typeRouter);
router.use('/brand', brandRouter);
router.use('/device', deviceRouter);
router.use('/basketdevice', basketDeviceRouter);
router.use('/rating', ratingRouter);
router.use('/info', infoRouter);
router.use('/review', reviewRouter);
router.use('/order', orderRouter);
router.use('/orderstatusname', orderStatusNameRouter);

module.exports=router;