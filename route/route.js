const auth = require("../Controllers/authController")
const loginController = require("../Controllers/loginController")
const homeController = require("../Controllers/homeController")
const reserveController = require("../Controllers/reserveController")
const responseReserveController = require("../Controllers/responseReserveController")
const apiController = require("../Controllers/apiController")
const registerController = require("../Controllers/registerController")
const groupController = require("../Controllers/groupController")
const roomController = require("../Controllers/roomController")
const passwordController = require("../Controllers/passwordController")
const express = require('express')
const app = express()
const router = express.Router()

// router.use(function timeLog (req, res, next) {
//     console.log('Time: ', Date.now())
//     next()
//   })

router.get('/', auth.auth, homeController.getHomePage)

router.get('/api/homepage', auth.auth, apiController.homepage)
router.get('/api/homepage/:id', auth.auth, apiController.reserveDetail)
router.get('/api/homepage/:id/cancelreservation', auth.auth, reserveController.cancelReserve)
router.get('/api/reservation', apiController.reservation)
router.get('/api/responsereserve', auth.isAdmin, apiController.responseReservePage)
router.get('/api/group', auth.isAdmin, apiController.group)
router.get('/api/group/:id', auth.isAdmin, apiController.groupDetail)
router.get('/api/creategroup', apiController.groupCreate)
router.get('/api/roomcreate', auth.isAdmin, apiController.roomcreate)
router.get('/api/profile', auth.auth, apiController.profileDetail)

router.post('/register', registerController.register)
router.get('/auth', loginController.IsAuth)
router.post('/login', loginController.postLogin)
router.get('/logout', auth.auth, loginController.logout)
router.post('/logg', loginController.testlogg)
router.post('/reserve', reserveController.reserve)
router.post('/responseReserve', auth.isAdmin, responseReserveController.responseReserve)
router.post('/group/:id', auth.isAdmin, groupController.editgroup)
router.post('/groupcreate', auth.isAdmin, groupController.create)
router.post('/roomcreate', auth.isAdmin, roomController.create)
router.post('/changepassword', auth.auth, passwordController.changePassword)
// exports.loginPage = () => {
//     console.log('qwropekwdtgfopdk')
//     app.get('/login', auth.no_auth, loginPage.getLoginPage)
// }

module.exports = router