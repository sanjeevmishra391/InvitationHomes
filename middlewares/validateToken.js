const JWT = require('jsonwebtoken');

const validateToken = (req, res, next) => {
    try {
        let token = req.cookies.jwt
        const decodedToken = JWT.verify(token, "secretkey");
        console.log("decoded token", decodedToken)
        if(!decodedToken.id) {
            return res.status(500).send({message: "User not logged in"})
        } 
        next();
    } catch { error => {
        console.log("Token has invalid signature")
        return res.status(401).send({message: "The token is invalid", error})
    }}
}

module.exports = validateToken;