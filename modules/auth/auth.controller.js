import { Router } from "express";
import { UserModel } from "../users/users.model.js";
import { hash, verify } from "argon2";
import { signJWTToken } from "./auth.service.js";
import { requireAuth } from "./auth.middleware.js";

const router = Router()
export const authController = router

router.post('/', async (req, res, next) => {
	try {
		const { name, email, password } = req.body
		const hashed = await hash(password)

		const user = await UserModel.create({
			name,
			email,
			password: hashed,
			isAdmin: true
		})

		const jwt = await signJWTToken({
			_id: user._id
		})

		res.status(201).json({
			token: jwt
		})
	}
	catch(e) {
		console.error(e)
		res.status(500).json({
			error: 'Internal server error',
			message: e.message
		})
	}
})


router.post('/login', async (req, res, next) => {
	try {
		const { email, password } = req.body
		const user = await UserModel.findOne({
			email
		})

		if(!user) {
			return res.status(404).json({
				message: 'No User Found'
			})
			
		}

		if(!await verify(user.password, password)) {
			return res.status(401).json({
				message: 'Wrong password'
			})
			
		}

		const token = await signJWTToken({
			_id: user._id
		})
		res.json({
			token
		})
	}
	catch(e) {
		res.status(400).json({
			error: 'Bad Request',
			message: e.message
		})
	}
})


router.get('/me', requireAuth, async (req, res, next) => {
	try {
		res.json(req.user)
	}
	catch(e) {
		res.status(401).json({
			message: 'Unauthorized request'
		})
	}
})