const Router=require('express');
const router=new Router();
const orderStatusNameController=require('../controllers/orderStatusNameController');
const checkRole=require('../middleware/checkRoleMiddleware');
const authMiddleware=require('../middleware/authMiddleware');

//router.post('/', checkRole('ADMIN'), orderStatusNameController.create);
//router.put('/', authMiddleware, orderController.update);
router.get('/',  checkRole('ADMIN'), orderStatusNameController.getAll); 


module.exports=router;