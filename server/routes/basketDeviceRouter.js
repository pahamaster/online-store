const Router=require('express');
const router=new Router();
const basketDeviceController=require('../controllers/basketDeviceController');
const authMiddleware=require('../middleware/authMiddleware');

router.post('/', authMiddleware, basketDeviceController.create);
router.get('/', authMiddleware, basketDeviceController.getAll); 
router.delete('/delete', authMiddleware, basketDeviceController.delete); 
//router.delete('/delete', authMiddleware, basketDeviceController.deleteAllByBasketId); 


module.exports=router;