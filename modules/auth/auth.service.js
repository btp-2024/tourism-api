import * as jose from 'jose'

const secret = new TextEncoder().encode(
	process.env.JWT_SECRET
)

export const signJWTToken = async (payload) => {
	const alg = 'HS256'
	
	const jwt = await new jose.SignJWT(payload)
		.setProtectedHeader({ alg })
		.setIssuedAt()
		.setIssuer('urn:tourism:issuer')
		.setAudience('urn:tourism:audience')
		.setExpirationTime('7d')
		.sign(secret)
	
	return jwt
}


export const verifyJWTToken = async (token) => {
	try {
		const decode = await jose.jwtVerify(token, secret)
		return decode
	}
	catch(e) {
		throw new Error('Invalid auth token')
	}
}