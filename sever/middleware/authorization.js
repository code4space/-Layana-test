const Users = require("../model/user")
const handleError = require("../helper/error")
const { verifyToken } = require("../helper/jwt")

async function authorization(req, res, next) {
    try {
        const accessToken = req.headers.access_token
        let payload = verifyToken(accessToken)
        let user = await Users.findById(payload.id)
        if (!user.admin) throw handleError('Forbidden', 'Only admin can do this acts')
        next()
    } catch (error) {
        next(error);
    }
}

module.exports = {
    authorization,
};
