const ApiError=require('../error/ApiError'); 
const sequelize=require('../db.js');

const asyncHandler = fn => async (req, res, next) =>
{
  try {
    return Promise.resolve(fn(req, res, next));
  }
  catch (e) {
    return next(ApiError.internal(e.message));
  }
}

const asyncTransHandler = fn => async (req, res, next) =>
{
  const t = await sequelize.transaction();
  return Promise.resolve(fn(req, res, t, next))
    .catch(async e=>{
      await t.rollback();
      return next(ApiError.internal(e.message))
    });
}

module.exports={asyncHandler, asyncTransHandler};

// First, we start a transaction and save it into a variable
// const t = await sequelize.transaction();
// try {
//   const user = await User.create({firstName: 'Bart', lastName: 'Simpson'
//   }, { transaction: t });
//   await user.addSibling({firstName: 'Lisa', lastName: 'Simpson'
//   }, { transaction: t });
//   await t.commit();
// } catch (error) {
//   await t.rollback();
// }