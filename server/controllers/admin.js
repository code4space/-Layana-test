const { comparePassword, hashPassword } = require('../helper/bcrypt')
const handleError = require('../helper/error')
const { getToken } = require('../helper/jwt')
const Products = require('../model/product')
const Users = require('../model/user')

class Admin {
    static async login(req, res, next) {
        try {
            const { email, password } = req.body
            if (!email) throw handleError('Unauthorized', 'email is required!')
            if (!password) throw handleError('Unauthorized', 'Password is required!')

            const user = await Users.findOne({ email })
            if (!user || !comparePassword(password, user.password) || !user.admin) {
                throw handleError('Not Found', 'Invalid email or Password!')
            }

            const payload = { id: user.id };
            const access_token = getToken(payload)

            res.status(200).json({ access_token })
        } catch (error) {
            next(error)
        }
    }

    static async getAllProduct(req, res, next) {
        try {
            const query = req.query
            const perPage = 15;
            const skip = ((query?.page || 1) - 1) * perPage;
            const product = await Products.find({}, "-__v", { sort: { "date_input": -1 } }).skip(skip).limit(perPage)
            const countProduct = await Products.countDocuments({})
            const totalPages = Math.ceil(countProduct / perPage);
            res.status(201).json({ data: product, totalPages })
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

            await Products.updateOne({ _id: id },
                { $set: { product_name, qty, brand, image } })
            console.log(id)
            res.status(201).json({ message: `Success edit product with product name ${product_name}` })
        } catch (error) {
            next(error)
        }
    }

    static async deleteProduct(req, res, next) {
        try {
            let { id } = req.params
            if (!id) throw handleError('Bad Request', 'id is required!')

            await Products.deleteOne({ _id: id })
            res.status(201).json({ message: `Success delete product with product id ${id}` })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = Admin