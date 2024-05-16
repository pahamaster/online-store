const Router=require('express');
const router=new Router();
const reviewController=require('../controllers/reviewController');
const authMiddleware=require('../middleware/authMiddleware');

router.post('/', authMiddleware, reviewController.create);
router.put('/', authMiddleware, reviewController.update);
// router.get('/:deviceId', reviewController.getAllByDeviceId);
// router.get('/user', authMiddleware, reviewController.getAllByUser);
// router.get('/user/:deviceId', authMiddleware, reviewController.getAllByUser);
router.get('/', reviewController.getByUserIdAndDeviceId);



module.exports=router;