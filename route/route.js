const auth = require("../Controllers/authController")
const loginController = require("../Controllers/loginController")
const homeController = require("../Controllers/homeController")
const reserveController = require("../Controllers/reserveController")
const responseReserveController = require("../Controllers/responseReserveController")
const apiController = require("../Controllers/apiController")
const express = require('express')
const app = express()
const router = express.Router()

// router.use(function timeLog (req, res, next) {
//     console.log('Time: ', Date.now())
//     next()
//   })

router.get('/', auth.auth, homeController.getHomePage)

router.get('/api/homepage', auth.auth, apiController.homepage)
router.get('/api/homepage/:id', auth.auth, apiController.roomID)
router.get('/api/homepage/:id/cancelreservation', auth.auth, reserveController.cancelReserve)
router.get('/api/reservation', apiController.reservation)
router.get('/api/responsereserve', apiController.responseReservePage)

router.get('/auth', loginController.IsAuth)
router.post('/login', loginController.postLogin)
router.get('/logout', auth.auth, loginController.logout)
router.post('/logg', loginController.testlogg)
router.post('/reserve', reserveController.reserve)
router.post('/responseReserve', responseReserveController.responseReserve)
// exports.loginPage = () => {
//     console.log('qwropekwdtgfopdk')
//     app.get('/login', auth.no_auth, loginPage.getLoginPage)
// }

module.exports = router