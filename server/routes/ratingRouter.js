const Router=require('express');
const router=new Router();
const ratingController=require('../controllers/ratingController');
const authMiddleware=require('../middleware/authMiddleware');

router.post('/', authMiddleware, ratingController.create);
router.get('/:deviceId', ratingController.getRating); 
router.get('/user/:deviceId', authMiddleware, ratingController.getRate);


module.exports=router;