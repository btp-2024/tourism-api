import express, { json, urlencoded } from 'express'
import 'dotenv/config'
import { connect } from 'mongoose'
import cors from 'cors'
import { authController } from './modules/auth/auth.controller.js'

const PORT = process.env.PORT || 8000

const app = express()
app.use(cors())
app.use(json())
app.use(urlencoded({
	extended: true
}))

app.use('/auth', authController)

app.get('/hello', (req, res, next) => {
	res.json('Hello')
})

const bootstrap = async () => {
	try {
		await connect(process.env.DATABASE_URL)
		app.listen(PORT, () => {
			console.log(`[server] listening on ${PORT}`)
		})
	}
	catch(e) {
		console.error(`[error] ${e}`)
		process.exit(1)
	}
}


bootstrap()