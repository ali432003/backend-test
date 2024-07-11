import jwt from "jsonwebtoken"

const jwtToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })
    res.cookie('jwt', token, {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
         // Important for security, prevents client-side JavaScript from accessing the cookie
        secure: true, // Use secure cookies in production (HTTPS)
        sameSite: 'strict'
    })
}

export default jwtToken