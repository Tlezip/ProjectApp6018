const auth = require("../Controllers/authController")
const loginController = require("../Controllers/loginController")
const homeController = require("../Controllers/homeController")
const express = require('express')
const app = express()
const router = express.Router()

// router.use(function timeLog (req, res, next) {
//     console.log('Time: ', Date.now())
//     next()
//   })

router.get('/', auth.auth, homeController.getHomePage)


router.get('/login', auth.no_auth, loginController.getLoginPage)
router.post('/login', loginController.postLogin)
router.get('/logout', auth.auth, loginController.logout)
// exports.loginPage = () => {
//     console.log('qwropekwdtgfopdk')
//     app.get('/login', auth.no_auth, loginPage.getLoginPage)
// }

module.exports = router