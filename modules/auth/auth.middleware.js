import { UserModel } from "../users/users.model.js"
import { verifyJWTToken } from "./auth.service.js"

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
export const requireAuth = async (req, res, next) => {
	try {
		const token = req.headers.authorization
		if(!token) {
			throw new Error('Token not provided')
		}

		const { payload } = await verifyJWTToken(token)
		console.log(payload)
		const user = await UserModel.findOne({
			_id: payload._id
		}, '_id name email isAdmin')
		if(!user) {
			throw Error('User not found')
		}

		req.user = user
		next()
	}
	catch(e) {
		res.status(401).json({
			error: 'Unauthorized request',
			message: e.message
		})
	}
}