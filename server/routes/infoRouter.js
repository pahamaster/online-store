const Router=require('express');
const router=new Router();
const infoController=require('../controllers/infoController');
//const authMiddleware=require('../middleware/authMiddleware');
const checkRole=require('../middleware/checkRoleMiddleware');


router.get('/', checkRole('ADMIN'), infoController.getAll);
router.post('/', checkRole('ADMIN'), infoController.create);


module.exports=router;