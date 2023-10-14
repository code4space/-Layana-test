const route = require("express").Router();
const User = require('../controllers/user')
const auth = require('../middleware/authentication')
const { authorization } = require('../middleware/authorization')
const Admin = require("../controllers/admin");

route.post('/user/login', User.login)
route.post('/user/register', User.register)

route.post('/admin/login', Admin.login)

//? Authentication
route.use(auth)

//? Karyawan API
route.get("/product", User.getProduct)
route.post("/product", User.addProduct)
route.patch("/product/:id", User.editProduct)
route.delete("/product/:id", User.deleteProduct)

//? ADMIN API
route.get("/product/all", authorization, Admin.getAllProduct)
route.patch("/product/admin/:id", authorization, Admin.editProduct)
route.delete("/product/admin/:id", authorization, Admin.deleteProduct)


module.exports = route;
