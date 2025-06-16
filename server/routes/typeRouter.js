const Router = require('express')
const router = new Router()
const TypeControl = require('../controllers/typeControl')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('ADMIN'), TypeControl.create)
router.get('/', TypeControl.getAll)
router.delete('/:id', checkRole('ADMIN'), TypeControl.delete)
router.put('/:id', checkRole('ADMIN'), TypeControl.update)

module.exports = router