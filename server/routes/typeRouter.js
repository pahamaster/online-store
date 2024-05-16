const Router=require('express');
const router=new Router();
const typeController=require('../controllers/typeController');
const checkRole=require('../middleware/checkRoleMiddleware');

router.post('/', checkRole('ADMIN'), typeController.create);
router.put('/', checkRole('ADMIN'), typeController.update);
router.get('/', typeController.getAll);

module.exports=router;