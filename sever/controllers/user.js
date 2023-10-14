const { comparePassword, hashPassword } = require('../helper/bcrypt')
const path = require('path');
const handleError = require('../helper/error')
const { getToken } = require('../helper/jwt')
const Products = require('../model/product')
const Users = require('../model/user')

class User {
    static async login(req, res, next) {
        try {
            const { email, password } = req.body
            if (!email) throw handleError('Unauthorized', 'email is required!')
            if (!password) throw handleError('Unauthorized', 'Password is required!')

            const user = await Users.findOne({ email })
            if (!user || !comparePassword(password, user.password) || user.admin) {
                throw handleError('Not Found', 'Invalid email or Password!')
            }

            const payload = { id: user.id };
            const access_token = getToken(payload)

            res.status(200).json({ access_token })
        } catch (error) {
            next(error)
        }
    }

    static async register(req, res, next) {
        try {
            let { username, firstname, lastname, email, password } = req.body
            if (!email) throw handleError('Bad Request', 'email is required!')
            if (!password) throw handleError('Bad Request', 'password is required!')
            if (!username) throw handleError('Bad Request', 'username is required!')
            if (!firstname) throw handleError('Bad Request', 'firstname is required!')
            if (!lastname) lastname = ""

            await Users.create({
                username, firstname, lastname, email, password: hashPassword(password), admin: false
            }).catch(error => {
                const key = Object.keys(error.keyValue)
                if (error.code === 11000) throw handleError('Conflict', `User with ${key} ${error.keyValue[key]} already exist`)
            })
            res.status(201).json({ message: `User with email ${email} has been created` })
        } catch (error) {
            next(error)
        }
    }

    static async getProduct(req, res, next) {
        try {
            const query = req.query
            const perPage = 15;
            const skip = ((query?.page || 1) - 1) * perPage;
            const product = await Products.find({
                uploaded_by: req.user.name
            }, "-__v", { sort: { "date_input": -1 } }).skip(skip).limit(perPage)
            res.status(201).json({ data: product })
        } catch (error) {
            next(error)
        }
    }

    static async addProduct(req, res, next) {
        try {
            const { product_name, qty, brand, image } = req.body
            if (!product_name) throw handleError('Bad Request', 'product_name is required!')
            if (!qty) throw handleError('Bad Request', 'qty is required!')
            if (!brand) throw handleError('Bad Request', 'brand is required!')
            if (!image) throw handleError('Bad Request', 'image is required!')

            await Products.create({ product_name, qty, brand, image, uploaded_by: req.user.name, date_input: new Date() })
            res.status(201).json({ message: `Success create product with product name ${product_name}` })
        } catch (error) {
            next(error)
        }
    }

    static async editProduct(req, res, next) {
        try {
            let { product_name, qty, brand, image } = req.body
            const { id } = req.params
            if (!product_name) throw handleError('Bad Request', 'product_name is required!')
            if (!qty) qty = 0
            if (!brand) throw handleError('Bad Request', 'brand is required!')
            if (!image) throw handleError('Bad Request', 'image is required!')
            if (!id) throw handleError('Bad Request', 'id is required!')

            await Products.updateOne({ _id: id, uploaded_by: req.user.name },
                { $set: { product_name, qty, brand, image } })
            res.status(201).json({ message: `Success edit product with product name ${product_name}` })
        } catch (error) {
            next(error)
        }
    }

    static async deleteProduct(req, res, next) {
        try {
            let { id } = req.params
            if (!id) throw handleError('Bad Request', 'id is required!')

            await Products.deleteOne({ _id: id, uploaded_by: req.user.name })
            res.status(201).json({ message: `Success delete product with product id ${id}` })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = User