const Router=require('express');
const router=new Router();
const orderController=require('../controllers/orderController');
const checkRole=require('../middleware/checkRoleMiddleware');
const authMiddleware=require('../middleware/authMiddleware');

router.post('/', authMiddleware, orderController.create);
router.put('/', authMiddleware, orderController.update);
router.get('/',  checkRole('ADMIN'), orderController.getByAdmin); 
router.get('/user', authMiddleware, orderController.getByUser);


module.exports=router;