const Router=require('express');
const router=new Router();
const deviceController=require('../controllers/deviceController');
const checkRole=require('../middleware/checkRoleMiddleware');

router.post('/', checkRole('ADMIN'), deviceController.create);
router.put('/', checkRole('ADMIN'), deviceController.update);
router.get('/', deviceController.getAll);
router.get('/export', checkRole('ADMIN'), deviceController.getAllExport);
router.get('/:id', deviceController.getOne);  //Например /api/device/1

module.exports=router;